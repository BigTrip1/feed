const mongoose = require('mongoose');
const Token = require('../models/Token');
const logger = require('../utils/logger');

// MongoDB connection URI - update this to match your setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feed';

// Featured Solana tokens with realistic data
const featuredTokens = [
    {
        tokenName: "Bonk Inu",
        symbol: "BONK",
        marketCap: 2450000000,
        price: 0.000035,
        volume24h: 185000000,
        category: "Featured",
        performanceChange: 15.7,
        performancePercentage: 15.7,
        liquidityPool: 45000000,
        holders: 685000,
        contractAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        isVerified: true,
        riskLevel: "MEDIUM",
        alphaScore: 89,
        socialMetrics: {
            twitterFollowers: 125000,
            telegramMembers: 89000,
            discordMembers: 45000
        }
    },
    {
        tokenName: "Solana Pepe",
        symbol: "SPEPE",
        marketCap: 890000000,
        price: 0.00089,
        volume24h: 67000000,
        category: "Trending",
        performanceChange: 8.3,
        performancePercentage: 8.3,
        liquidityPool: 12000000,
        holders: 234000,
        contractAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        isVerified: true,
        riskLevel: "HIGH",
        alphaScore: 85,
        socialMetrics: {
            twitterFollowers: 78000,
            telegramMembers: 56000,
            discordMembers: 23000
        }
    },
    {
        tokenName: "Jupiter",
        symbol: "JUP",
        marketCap: 1200000000,
        price: 0.85,
        volume24h: 145000000,
        category: "Featured",
        performanceChange: 12.4,
        performancePercentage: 12.4,
        liquidityPool: 89000000,
        holders: 156000,
        contractAddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        isVerified: true,
        riskLevel: "LOW",
        alphaScore: 95,
        socialMetrics: {
            twitterFollowers: 245000,
            telegramMembers: 134000,
            discordMembers: 67000
        }
    },
    {
        tokenName: "Dogwifhat",
        symbol: "WIF",
        marketCap: 3200000000,
        price: 3.24,
        volume24h: 234000000,
        category: "Diamond Watch",
        performanceChange: 22.1,
        performancePercentage: 22.1,
        liquidityPool: 156000000,
        holders: 89000,
        contractAddress: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
        isVerified: true,
        riskLevel: "MEDIUM",
        socialMetrics: {
            twitterFollowers: 189000,
            telegramMembers: 98000,
            discordMembers: 45000
        }
    },
    {
        tokenName: "Raydium",
        symbol: "RAY",
        marketCap: 567000000,
        price: 2.34,
        volume24h: 89000000,
        category: "Featured",
        performanceChange: 5.8,
        performancePercentage: 5.8,
        liquidityPool: 67000000,
        holders: 78000,
        contractAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        isVerified: true,
        riskLevel: "LOW",
        socialMetrics: {
            twitterFollowers: 156000,
            telegramMembers: 89000,
            discordMembers: 34000
        }
    }
];

// Meme token names for random generation
const memeTokenNames = [
    "MoonShot", "DiamondHands", "ToTheMoon", "LamboTime", "SolanaKing",
    "PumpCoin", "GigaChad", "BasedToken", "RocketFuel", "SafeGains",
    "CryptoWave", "SRADCOIN", "SHOPECOIN", "Sira Token", "SGOR Protocol",
    "DegenCoin", "ApeCoin", "FlokiSol", "ShibaSol", "ElonMusk",
    "SafeMoon", "DogeCoin", "PepeCoin", "WojackCoin", "ChadCoin",
    "DiamondDoge", "MoonLambo", "RocketDoge", "SafeRocket", "PumpDoge",
    "GigaMoon", "BasedDoge", "AlphaCoin", "BetaCoin", "GammaCoin",
    "DeltaCoin", "EpsilonCoin", "ZetaCoin", "EtaCoin", "ThetaCoin",
    "IotaCoin", "KappaCoin", "LambdaCoin", "MuCoin", "NuCoin"
];

const categories = [
            'Alpha Hunters',
        'Moon Scouts',
        'Diamond Watch',
    'New Launch',
    'Trending',
    'Featured'
];

