const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feed';

// Token schema (matching our model)
const tokenSchema = new mongoose.Schema({
    tokenName: String,
    symbol: String,
    marketCap: Number,
    price: Number,
    volume24h: Number,
    category: String,
    performanceChange: Number,
    performancePercentage: Number,
    liquidityPool: Number,
    holders: Number,
    contractAddress: String,
    isVerified: Boolean,
    riskLevel: String,
    alphaScore: Number,
    socialMetrics: {
        twitterFollowers: Number,
        telegramMembers: Number,
        discordMembers: Number
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Token = mongoose.model('Token', tokenSchema);

// Realistic Solana token data
const mockTokens = [
    {
        tokenName: "Bonk Inu",
        symbol: "BONK",
        marketCap: 2500000000,
        price: 0.000015,
        volume24h: 125000000,
        category: "Trending",
        performanceChange: 15.7,
        performancePercentage: 15.7,
        liquidityPool: 45000000,
        holders: 285000,
        contractAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        isVerified: true,
        riskLevel: "MEDIUM",
        alphaScore: 89,
        socialMetrics: {
            twitterFollowers: 156000,
            telegramMembers: 89000,
            discordMembers: 45000
        }
    },
    {
        tokenName: "Solana Pepe",
        symbol: "SOLPEPE",
        marketCap: 850000000,
        price: 0.00234,
        volume24h: 67000000,
        category: "Diamond Watch",
        performanceChange: 47.3,
        performancePercentage: 47.3,
        liquidityPool: 23000000,
        holders: 45000,
        contractAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        isVerified: false,
        riskLevel: "HIGH",
        alphaScore: 92,
        socialMetrics: {
            twitterFollowers: 23000,
            telegramMembers: 12000,
            discordMembers: 8500
        }
    },
    {
        tokenName: "Jupiter",
        symbol: "JUP",
        marketCap: 4200000000,
        price: 0.89,
        volume24h: 234000000,
        category: "Featured",
        performanceChange: 8.2,
        performancePercentage: 8.2,
        liquidityPool: 89000000,
        holders: 125000,
        contractAddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        isVerified: true,
        riskLevel: "LOW",
        alphaScore: 95,
        socialMetrics: {
            twitterFollowers: 89000,
            telegramMembers: 45000,
            discordMembers: 23000
        }
    },
    {
        tokenName: "Dogwifhat",
        symbol: "WIF",
        marketCap: 1800000000,
        price: 1.85,
        volume24h: 156000000,
        category: "Moon Scouts",
        performanceChange: -5.4,
        performancePercentage: -5.4,
        liquidityPool: 67000000,
        holders: 78000,
        contractAddress: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
        isVerified: true,
        riskLevel: "MEDIUM",
        alphaScore: 78,
        socialMetrics: {
            twitterFollowers: 234000,
            telegramMembers: 156000,
            discordMembers: 89000
        }
    },
    {
        tokenName: "Moonshot Alpha",
        symbol: "MOON",
        marketCap: 125000000,
        price: 0.0456,
        volume24h: 23000000,
        category: "New Launch",
        performanceChange: 234.7,
        performancePercentage: 234.7,
        liquidityPool: 5600000,
        holders: 12000,
        contractAddress: "MoonshotAlphaTokenAddressHere123456789",
        isVerified: false,
        riskLevel: "EXTREME",
        alphaScore: 67,
        socialMetrics: {
            twitterFollowers: 5600,
            telegramMembers: 8900,
            discordMembers: 2300
        }
    },
    {
        tokenName: "Raydium",
        symbol: "RAY",
        marketCap: 1200000000,
        price: 2.34,
        volume24h: 89000000,
        category: "Featured",
        performanceChange: 12.8,
        performancePercentage: 12.8,
        liquidityPool: 45000000,
        holders: 67000,
        contractAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        isVerified: true,
        riskLevel: "LOW",
        alphaScore: 91,
        socialMetrics: {
            twitterFollowers: 67000,
            telegramMembers: 34000,
            discordMembers: 18000
        }
    },
    {
        tokenName: "Pump.Fun Token",
        symbol: "PUMP",
        marketCap: 350000000,
        price: 0.12,
        volume24h: 45000000,
        category: "Alpha Hunters",
        performanceChange: -12.4,
        performancePercentage: -12.4,
        liquidityPool: 12000000,
        holders: 23000,
        contractAddress: "PumpFunTokenSolanaAddressExample12345",
        isVerified: false,
        riskLevel: "HIGH",
        alphaScore: 73,
        socialMetrics: {
            twitterFollowers: 12000,
            telegramMembers: 18000,
            discordMembers: 7800
        }
    }
];

// Generate additional random tokens
function generateRandomToken(index) {
    const categories = ['Alpha Hunters', 'Moon Scouts', 'Diamond Watch', 'New Launch', 'Trending', 'Featured'];
    const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'];
    const memeCoinNames = [
        'DogeCoin Classic', 'Shiba Solana', 'Pepe Moon', 'Floki Sol', 'SafeSol',
        'RocketCoin', 'DiamondHands', 'ToTheMoon', 'SolApe', 'CryptoCat',
        'MoonLambo', 'DiamondDog', 'SolShiba', 'PepeCoin', 'DogeKing',
        'SolanaFloki', 'CryptoShib', 'MoonSafe', 'RocketDoge', 'SolPepe'
    ];
    
    const tokenName = memeCoinNames[Math.floor(Math.random() * memeCoinNames.length)];
    const symbol = tokenName.replace(/[^A-Z]/g, '').substring(0, 6) || 'SOL' + index;
    
    const marketCap = Math.floor(Math.random() * 1000000000) + 50000;
    const price = Math.random() * 10;
    const volume24h = Math.floor(Math.random() * 50000000) + 10000;
    const performanceChange = (Math.random() - 0.5) * 200; // -100% to +100%
    
    return {
        tokenName: `${tokenName} ${index}`,
        symbol: symbol,
        marketCap: marketCap,
        price: price,
        volume24h: volume24h,
        category: categories[Math.floor(Math.random() * categories.length)],
        performanceChange: performanceChange,
        performancePercentage: performanceChange,
        liquidityPool: Math.floor(marketCap * 0.1),
        holders: Math.floor(Math.random() * 50000) + 100,
        contractAddress: `SOL${Math.random().toString(36).substring(2, 15)}${index}`,
        isVerified: Math.random() > 0.7,
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        alphaScore: Math.floor(Math.random() * 100),
        socialMetrics: {
            twitterFollowers: Math.floor(Math.random() * 100000),
            telegramMembers: Math.floor(Math.random() * 50000),
            discordMembers: Math.floor(Math.random() * 25000)
        }
    };
}

async function populateDatabase() {
    try {
        logger.info('🚀 Starting MongoDB population...');
        
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        logger.info('✅ Connected to MongoDB');
        
        // Clear existing data
        await Token.deleteMany({});
        logger.info('🗑️  Cleared existing tokens');
        
        // Insert realistic tokens
        const allTokens = [...mockTokens];
        
        // Generate additional random tokens
        for (let i = 8; i <= 100; i++) {
            allTokens.push(generateRandomToken(i));
        }
        
        await Token.insertMany(allTokens);
        
        logger.info(`🎉 Successfully populated database with ${allTokens.length} tokens!`);
        logger.info('📊 Sample tokens:');
        
        // Display sample tokens
        mockTokens.slice(0, 3).forEach(token => {
            logger.info(`   💎 ${token.tokenName} (${token.symbol}): $${(token.marketCap/1000000).toFixed(1)}M MC, AlphaScore: ${token.alphaScore}`);
        });
        
        logger.info('');
        logger.info('🔗 Database ready for FEED application!');
        logger.info(`📍 MongoDB URI: ${MONGODB_URI}`);
        
        process.exit(0);
        
    } catch (error) {
        logger.error('❌ Database population failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    populateDatabase();
}

module.exports = { populateDatabase }; 