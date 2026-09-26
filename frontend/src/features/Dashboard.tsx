import { Card, Statistic } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { api, type ConsumptionRecord } from '../api/client';
import type { DashboardOverview, FamilyData, FoodItem, ReportData } from '../types/domain';
import { ConsumptionPanel } from './food/ConsumptionPanel';
import { FoodBoard } from './food/FoodBoard';
import { IntakePanel } from './food/IntakePanel';
import { RecipePanel } from './food/RecipePanel';
import { ReminderPanel } from './food/ReminderPanel';
import { ReportPanel } from './reports/ReportPanel';
import { FamilyPanel } from './shared/FamilyPanel';
import { useConsumption } from './food/useConsumption';

const DEFAULT_OPERATOR = '家庭成员';

export const Dashboard = () => {
  const [overview, setOverview] = useState<DashboardOverview>();
  const [template, setTemplate] = useState<{ categories: string[]; locations: string[]; csvHeaders: string[] }>({
    categories: [],
    locations: [],
    csvHeaders: [],
  });
  const [reminders, setReminders] = useState<Array<Record<string, string | string[]>>>([]);
  const [consumptions, setConsumptions] = useState<ConsumptionRecord[]>([]);
  const [recipes, setRecipes] = useState<Array<Record<string, string | number>>>([]);
  const [report, setReport] = useState<ReportData>();
  const [family, setFamily] = useState<FamilyData>();
  const [refreshKey, setRefreshKey] = useState(0);

  const reloadBoard = useCallback(() => {
    api.dashboard().then(setOverview);
    api.reminders().then((data) => setReminders(data.messages));
    api.consumption().then((data) => setConsumptions(data.records));
  }, []);

  useEffect(() => {
    reloadBoard();
    api.intakeTemplate().then(setTemplate);
    api.recipes().then((data) => setRecipes(data.recommendations));
    api.report().then(setReport);
    api.family().then(setFamily);
  }, [reloadBoard, refreshKey]);

  const consumption = useConsumption(() => setRefreshKey((key) => key + 1));

  const items: FoodItem[] = overview?.items ?? [];
  const members = family?.members.map((member) => member.name) ?? [DEFAULT_OPERATOR];
  const today = overview?.today ?? dayjs().format('YYYY-MM-DD');

  const consumeOne = (food: FoodItem) => {
    void consumption.submit({ foodId: food.id, quantity: 1, member: members[0], date: dayjs(today) });
  };

  return (
    <>
      <section className="hero">
        <p>cyfreshfood</p>
        <h1>易腐食品保质期追踪</h1>
        <span>食品入库、保质期状态、临期提醒、消耗库存和家庭共享的一体化看板。</span>
      </section>
      <section className="metric-grid">
        <Card><Statistic title="食品总数" value={overview?.total ?? 0} /></Card>
        <Card><Statistic title="临期" value={overview?.expiring ?? 0} valueStyle={{ color: '#ad6800' }} /></Card>
        <Card><Statistic title="已过期" value={overview?.expired ?? 0} valueStyle={{ color: '#cf1322' }} /></Card>
        <Card><Statistic title="已消耗" value={overview?.consumed ?? 0} /></Card>
      </section>
      <FoodBoard items={items} consumingId={consumption.consumingId} onConsumeOne={consumeOne} />
      <section className="layout-grid">
        <IntakePanel categories={template.categories} locations={template.locations} />
        <ReminderPanel messages={reminders} />
      </section>
      <section className="layout-grid">
        <ConsumptionPanel
          records={consumptions}
          foods={items}
          members={members}
          defaultDate={today}
          consumption={consumption}
        />
        <RecipePanel recommendations={recipes} />
      </section>
      <section className="layout-grid">
        <ReportPanel report={report} />
        <FamilyPanel family={family} />
      </section>
    </>
  );
};
