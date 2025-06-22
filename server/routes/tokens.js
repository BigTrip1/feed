const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const logger = require('../utils/logger');
const { getDemoTokens, getDemoStats } = require('../services/demoData');
const mongoose = require('mongoose');

// Helper function to check if database is connected
const isDatabaseConnected = () => {
    return mongoose.connection.readyState === 1;
};

// GET /api/tokens - Get all tokens with filtering and pagination
router.get('/', async (req, res) => {
    try {
        // Check if database is connected
        if (!isDatabaseConnected()) {
            // Return demo data
            const demoTokens = getDemoTokens(parseInt(req.query.limit) || 50);
            return res.json({
                success: true,
                data: demoTokens,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalTokens: demoTokens.length,
                    hasNextPage: false,
                    hasPrevPage: false
                },
                demo: true
            });
        }

        const {
            page = 1,
            limit = 50,
            category,
            minMarketCap,
            maxMarketCap,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search
        } = req.query;

        // Build filter object
        const filter = { isActive: true };
        
        if (category) filter.category = category;
        if (minMarketCap) filter.marketCap = { ...filter.marketCap, $gte: parseFloat(minMarketCap) };
        if (maxMarketCap) filter.marketCap = { ...filter.marketCap, $lte: parseFloat(maxMarketCap) };
        if (search) {
            filter.$or = [
                { tokenName: { $regex: search, $options: 'i' } },
                { symbol: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query with pagination
        const tokens = await Token.find(filter)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .lean();

        // Get total count for pagination
        const totalTokens = await Token.countDocuments(filter);
        const totalPages = Math.ceil(totalTokens / parseInt(limit));

        res.json({
            success: true,
            data: tokens,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalTokens,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        logger.error('Error fetching tokens:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tokens',
            message: error.message
        });
    }
});

// GET /api/tokens/trending - Get trending tokens
router.get('/trending', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        // Check if database is connected
        if (!isDatabaseConnected()) {
            const demoTokens = getDemoTokens(parseInt(limit));
            return res.json({
                success: true,
                data: demoTokens.slice(0, parseInt(limit)),
                demo: true
            });
        }
        
        const trendingTokens = await Token.find({ isActive: true })
            .sort({ alphaScore: -1, volume24h: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            data: trendingTokens
        });

    } catch (error) {
        logger.error('Error fetching trending tokens:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch trending tokens'
        });
    }
});

// GET /api/tokens/categories - Get available categories
router.get('/categories', async (req, res) => {
    try {
        // Check if database is connected
        if (!isDatabaseConnected()) {
            const categories = ['Alpha Hunters', 'Moon Scouts', 'Diamond Watch', 'New Launch', 'Trending', 'Featured'];
            return res.json({
                success: true,
                data: categories,
                demo: true
            });
        }
        
        const categories = await Token.distinct('category', { isActive: true });
        
        res.json({
            success: true,
            data: categories
        });

    } catch (error) {
        logger.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

// GET /api/tokens/stats - Get overall statistics
router.get('/stats', async (req, res) => {
    try {
        // Check if database is connected
        if (!isDatabaseConnected()) {
            // Return demo stats
            const demoStats = getDemoStats();
            return res.json({
                success: true,
                data: {
                    overall: demoStats,
                    byCategory: []
                },
                demo: true
            });
        }

        const stats = await Token.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalTokens: { $sum: 1 },
                    totalMarketCap: { $sum: '$marketCap' },
                    totalVolume: { $sum: '$volume24h' },
                    avgAlphaScore: { $avg: '$alphaScore' },
                    topGainer: { $max: '$performanceChange' },
                    topLoser: { $min: '$performanceChange' }
                }
            }
        ]);

        const categoryStats = await Token.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgMarketCap: { $avg: '$marketCap' },
                    avgAlphaScore: { $avg: '$alphaScore' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                overall: stats[0] || {},
                byCategory: categoryStats
            }
        });

    } catch (error) {
        logger.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

// GET /api/tokens/:id - Get single token by ID
router.get('/:id', async (req, res) => {
    try {
        // Check if database is connected
        if (!isDatabaseConnected()) {
            const demoTokens = getDemoTokens(100);
            const token = demoTokens.find(t => t._id === req.params.id);
            
            if (!token) {
                return res.status(404).json({
                    success: false,
                    error: 'Token not found',
                    demo: true
                });
            }

            return res.json({
                success: true,
                data: token,
                demo: true
            });
        }
        
        const token = await Token.findById(req.params.id);
        
        if (!token) {
            return res.status(404).json({
                success: false,
                error: 'Token not found'
            });
        }

        res.json({
            success: true,
            data: token
        });

    } catch (error) {
        logger.error('Error fetching token:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch token'
        });
    }
});

// POST /api/tokens - Create new token (for testing)
router.post('/', async (req, res) => {
    try {
        const token = new Token(req.body);
        await token.save();

        logger.info(`🎯 New token created: ${token.tokenName}`);

        res.status(201).json({
            success: true,
            data: token
        });

    } catch (error) {
        logger.error('Error creating token:', error);
        res.status(400).json({
            success: false,
            error: 'Failed to create token',
            message: error.message
        });
    }
});

module.exports = router; 