const riskLevels = ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'];

// Generate random contract address
function generateContractAddress() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    let result = '';
    for (let i = 0; i < 44; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Generate random token data
function generateRandomToken() {
    const name = memeTokenNames[Math.floor(Math.random() * memeTokenNames.length)];
    const symbol = name.toUpperCase().substring(0, Math.min(name.length, 6));
    const marketCap = Math.floor(Math.random() * 50000000) + 100000; // $100K to $50M
    const price = parseFloat((Math.random() * 10).toFixed(6));
    const volume24h = Math.floor(marketCap * (Math.random() * 0.5 + 0.1)); // 10-60% of market cap
    const performanceChange = parseFloat((Math.random() * 40 - 20).toFixed(1)); // -20% to +20%
    
    return {
        tokenName: name,
        symbol: symbol,
        marketCap: marketCap,
        price: price,
        volume24h: volume24h,
        category: categories[Math.floor(Math.random() * categories.length)],
        performanceChange: performanceChange,
        performancePercentage: performanceChange,
        liquidityPool: Math.floor(volume24h * (Math.random() * 0.3 + 0.1)),
        holders: Math.floor(Math.random() * 50000) + 100,
        contractAddress: generateContractAddress(),
        isVerified: Math.random() > 0.7, // 30% chance of being verified
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        socialMetrics: {
            twitterFollowers: Math.floor(Math.random() * 100000),
            telegramMembers: Math.floor(Math.random() * 50000),
            discordMembers: Math.floor(Math.random() * 25000)
        },
        isActive: true
    };
}

// Main population function
async function populateFeedData() {
    try {
        logger.info('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        logger.info('✅ Connected to MongoDB');
        
        // Clear existing data
        logger.info('🗑️  Clearing existing feeddata collection...');
        await Token.deleteMany({});
        
        // Insert featured tokens
        logger.info('📊 Inserting featured tokens...');
        const featuredDocs = await Token.insertMany(featuredTokens);
        logger.info(`✅ Inserted ${featuredDocs.length} featured tokens`);
        
        // Generate and insert random tokens
        logger.info('🎲 Generating random tokens...');
        const randomTokens = [];
        const usedAddresses = new Set(featuredTokens.map(t => t.contractAddress));
        
        for (let i = 0; i < 150; i++) { // Generate 150 random tokens
            let token;
            let attempts = 0;
            
            // Ensure unique contract addresses
            do {
                token = generateRandomToken();
                attempts++;
            } while (usedAddresses.has(token.contractAddress) && attempts < 10);
            
            if (!usedAddresses.has(token.contractAddress)) {
                usedAddresses.add(token.contractAddress);
                randomTokens.push(token);
            }
        }
        
        logger.info(`📥 Inserting ${randomTokens.length} random tokens...`);
        const randomDocs = await Token.insertMany(randomTokens);
        logger.info(`✅ Inserted ${randomDocs.length} random tokens`);
        
        // Display summary
        const totalTokens = await Token.countDocuments();
        const verifiedTokens = await Token.countDocuments({ isVerified: true });
        const avgMarketCap = await Token.aggregate([
            { $group: { _id: null, avgMarketCap: { $avg: "$marketCap" } } }
        ]);
        
        logger.info('📈 Database Population Summary:');
        logger.info(`   Total Tokens: ${totalTokens}`);
        logger.info(`   Verified Tokens: ${verifiedTokens}`);
        logger.info(`   Average Market Cap: $${Math.round(avgMarketCap[0]?.avgMarketCap || 0).toLocaleString()}`);
        
        // Show category distribution
        const categoryStats = await Token.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        logger.info('📊 Category Distribution:');
        categoryStats.forEach(stat => {
            logger.info(`   ${stat._id}: ${stat.count} tokens`);
        });
        
        logger.info('🎉 Database population completed successfully!');
        
    } catch (error) {
        logger.error('❌ Error populating database:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        logger.info('🔌 Database connection closed');
    }
}

// Run if called directly
if (require.main === module) {
    populateFeedData()
        .then(() => {
            logger.info('✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { populateFeedData }; 