const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        maxlength: 10
    },
    marketCap: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    volume24h: {
        type: Number,
        default: 0,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Alpha Hunters',
            'Moon Scouts', 
            'Diamond Watch',
            'New Launch',
            'Trending',
            'Featured'
        ]
    },
    performanceChange: {
        type: Number,
        default: 0
    },
    performancePercentage: {
        type: Number,
        default: 0
    },
    liquidityPool: {
        type: Number,
        default: 0
    },
    holders: {
        type: Number,
        default: 0
    },
    contractAddress: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'],
        default: 'MEDIUM'
    },
    alphaScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    socialMetrics: {
        twitterFollowers: { type: Number, default: 0 },
        telegramMembers: { type: Number, default: 0 },
        discordMembers: { type: Number, default: 0 }
    },
    priceHistory: [{
        price: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
tokenSchema.index({ marketCap: -1 });
tokenSchema.index({ performanceChange: -1 });
tokenSchema.index({ category: 1 });
tokenSchema.index({ alphaScore: -1 });
tokenSchema.index({ contractAddress: 1 }, { unique: true });
tokenSchema.index({ createdAt: -1 });

// Virtual for formatted market cap
tokenSchema.virtual('formattedMarketCap').get(function() {
    if (this.marketCap >= 1000000) {
        return `$${(this.marketCap / 1000000).toFixed(1)}M`;
    } else if (this.marketCap >= 1000) {
        return `$${(this.marketCap / 1000).toFixed(1)}K`;
    }
    return `$${this.marketCap}`;
});

// Virtual for time ago
tokenSchema.virtual('timeAgo').get(function() {
    const now = new Date();
    const diff = now - this.createdAt;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${Math.floor(diff / 1000)}s`;
});

// Method to calculate AlphaScore (advanced algorithm)
tokenSchema.methods.calculateAlphaScore = function() {
    const volumeScore = Math.min((this.volume24h / this.marketCap) * 100, 30);
    const performanceScore = Math.min(Math.abs(this.performanceChange) * 10, 25);
    const liquidityScore = Math.min((this.liquidityPool / this.marketCap) * 50, 20);
    const socialScore = Math.min((this.socialMetrics.twitterFollowers / 1000) * 2, 15);
    const verificationBonus = this.isVerified ? 10 : 0;
    
    this.alphaScore = Math.min(
        volumeScore + performanceScore + liquidityScore + socialScore + verificationBonus,
        100
    );
    
    return this.alphaScore;
};

// Pre-save middleware to update timestamps and calculate scores
tokenSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    this.calculateAlphaScore();
    next();
});

module.exports = mongoose.model('Token', tokenSchema, 'feeddata'); 