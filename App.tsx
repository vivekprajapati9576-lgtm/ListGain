import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Card, Pill, Screen, SearchField, SectionTitle } from './src/components/Ui';
import { palette } from './src/constants/theme';
import { useDashboardData } from './src/hooks/useDashboardData';
import { fetchAllotmentStatus } from './src/services/api';
import { AllotmentResult, Ipo, IpoStatus } from './src/types';

const filters: Array<IpoStatus | 'All'> = ['All', 'Upcoming', 'Open', 'Closed', 'Listed'];
const tabs = ['Dashboard', 'Discover', 'Alerts', 'Learn'] as const;

type Tab = (typeof tabs)[number];

export default function App() {
  const { ipos, metrics, notifications, activeIpos, listedIpos, loading } = useDashboardData();
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<IpoStatus | 'All'>('All');
  const [pan, setPan] = useState('');
  const [allotment, setAllotment] = useState<AllotmentResult | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['2', '4']);

  const filteredIpos = useMemo(() => {
    return ipos.filter((ipo) => {
      const matchesSearch = ipo.companyName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = selectedFilter === 'All' ? true : ipo.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [ipos, search, selectedFilter]);

  const toggleFavorite = (ipoId: string) => {
    setFavorites((current) => (current.includes(ipoId) ? current.filter((id) => id !== ipoId) : [...current, ipoId]));
  };

  const checkAllotment = async () => {
    const result = await fetchAllotmentStatus(pan);
    setAllotment(result);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {activeTab === 'Dashboard' ? (
        <Screen>
          <HeroCard loading={loading} />

          <SectionTitle title="Market pulse" subtitle="A beginner-friendly IPO dashboard for Indian investors." />
          <View style={styles.metricRow}>
            <Metric label="Active IPOs" value={String(metrics?.activeCount ?? 0)} />
            <Metric label="Avg GMP" value={`₹${metrics?.avgGmp ?? 0}`} />
            <Metric label="Hot IPO" value={metrics?.hottestIpo ?? '—'} compact />
          </View>

          <Card>
            <SectionTitle title="Quick allotment checker" subtitle="PAN is checked securely and never stored on device." />
            <SearchField value={pan} onChangeText={setPan} placeholder="Enter PAN (e.g. ABCDE1234F)" />
            <Pressable onPress={checkAllotment} style={styles.primaryCta}>
              <Text style={styles.primaryCtaText}>Check allotment status</Text>
            </Pressable>
            {allotment ? <AllotmentCard allotment={allotment} /> : <Text style={styles.helperText}>Supports Link Intime, KFintech, and Bigshare style registrar integrations.</Text>}
          </Card>

          <SectionTitle title="Active IPOs" subtitle="Live GMP, estimated listing price, and subscription depth." />
          {activeIpos.map((ipo) => (
            <IpoCard key={ipo.id} ipo={ipo} favorite={favorites.includes(ipo.id)} onToggleFavorite={() => toggleFavorite(ipo.id)} />
          ))}

          <Card>
            <SectionTitle title="Listed IPO performance" subtitle="Track gains, losses, and live listed names." />
            {listedIpos.map((ipo) => (
              <View key={ipo.id} style={styles.listRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>{ipo.companyName}</Text>
                  <Text style={styles.mutedText}>CMP ₹{ipo.currentPrice} · Listing gain {ipo.listingGainPercent?.toFixed(2)}%</Text>
                </View>
                <Pill label={`${ipo.listingGainPercent?.toFixed(2)}%`} tone="success" />
              </View>
            ))}
          </Card>
        </Screen>
      ) : null}

      {activeTab === 'Discover' ? (
        <Screen>
          <SectionTitle title="Search & filters" subtitle="Find upcoming, open, closed, and listed IPOs quickly." />
          <SearchField value={search} onChangeText={setSearch} placeholder="Search by company name" />
          <View style={styles.filterWrap}>
            {filters.map((filter) => (
              <Pressable key={filter} onPress={() => setSelectedFilter(filter)} style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}>
                <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>{filter}</Text>
              </Pressable>
            ))}
          </View>

          {filteredIpos.map((ipo) => (
            <DetailsCard key={ipo.id} ipo={ipo} favorite={favorites.includes(ipo.id)} onToggleFavorite={() => toggleFavorite(ipo.id)} />
          ))}
        </Screen>
      ) : null}

      {activeTab === 'Alerts' ? (
        <Screen>
          <SectionTitle title="Notification center" subtitle="Smart alerts for IPO opening, allotment, listing day, and GMP moves." />
          {notifications.map((item) => (
            <Card key={item.id}>
              <View style={styles.listRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>{item.label}</Text>
                  <Text style={styles.mutedText}>{item.description}</Text>
                </View>
                <Pill label={item.enabled ? 'Enabled' : 'Paused'} tone={item.enabled ? 'success' : 'warning'} />
              </View>
            </Card>
          ))}
          <Card>
            <SectionTitle title="Automation" subtitle="Recommended backend jobs and mobile integrations." />
            <Text style={styles.bullet}>• Expo push notifications or Firebase Cloud Messaging for Android + iOS delivery.</Text>
            <Text style={styles.bullet}>• Server-side cron refresh for GMP, subscription, and listing updates every 2-5 minutes.</Text>
            <Text style={styles.bullet}>• User favorites sync via Supabase/Postgres with row-level security.</Text>
          </Card>
        </Screen>
      ) : null}

      {activeTab === 'Learn' ? (
        <Screen>
          <SectionTitle title="IPO Academy" subtitle="Short explainers for first-time Indian market participants." />
          <EducationCard title="What is GMP?" body="Grey Market Premium is the unofficial premium investors quote before listing. It is sentiment-led, unofficial, and should not be the only signal." />
          <EducationCard title="How to read subscription data" body="Retail, QIB, and NII bids indicate which investor class is participating. Higher quality demand and balanced oversubscription often support listing sentiment." />
          <EducationCard title="DRHP summary" body="Read the offer structure, use of proceeds, legal proceedings, promoter background, peer comparison, and key risk factors before applying." />
          <Card>
            <SectionTitle title="Suggested stack" subtitle="Lightweight, scalable, and production friendly." />
            <Text style={styles.bullet}>• Frontend: Expo React Native + TypeScript for a fast cross-platform codebase.</Text>
            <Text style={styles.bullet}>• Backend: Lightweight Node.js starter in this repo, or swap to Supabase/Firebase for managed auth and database.</Text>
            <Text style={styles.bullet}>• APIs: Registrar adapters (Link Intime, KFintech, Bigshare), NSE/BSE price feed, GMP source ingestion.</Text>
            <Text style={styles.bullet}>• Security: HTTPS only, PAN masked after lookup, and no PAN persistence.</Text>
          </Card>
        </Screen>
      ) : null}

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

function HeroCard({ loading }: { loading: boolean }) {
  return (
    <Card>
      <Text style={styles.eyebrow}>Suggested app name</Text>
      <Text style={styles.heroTitle}>IPO Pulse</Text>
      <Text style={styles.heroSubtitle}>
        A modern IPO tracker with allotment lookup, live GMP monitoring, subscription analytics, listed performance, and beginner-first guidance.
      </Text>
      <View style={styles.heroPills}>
        <Pill label={loading ? 'Refreshing…' : 'Live market cards'} />
        <Pill label="Dark mode" tone="success" />
        <Pill label="Auto refresh 2m" tone="warning" />
      </View>
    </Card>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <Card>
      <Text style={[styles.metricValue, compact && styles.metricValueCompact]}>{value}</Text>
      <Text style={styles.mutedText}>{label}</Text>
    </Card>
  );
}

function IpoCard({ ipo, favorite, onToggleFavorite }: { ipo: Ipo; favorite: boolean; onToggleFavorite: () => void }) {
  return (
    <Card>
      <View style={styles.listRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>{ipo.companyName}</Text>
          <Text style={styles.mutedText}>{ipo.priceBand} · Lot {ipo.lotSize} · {ipo.issueSize}</Text>
        </View>
        <Pill label={`GMP ₹${ipo.gmp}`} tone={ipo.gmpTrend === 'up' ? 'success' : ipo.gmpTrend === 'down' ? 'danger' : 'warning'} />
      </View>
      <Text style={styles.bodyText}>{ipo.subscriptionStatus}</Text>
      <Text style={styles.mutedText}>Estimated listing price ₹{ipo.estimatedListingPrice} · Analyst view: {ipo.recommendation}</Text>
      <Pressable onPress={onToggleFavorite} style={styles.secondaryCta}>
        <Text style={styles.secondaryCtaText}>{favorite ? '★ Saved to favorites' : '☆ Save to favorites'}</Text>
      </Pressable>
    </Card>
  );
}

function DetailsCard({ ipo, favorite, onToggleFavorite }: { ipo: Ipo; favorite: boolean; onToggleFavorite: () => void }) {
  return (
    <Card>
      <View style={styles.listRow}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={styles.listTitle}>{ipo.companyName}</Text>
          <Pill label={ipo.status} tone={ipo.status === 'Open' ? 'success' : ipo.status === 'Upcoming' ? 'warning' : ipo.status === 'Listed' ? 'default' : 'danger'} />
        </View>
        <Pressable onPress={onToggleFavorite}>
          <Text style={styles.favorite}>{favorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <Text style={styles.bodyText}>{ipo.overview}</Text>
      <Text style={styles.mutedText}>Dates: {ipo.openDate} to {ipo.closeDate} · Listing: {ipo.listingDate}</Text>
      <Text style={styles.mutedText}>Financials: Revenue {ipo.financials.revenue} · Profit {ipo.financials.profit} · D/E {ipo.financials.debtToEquity}</Text>
      <Text style={styles.bodyText}>Strengths: {ipo.strengths.join(' • ')}</Text>
      <Text style={styles.bodyText}>Risks: {ipo.risks.join(' • ')}</Text>
      <Text style={styles.bodyText}>DRHP: {ipo.drhpSummary}</Text>
      <Text style={styles.mutedText}>Subscription: Retail {ipo.subscriptionBreakup.retail}x · QIB {ipo.subscriptionBreakup.qib}x · NII {ipo.subscriptionBreakup.nii}x</Text>
    </Card>
  );
}

function EducationCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <Text style={styles.listTitle}>{title}</Text>
      <Text style={styles.bodyText}>{body}</Text>
    </Card>
  );
}

function AllotmentCard({ allotment }: { allotment: AllotmentResult }) {
  const tone = allotment.status === 'Allotted' ? 'success' : allotment.status === 'Pending' ? 'warning' : 'danger';
  return (
    <Card>
      <View style={styles.listRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.listTitle}>{allotment.companyName}</Text>
          <Text style={styles.mutedText}>Registrar: {allotment.registrar}</Text>
        </View>
        <Pill label={allotment.status} tone={tone} />
      </View>
      <Text style={styles.bodyText}>Shares allotted: {allotment.sharesAllotted}</Text>
      <Text style={styles.mutedText}>Last updated: {new Date(allotment.lastUpdated).toLocaleString()}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.bg },
  eyebrow: { color: palette.primary, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 12, fontWeight: '700' },
  heroTitle: { color: palette.text, fontSize: 34, fontWeight: '800' },
  heroSubtitle: { color: palette.muted, lineHeight: 22 },
  heroPills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metricRow: { gap: 12 },
  metricValue: { color: palette.text, fontSize: 28, fontWeight: '800' },
  metricValueCompact: { fontSize: 19 },
  helperText: { color: palette.muted, lineHeight: 20 },
  listRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  listTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  mutedText: { color: palette.muted, lineHeight: 20 },
  bodyText: { color: palette.text, lineHeight: 22 },
  primaryCta: { backgroundColor: palette.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  primaryCtaText: { color: palette.bg, fontWeight: '800', fontSize: 15 },
  secondaryCta: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.14)' },
  secondaryCtaText: { color: palette.primary, fontWeight: '700' },
  filterWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: palette.border, borderRadius: 999, backgroundColor: palette.surface },
  filterChipActive: { backgroundColor: 'rgba(56,189,248,0.16)', borderColor: palette.primary },
  filterText: { color: palette.muted, fontWeight: '600' },
  filterTextActive: { color: palette.primary },
  favorite: { fontSize: 24, color: '#FBBF24' },
  bullet: { color: palette.text, lineHeight: 22 },
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 8
  },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabLabel: { color: palette.muted, fontWeight: '700' },
  tabLabelActive: { color: palette.primary }
});
