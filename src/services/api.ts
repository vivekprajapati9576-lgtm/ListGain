import { allotmentResults, dashboardMetrics, ipoList, notificationPreferences } from '../data/mockData';
import { AllotmentResult, DashboardMetrics, Ipo, NotificationPreference } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function fetchDashboard(): Promise<DashboardMetrics> {
  return safeFetch('/dashboard', dashboardMetrics);
}

export async function fetchIpos(): Promise<Ipo[]> {
  return safeFetch('/ipos', ipoList);
}

export async function fetchNotifications(): Promise<NotificationPreference[]> {
  return safeFetch('/notifications', notificationPreferences);
}

export async function fetchAllotmentStatus(pan: string): Promise<AllotmentResult | null> {
  const normalizedPan = pan.trim().toUpperCase();

  if (!normalizedPan) {
    return null;
  }

  const fromApi = await safeFetch<AllotmentResult | null>(`/allotment?pan=${normalizedPan}`, null);
  if (fromApi) {
    return fromApi;
  }

  return allotmentResults.find((result) => result.pan === normalizedPan) ?? null;
}
