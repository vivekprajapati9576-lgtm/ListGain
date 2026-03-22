# IPO Pulse

IPO Pulse is a modern React Native (Expo) starter app for Android and iOS focused on Indian IPO tracking, allotment checks, GMP monitoring, subscription analysis, and listed IPO performance.

## Why this name?

**IPO Pulse** is short, finance-friendly, and signals real-time market updates clearly for beginner and active investors.

## What is included?

### Mobile app
- Cross-platform Expo React Native app with a dark, finance-style dashboard.
- Quick PAN-based allotment checker with secure no-storage UX messaging.
- GMP cards, estimated listing price, subscription trend cards, listed IPO gain tracker.
- Search + filter flow for upcoming, open, closed, and listed IPOs.
- Favorites UX, notification center, and educational section.
- Auto-refresh pattern in the dashboard hook every 2 minutes.

### Backend starter
- Lightweight Node.js API starter with sample endpoints for dashboard, IPO list, notifications, and allotment lookup.
- Easy swap path for registrar adapters, GMP scrapers, NSE/BSE integrations, and a managed database.

## Project structure

```text
.
├── App.tsx                  # Main mobile application shell and all primary screens
├── src/
│   ├── components/Ui.tsx    # Shared UI primitives
│   ├── constants/theme.ts   # Finance-style theme tokens
│   ├── data/mockData.ts     # Demo dataset / local fallback
│   ├── hooks/useDashboardData.ts
│   ├── services/api.ts      # API integration and fallback layer
│   └── types/index.ts       # Shared TypeScript models
└── backend/
    ├── package.json
    └── server.js            # Starter API server
```

## Feature mapping

### 1. IPO Allotment Status
- `fetchAllotmentStatus()` accepts PAN and looks up a backend endpoint.
- Current backend sample supports Link Intime, KFintech, and Bigshare-ready response shape.
- UI states included: Allotted, Not Allotted, Pending.

### 2. GMP (Grey Market Premium)
- Active IPO cards show live-ready GMP values.
- Trend direction supports up/down/flat styling.
- Estimated listing price is shown for each active IPO.

### 3. Upcoming IPO Section
- Discover tab includes all upcoming/open/closed/listed IPOs.
- Each card includes company name, dates, price band, lot size, issue size, and subscription status.

### 4. Live IPO Subscription Data
- Category-wise Retail/QIB/NII subscription values are included in card details.
- Backend route `/ipos` is the integration point for real-time refresh.

### 5. Listed IPO Section
- Dashboard includes current market price and listing gain percentage for listed IPOs.
- Ready to connect to NSE/BSE or broker APIs.

### 6. IPO Details Page
- Each discover card contains overview, financials, strengths, risks, DRHP summary, and analyst recommendation.
- The current starter keeps this inline for speed; you can split to a dedicated details screen later.

### 7. Search & Filter
- Search by company name.
- Filter by Upcoming / Open / Closed / Listed.

### 8. Notification System
- Notification center showcases supported alert types.
- Recommended production path: Expo push + Firebase Cloud Messaging or Supabase Edge Functions.

### 9. User Features
- Favorites included in UI state.
- Dark mode native styling.
- Clean beginner-friendly educational content.

## API integration strategy

### Registrar APIs
Create server-side adapters so your mobile app never calls registrar services directly with PAN details.

Recommended adapter pattern:
1. Mobile app sends PAN + IPO identifier over HTTPS.
2. Backend validates PAN format and routes to the correct registrar adapter.
3. Adapter normalizes Link Intime / KFintech / Bigshare responses into one common format.
4. Backend returns only the normalized result; do not persist PAN data.

### GMP data
- Best practice: ingest GMP through a server-side job every 2-5 minutes.
- Store normalized values in Postgres / Supabase.
- Expose a cached mobile-friendly endpoint to reduce battery and bandwidth usage.

### Stock price data
- Integrate NSE/BSE-approved market data or a broker/API vendor.
- Cache listed IPO prices server-side with a short TTL.

## Database recommendation

Use **Supabase Postgres** or **Firebase** for a beginner-friendly managed backend.

Suggested tables:
- `ipos`
- `ipo_metrics`
- `ipo_subscription_snapshots`
- `ipo_gmp_snapshots`
- `user_profiles`
- `user_favorites`
- `notification_preferences`

## Security guidance
- Never store PAN on device or in analytics.
- Use HTTPS for every API call.
- Validate PAN format server-side.
- Mask PAN in logs.
- Use rate limiting on allotment endpoints.
- Keep registrar credentials and scraping secrets only on the server.

## Run locally

### Mobile app
```bash
npm install
npm run start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

To connect the app to the local backend, set:

```bash
export EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:4000
```

Use your machine IP instead of `localhost` when testing on a physical phone.

## Deployment steps

### Expo app
1. Install EAS CLI: `npm install -g eas-cli`
2. Log in: `eas login`
3. Configure project: `eas build:configure`
4. Android build: `eas build --platform android`
5. iOS build: `eas build --platform ios`

### Backend
1. Deploy the Node API server to Railway, Render, Fly.io, or a VPS.
2. Add HTTPS and environment variables.
3. Replace sample data with real registrar / GMP / stock integrations.
4. Add scheduled jobs for GMP and subscription refresh.
5. Add a persistent database and auth layer.

## Beginner-friendly next upgrades
- Dedicated IPO detail screen with charts.
- Real push notifications.
- Watchlist sync across devices.
- IPO calendar with reminders.
- DRHP PDF links and document parsing.
- Historical GMP and subscription charts.

## Notes
This starter is intentionally lightweight and easy to understand. It includes full UI code, a backend API starter, and a clear path to production integrations.
