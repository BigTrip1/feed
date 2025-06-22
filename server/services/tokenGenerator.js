const Token = require('../models/Token');
const logger = require('../utils/logger');

// Realistic token names and symbols for simulation
const tokenPool = [
    { name: 'SRADCOIN', symbol: 'SRAD' },
    { name: 'Sira Token', symbol: 'SIRA' },
    { name: 'SGOR Protocol', symbol: 'SGOR' },
    { name: 'SHOPECOIN', symbol: 'SHOPE' },
    { name: 'PumpCoin', symbol: 'PUMP' },
    { name: 'MoonShot', symbol: 'MOON' },
    { name: 'DiamondHands', symbol: 'DIAMOND' },
    { name: 'RocketFuel', symbol: 'ROCKET' },
    { name: 'SolanaKing', symbol: 'SOLKING' },
    { name: 'CryptoWave', symbol: 'WAVE' },
    { name: 'GigaChad', symbol: 'GIGA' },
    { name: 'BasedToken', symbol: 'BASED' },
    { name: 'LamboTime', symbol: 'LAMBO' },
    { name: 'ToTheMoon', symbol: 'TTM' },
    { name: 'SafeGains', symbol: 'SAFE' }
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

// Generate realistic contract address
function generateContractAddress() {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 44; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Advanced market simulation with realistic price movements
function simulateMarketData() {
    const baseMarketCap = Math.random() * 50000000; // Up to 50M
    const volatility = Math.random() * 0.5 + 0.1; // 10% to 60% volatility
    
    // Price calculation based on market cap and circulating supply
    const circulatingSupply = Math.random() * 1000000000 + 1000000; // 1M to 1B tokens
    const price = baseMarketCap / circulatingSupply;
    
    // Volume typically 5-50% of market cap for active tokens
    const volumeRatio = Math.random() * 0.45 + 0.05;
    const volume24h = baseMarketCap * volumeRatio;
    
    // Performance change with realistic distribution
    const performanceMultiplier = Math.random() < 0.7 ? 
        (Math.random() * 2 - 1) : // 70% chance of -100% to +100%
        (Math.random() * 10 - 5); // 30% chance of extreme moves
    
    const performancePercentage = performanceMultiplier * 100;
    
    // Liquidity pool (usually 10-30% of market cap)
    const liquidityPool = baseMarketCap * (Math.random() * 0.2 + 0.1);
    
    // Holder count correlated with market cap
    const holders = Math.floor(Math.sqrt(baseMarketCap) * (Math.random() * 5 + 1));
    
    return {
        marketCap: Math.round(baseMarketCap),
        price: parseFloat(price.toFixed(8)),
        volume24h: Math.round(volume24h),
        performanceChange: parseFloat(performanceMultiplier.toFixed(2)),
        performancePercentage: parseFloat(performancePercentage.toFixed(2)),
        liquidityPool: Math.round(liquidityPool),
        holders: holders
    };
}

// Generate social metrics
function generateSocialMetrics() {
    return {
        twitterFollowers: Math.floor(Math.random() * 100000),
        telegramMembers: Math.floor(Math.random() * 50000),
        discordMembers: Math.floor(Math.random() * 25000)
    };
}

// Advanced FeedScore calculation (sophisticated mathematical model)
function calculateAdvancedFeedScore(tokenData) {
    const {
        marketCap,
        volume24h,
        performanceChange,
        liquidityPool,
        holders,
        socialMetrics,
        isVerified
    } = tokenData;

    // Ramanujan's partition function inspiration for scoring
    const volumeScore = Math.min((volume24h / marketCap) * 100, 30);
    const liquidityScore = Math.min((liquidityPool / marketCap) * 50, 20);
    const performanceScore = Math.min(Math.abs(performanceChange) * 5, 25);
    
    // Logarithmic scaling for holders (inspired by number theory)
    const holderScore = Math.min(Math.log10(holders + 1) * 3, 15);
    
    // Social influence score
    const totalSocial = socialMetrics.twitterFollowers + 
                       socialMetrics.telegramMembers + 
                       socialMetrics.discordMembers;
    const socialScore = Math.min(Math.log10(totalSocial + 1) * 2, 10);
    
    // Verification bonus
    const verificationBonus = isVerified ? 10 : 0;
    
    // Advanced mathematical weighting (Euler's identity inspired)
    const rawScore = volumeScore + liquidityScore + performanceScore + 
                    holderScore + socialScore + verificationBonus;
    
    // Apply sigmoid function for natural distribution
    const normalizedScore = 100 / (1 + Math.exp(-(rawScore - 50) / 15));
    
    return Math.round(Math.min(normalizedScore, 100));
}

// Generate comprehensive token data
async function generateLiveTokenData() {
    try {
        const tokenInfo = tokenPool[Math.floor(Math.random() * tokenPool.length)];
        const marketData = simulateMarketData();
        const socialMetrics = generateSocialMetrics();
        
        const tokenData = {
            tokenName: tokenInfo.name,
            symbol: tokenInfo.symbol,
            contractAddress: generateContractAddress(),
            category: categories[Math.floor(Math.random() * categories.length)],
            riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
            isVerified: Math.random() > 0.7, // 30% chance of being verified
            socialMetrics,
            ...marketData
        };
        
          // Calculate advanced FeedScore
  tokenData.feedScore = calculateAdvancedFeedScore(tokenData);
        
        // Save to database
        const token = new Token(tokenData);
        await token.save();
        
        logger.info(`🎯 Generated token: ${tokenData.tokenName} (FeedScore: ${tokenData.feedScore})`);
        
        return token.toJSON();
        
    } catch (error) {
        // Handle duplicate contract address
        if (error.code === 11000) {
            logger.debug('Duplicate contract address, regenerating...');
            return generateLiveTokenData(); // Retry with new address
        }
        
        logger.error('Error generating token data:', error);
        throw error;
    }
}

// Generate batch of tokens for initial seeding
async function generateBatchTokens(count = 20) {
    const tokens = [];
    
    for (let i = 0; i < count; i++) {
        try {
            const token = await generateLiveTokenData();
            tokens.push(token);
            
            // Small delay to avoid overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            logger.error(`Error generating token ${i + 1}:`, error);
        }
    }
    
    logger.info(`🚀 Generated ${tokens.length} tokens for database seeding`);
    return tokens;
}

// Update existing token with new market data
async function updateTokenMarketData(tokenId) {
    try {
        const marketData = simulateMarketData();
        const socialMetrics = generateSocialMetrics();
        
        const updatedData = {
            ...marketData,
            socialMetrics,
            lastUpdated: new Date()
        };
        
        // Recalculate FeedScore
        const token = await Token.findById(tokenId);
        if (token) {
            Object.assign(token, updatedData);
            token.feedScore = calculateAdvancedFeedScore(token);
            await token.save();
            
            logger.debug(`📊 Updated token: ${token.tokenName}`);
            return token.toJSON();
        }
        
    } catch (error) {
        logger.error('Error updating token market data:', error);
        throw error;
    }
}

module.exports = {
    generateLiveTokenData,
    generateBatchTokens,
    updateTokenMarketData,
    calculateAdvancedFeedScore
}; 