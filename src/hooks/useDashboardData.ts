import { useEffect, useMemo, useState } from 'react';

import { fetchDashboard, fetchIpos, fetchNotifications } from '../services/api';
import { DashboardMetrics, Ipo, NotificationPreference } from '../types';

export function useDashboardData() {
  const [ipos, setIpos] = useState<Ipo[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const [ipoData, dashboardData, notificationData] = await Promise.all([
        fetchIpos(),
        fetchDashboard(),
        fetchNotifications()
      ]);

      if (!mounted) {
        return;
      }

      setIpos(ipoData);
      setMetrics(dashboardData);
      setNotifications(notificationData);
      setLoading(false);
    }

    void load();
    const timer = setInterval(() => {
      void load();
    }, 120000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const activeIpos = useMemo(() => ipos.filter((ipo) => ipo.status === 'Open' || ipo.status === 'Upcoming'), [ipos]);
  const listedIpos = useMemo(() => ipos.filter((ipo) => ipo.status === 'Listed'), [ipos]);

  return {
    ipos,
    metrics,
    notifications,
    activeIpos,
    listedIpos,
    loading
  };
}
