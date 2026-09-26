import type { DashboardOverview, FamilyData, FoodItem, ReportData } from '../types/domain';

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`API request failed: ${path}`);
  }
  return response.json() as Promise<T>;
};

export interface ConsumeRequest {
  foodId: string;
  quantity: number;
  member: string;
  date: string;
}

export interface ConsumeResult {
  updated: boolean;
  foodId: string;
  foodName: string;
  quantity: number;
  date: string;
  member: string;
  remaining: number;
  unit: string;
  status: FoodItem['status'];
  fullyConsumed: boolean;
}

export interface ConsumeError {
  code: string;
  message: string;
  remaining?: number;
  requested?: number;
  unit?: string;
}

export const api = {
  dashboard: () => getJson<DashboardOverview>('/api/dashboard/overview'),
  foods: () => getJson<FoodItem[]>('/api/foods'),
  intakeTemplate: () => getJson<{ categories: string[]; locations: string[]; csvHeaders: string[] }>('/api/foods/intake-template'),
  reminders: () => getJson<{ preference: Record<string, string | number | boolean>; messages: Array<Record<string, string | string[]>> }>('/api/reminders'),
  consumption: () => getJson<{ records: ConsumptionRecord[]; frequency: Array<{ name: string; times: number }> }>('/api/consumption'),
  consume: async (payload: ConsumeRequest): Promise<ConsumeResult> => {
    const response = await fetch('/api/consumption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as ConsumeResult | ConsumeError;
    if (!response.ok) {
      throw data as ConsumeError;
    }
    return data as ConsumeResult;
  },
  recipes: () => getJson<{ recommendations: Array<Record<string, string | number>> }>('/api/recipes'),
  report: () => getJson<ReportData>('/api/reports/monthly'),
  family: () => getJson<FamilyData>('/api/family'),
};

export interface ConsumptionRecord {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number;
  date: string;
  member: string;
}
