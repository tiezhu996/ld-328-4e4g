import { AppException } from '../errors/AppException';
import type { ConsumeResult, DashboardOverview, FamilyData, FoodItem, ReportData } from '../types/domain';

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`API request failed: ${path}`);
  }
  return response.json() as Promise<T>;
};

const postJson = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new AppException(String(data.message ?? `API request failed: ${path}`), String(data.code ?? 'API_ERROR'));
  }
  return data as T;
};

export const api = {
  dashboard: () => getJson<DashboardOverview>('/api/dashboard/overview'),
  foods: () => getJson<FoodItem[]>('/api/foods'),
  intakeTemplate: () => getJson<{ categories: string[]; locations: string[]; csvHeaders: string[] }>('/api/foods/intake-template'),
  reminders: () => getJson<{ preference: Record<string, string | number | boolean>; messages: Array<Record<string, string | string[]>> }>('/api/reminders'),
  consumption: () => getJson<{ records: Array<Record<string, string | number>>; frequency: Array<{ name: string; times: number }> }>('/api/consumption'),
  consume: (foodId: string, quantity: number, member: string) =>
    postJson<ConsumeResult>('/api/consumption', { foodId, quantity, member }),
  recipes: () => getJson<{ recommendations: Array<Record<string, string | number>> }>('/api/recipes'),
  report: () => getJson<ReportData>('/api/reports/monthly'),
  family: () => getJson<FamilyData>('/api/family'),
};
