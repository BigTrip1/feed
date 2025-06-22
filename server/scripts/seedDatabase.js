const mongoose = require('mongoose');
const { connectDatabase } = require('../config/database');
const { generateBatchTokens } = require('../services/tokenGenerator');
const logger = require('../utils/logger');
require('dotenv').config();

async function seedDatabase() {
    try {
        logger.info('🌱 Starting database seeding...');
        
        // Connect to database
        await connectDatabase();
        
        // Clear existing data (optional)
        const Token = require('../models/Token');
        await Token.deleteMany({});
        logger.info('🗑️  Cleared existing tokens');
        
        // Generate initial batch of tokens
        const tokens = await generateBatchTokens(50);
        
        logger.info(`✅ Database seeded successfully with ${tokens.length} tokens`);
        logger.info('🎯 Sample tokens:');
        
        // Display first 5 tokens
        tokens.slice(0, 5).forEach(token => {
            logger.info(`   - ${token.tokenName} (${token.symbol}): MC $${token.formattedMarketCap}, AlphaScore: ${token.alphaScore}`);
        });
        
        process.exit(0);
        
    } catch (error) {
        logger.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
}

// Run seeding if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase }; 