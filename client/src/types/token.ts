export interface Token {
  id?: string;
  _id?: string;
  tokenName?: string;
  symbol: string;
  description?: string;
  marketCap: number;
  price?: number;
  volume: number;
  volume24h?: number;
  category?: 'Alpha Hunters' | 'Moon Scouts' | 'Diamond Watch' | 'New Launch' | 'Trending' | 'Featured';
  performanceChange?: number;
  performancePercentage?: number;
  liquidityPool?: number;
  holders?: number;
  contractAddress?: string;
  isVerified?: boolean;
  riskLevel: 'safe' | 'medium' | 'high' | 'degen' | 'suicide' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  alphaScore: number;
  socialMetrics?: {
    twitterFollowers: number;
    telegramMembers: number;
    discordMembers: number;
  };
  priceHistory?: Array<{
    price: number;
    timestamp: string;
  }>;
  isActive?: boolean;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  formattedMarketCap?: string;
  timeAgo?: string;
}

export interface FilterOptions {
  search: string;
  category: string;
  minMarketCap: number;
  maxMarketCap: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTokens: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TokenStats {
  totalTokens: number;
  totalMarketCap: number;
  totalVolume: number;
  avgAlphaScore: number;
  topGainer: number;
  topLoser: number;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';
export type WebSocketMessageType = 'connection' | 'token_update' | 'market_stats' | 'error' | 'ping' | 'pong'; 