const logger = require('../utils/logger');

// Mock token data for demo mode
const mockTokens = [
    {
        _id: 'demo_1',
        tokenName: 'SRADCOIN',
        symbol: 'SRAD',
        marketCap: 573000,
        price: 0.000573,
        volume24h: 45000,
        category: 'Alpha Hunters',
        performanceChange: 2.3,
        performancePercentage: 230,
        liquidityPool: 115000,
        holders: 1247,
        contractAddress: 'So11111111111111111111111111111111111111112',
        isVerified: true,
        riskLevel: 'HIGH',
        alphaScore: 85,
        socialMetrics: {
            twitterFollowers: 5420,
            telegramMembers: 2100,
            discordMembers: 890
        },
        priceHistory: [],
        isActive: true,
        createdAt: new Date(Date.now() - 60000).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'demo_2',
        tokenName: 'Sira Token',
        symbol: 'SIRA',
        marketCap: 396300,
        price: 0.000396,
        volume24h: 32000,
        category: 'Moon Scouts',
        performanceChange: 5.5,
        performancePercentage: 550,
        liquidityPool: 98000,
        holders: 945,
        contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        isVerified: false,
        riskLevel: 'EXTREME',
        alphaScore: 92,
        socialMetrics: {
            twitterFollowers: 8932,
            telegramMembers: 4200,
            discordMembers: 1560
        },
        priceHistory: [],
        isActive: true,
        createdAt: new Date(Date.now() - 240000).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'demo_3',
        tokenName: 'SGOR Protocol',
        symbol: 'SGOR',
        marketCap: 30700000,
        price: 0.0307,
        volume24h: 2100000,
        category: 'Diamond Watch',
        performanceChange: -1.2,
        performancePercentage: -120,
        liquidityPool: 8500000,
        holders: 15420,
        contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        isVerified: true,
        riskLevel: 'MEDIUM',
        alphaScore: 78,
        socialMetrics: {
            twitterFollowers: 25000,
            telegramMembers: 12000,
            discordMembers: 5400
        },
        priceHistory: [],
        isActive: true,
        createdAt: new Date(Date.now() - 480000).toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Generate a random mock token for real-time updates
function generateMockToken() {
    const tokenNames = ['PumpCoin', 'MoonShot', 'DiamondHands', 'RocketFuel', 'BasedToken', 'LamboTime'];
    const symbols = ['PUMP', 'MOON', 'DIAMOND', 'ROCKET', 'BASED', 'LAMBO'];
    const categories = ['Alpha Hunters', 'Moon Scouts', 'Diamond Watch', 'New Launch', 'Trending', 'Featured'];
    
    const randomIndex = Math.floor(Math.random() * tokenNames.length);
    const marketCap = Math.random() * 10000000 + 50000; // 50K to 10M
    const performanceChange = (Math.random() - 0.5) * 10; // -5 to +5
    
    return {
        _id: `demo_${Date.now()}`,
        tokenName: tokenNames[randomIndex],
        symbol: symbols[randomIndex],
        marketCap: Math.round(marketCap),
        price: marketCap / (Math.random() * 1000000000 + 1000000),
        volume24h: Math.round(marketCap * (Math.random() * 0.5 + 0.1)),
        category: categories[Math.floor(Math.random() * categories.length)],
        performanceChange: Math.round(performanceChange * 100) / 100,
        performancePercentage: Math.round(performanceChange * 100),
        liquidityPool: Math.round(marketCap * (Math.random() * 0.3 + 0.1)),
        holders: Math.floor(Math.sqrt(marketCap) * (Math.random() * 5 + 1)),
        contractAddress: `Mock${Math.random().toString(36).substr(2, 40)}`,
        isVerified: Math.random() > 0.7,
        riskLevel: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'][Math.floor(Math.random() * 4)],
        alphaScore: Math.floor(Math.random() * 100),
        socialMetrics: {
            twitterFollowers: Math.floor(Math.random() * 50000),
            telegramMembers: Math.floor(Math.random() * 20000),
            discordMembers: Math.floor(Math.random() * 10000)
        },
        priceHistory: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// Get demo tokens for API responses
function getDemoTokens(limit = 50) {
    // Generate additional random tokens to fill the limit
    const additionalTokens = [];
    for (let i = mockTokens.length; i < limit; i++) {
        additionalTokens.push(generateMockToken());
    }
    
    return [...mockTokens, ...additionalTokens];
}

// Get demo stats
function getDemoStats() {
    const tokens = getDemoTokens();
    const totalMarketCap = tokens.reduce((sum, token) => sum + token.marketCap, 0);
    const totalVolume = tokens.reduce((sum, token) => sum + token.volume24h, 0);
    const avgAlphaScore = tokens.reduce((sum, token) => sum + token.alphaScore, 0) / tokens.length;
    const performances = tokens.map(token => token.performanceChange);
    
    return {
        totalTokens: tokens.length,
        totalMarketCap,
        totalVolume,
        avgAlphaScore: Math.round(avgAlphaScore),
        topGainer: Math.max(...performances),
        topLoser: Math.min(...performances)
    };
}

module.exports = {
    generateMockToken,
    getDemoTokens,
    getDemoStats
}; 