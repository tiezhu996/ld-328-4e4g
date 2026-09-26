import { Card, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { DashboardOverview, FamilyData, ReportData } from '../types/domain';
import { ConsumptionPanel } from './food/ConsumptionPanel';
import { FoodBoard } from './food/FoodBoard';
import { IntakePanel } from './food/IntakePanel';
import { RecipePanel } from './food/RecipePanel';
import { ReminderPanel } from './food/ReminderPanel';
import { ReportPanel } from './reports/ReportPanel';
import { FamilyPanel } from './shared/FamilyPanel';

export const Dashboard = () => {
  const [overview, setOverview] = useState<DashboardOverview>();
  const [template, setTemplate] = useState<{ categories: string[]; locations: string[]; csvHeaders: string[] }>({
    categories: [],
    locations: [],
    csvHeaders: [],
  });
  const [reminders, setReminders] = useState<Array<Record<string, string | string[]>>>([]);
  const [consumptions, setConsumptions] = useState<Array<Record<string, string | number>>>([]);
  const [recipes, setRecipes] = useState<Array<Record<string, string | number>>>([]);
  const [report, setReport] = useState<ReportData>();
  const [family, setFamily] = useState<FamilyData>();

  const loadData = () => {
    api.dashboard().then(setOverview);
    api.intakeTemplate().then(setTemplate);
    api.reminders().then((data) => setReminders(data.messages));
    api.consumption().then((data) => setConsumptions(data.records));
    api.recipes().then((data) => setRecipes(data.recommendations));
    api.report().then(setReport);
    api.family().then(setFamily);
  };

  useEffect(() => {
    loadData();
  }, []);

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
      <FoodBoard items={overview?.items ?? []} />
      <section className="layout-grid">
        <IntakePanel categories={template.categories} locations={template.locations} />
        <ReminderPanel messages={reminders} />
      </section>
      <section className="layout-grid">
        <ConsumptionPanel
          foods={overview?.items ?? []}
          records={consumptions}
          members={family?.members.map((member) => member.name) ?? []}
          onConsumed={loadData}
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
