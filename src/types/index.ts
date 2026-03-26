export type IpoStatus = 'Upcoming' | 'Open' | 'Closed' | 'Listed';
export type AllotmentState = 'Allotted' | 'Not Allotted' | 'Pending';
export type Recommendation = 'Subscribe' | 'Avoid' | 'Neutral';

export type Ipo = {
  id: string;
  companyName: string;
  symbol: string;
  openDate: string;
  closeDate: string;
  listingDate: string;
  priceBand: string;
  lotSize: number;
  issueSize: string;
  subscriptionStatus: string;
  status: IpoStatus;
  gmp: number;
  gmpTrend: 'up' | 'down' | 'flat';
  estimatedListingPrice: number;
  currentPrice?: number;
  listingGainPercent?: number;
  overview: string;
  strengths: string[];
  risks: string[];
  financials: {
    revenue: string;
    profit: string;
    debtToEquity: string;
  };
  drhpSummary: string;
  recommendation: Recommendation;
  sectors: string[];
  subscriptionBreakup: {
    retail: number;
    qib: number;
    nii: number;
  };
};

export type AllotmentResult = {
  pan: string;
  companyName: string;
  registrar: 'Link Intime' | 'KFintech' | 'Bigshare';
  status: AllotmentState;
  sharesAllotted: number;
  lastUpdated: string;
};

export type DashboardMetrics = {
  activeCount: number;
  avgGmp: number;
  hottestIpo: string;
  nextEvent: string;
};

export type NotificationPreference = {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
};
