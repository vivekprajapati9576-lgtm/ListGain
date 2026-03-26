import { createServer } from 'node:http';
import { parse } from 'node:url';

const port = Number(process.env.PORT || 4000);

const ipos = [
  {
    id: '1',
    companyName: 'AstraWave Renewables',
    symbol: 'ASTRA',
    openDate: '2026-03-25',
    closeDate: '2026-03-27',
    listingDate: '2026-04-02',
    priceBand: '₹380 - ₹401',
    lotSize: 37,
    issueSize: '₹1,240 Cr',
    subscriptionStatus: 'Opens in 3 days',
    status: 'Upcoming',
    gmp: 122,
    gmpTrend: 'up',
    estimatedListingPrice: 523,
    overview: 'A renewable EPC and solar storage platform with utility-scale projects across India.',
    strengths: ['Strong order book across 11 states', 'Healthy EBITDA expansion', 'Promoter stake remains above 68%'],
    risks: ['Execution delay risk on utility projects', 'Working capital intensive business'],
    financials: { revenue: '₹2,840 Cr', profit: '₹284 Cr', debtToEquity: '0.42' },
    drhpSummary: 'Fresh issue for capacity expansion, battery manufacturing line, and debt repayment.',
    recommendation: 'Subscribe',
    sectors: ['Renewables', 'Energy Storage'],
    subscriptionBreakup: { retail: 0, qib: 0, nii: 0 }
  },
  {
    id: '2',
    companyName: 'FinSutra Tech',
    symbol: 'FINSUT',
    openDate: '2026-03-20',
    closeDate: '2026-03-24',
    listingDate: '2026-03-31',
    priceBand: '₹210 - ₹221',
    lotSize: 67,
    issueSize: '₹860 Cr',
    subscriptionStatus: 'Retail 12.2x · QIB 18.4x · NII 26.1x',
    status: 'Open',
    gmp: 87,
    gmpTrend: 'up',
    estimatedListingPrice: 308,
    overview: 'B2B fintech infrastructure provider serving NBFCs, lenders, and embedded finance startups.',
    strengths: ['High ROE and recurring SaaS revenue', 'Low churn enterprise clients'],
    risks: ['Fintech regulation changes can impact growth', 'Customer concentration in top five clients'],
    financials: { revenue: '₹1,120 Cr', profit: '₹168 Cr', debtToEquity: '0.08' },
    drhpSummary: 'Offer for sale plus fresh issue to fund product expansion and inorganic acquisitions.',
    recommendation: 'Subscribe',
    sectors: ['Fintech', 'SaaS'],
    subscriptionBreakup: { retail: 12.2, qib: 18.4, nii: 26.1 }
  },
  {
    id: '4',
    companyName: 'Mediva Diagnostics',
    symbol: 'MEDIVA',
    openDate: '2026-03-01',
    closeDate: '2026-03-05',
    listingDate: '2026-03-12',
    priceBand: '₹255 - ₹270',
    lotSize: 55,
    issueSize: '₹1,520 Cr',
    subscriptionStatus: 'Listed at ₹322',
    status: 'Listed',
    gmp: 0,
    gmpTrend: 'flat',
    estimatedListingPrice: 322,
    currentPrice: 348,
    listingGainPercent: 28.89,
    overview: 'Diagnostics network focused on pathology, genomics, and preventive health programs.',
    strengths: ['Pan-India footprint', 'Premium preventive care brand'],
    risks: ['Expansion CAPEX can suppress margins', 'Pricing pressure in metros'],
    financials: { revenue: '₹2,460 Cr', profit: '₹304 Cr', debtToEquity: '0.19' },
    drhpSummary: 'Funds raised for lab automation, new centers, and selected debt repayment.',
    recommendation: 'Subscribe',
    sectors: ['Healthcare'],
    subscriptionBreakup: { retail: 14.4, qib: 31.2, nii: 18.7 }
  }
];

const dashboard = {
  activeCount: 3,
  avgGmp: 76,
  hottestIpo: 'FinSutra Tech',
  nextEvent: 'FinSutra Tech closes on 24 Mar'
};

const notifications = [
  { id: 'open-alert', label: 'IPO opening alerts', enabled: true, description: 'Get a push reminder before subscription starts.' },
  { id: 'allotment-alert', label: 'Allotment alerts', enabled: true, description: 'Receive instant updates once registrar results are published.' },
  { id: 'listing-alert', label: 'Listing day alerts', enabled: false, description: 'Track opening price, listing gain, and early momentum.' },
  { id: 'gmp-alert', label: 'GMP change alerts', enabled: true, description: 'Get notified when premium swings materially.' }
];

const allotments = {
  ABCDE1234F: { pan: 'ABCDE1234F', companyName: 'UrbanCart Retail', registrar: 'Link Intime', status: 'Not Allotted', sharesAllotted: 0, lastUpdated: '2026-03-22T08:45:00Z' },
  AAAPL1234C: { pan: 'AAAPL1234C', companyName: 'UrbanCart Retail', registrar: 'Link Intime', status: 'Allotted', sharesAllotted: 125, lastUpdated: '2026-03-22T08:45:00Z' },
  AAACT9999Q: { pan: 'AAACT9999Q', companyName: 'FinSutra Tech', registrar: 'KFintech', status: 'Pending', sharesAllotted: 0, lastUpdated: '2026-03-22T08:45:00Z' }
};

const server = createServer((req, res) => {
  const { pathname, query } = parse(req.url || '', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/health') {
    res.end(JSON.stringify({ ok: true, uptime: process.uptime() }));
    return;
  }

  if (pathname === '/dashboard') {
    res.end(JSON.stringify(dashboard));
    return;
  }

  if (pathname === '/ipos') {
    res.end(JSON.stringify(ipos));
    return;
  }

  if (pathname === '/notifications') {
    res.end(JSON.stringify(notifications));
    return;
  }

  if (pathname === '/allotment') {
    const pan = String(query.pan || '').trim().toUpperCase();
    res.end(JSON.stringify(allotments[pan] || null));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(port, () => {
  console.log(`IPO Pulse API listening on port ${port}`);
});
