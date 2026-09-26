export interface FoodItem {
  id: string;
  name: string;
  category: string;
  productionDate: string;
  shelfLifeDays: number;
  quantity: number;
  unit: string;
  location: string;
  openedDate: string;
  owner: string;
  price: number;
  expireDate: string;
  daysLeft: number;
  status: 'fresh' | 'expiring' | 'expired' | 'consumed';
  progress: number;
}

export interface DashboardItem {
  id: string;
  title: string;
  description: string;
  status: string;
  score: number;
  tags: string[];
}

export interface DashboardOverview {
  service: string;
  total: number;
  fresh: number;
  expiring: number;
  expired: number;
  consumed: number;
  items: FoodItem[];
}

export interface ReportData {
  month: string;
  categoryShare: Array<{ name: string; value: number }>;
  wasteAmount: number;
  mostPurchased: Array<Record<string, string | number>>;
  mostWasted: Array<Record<string, string | number>>;
}

export interface FamilyData {
  name: string;
  admin: string;
  members: Array<Record<string, string>>;
  activity: Array<Record<string, string>>;
}
