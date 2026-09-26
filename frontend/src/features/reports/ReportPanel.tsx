import { Button, List, Statistic } from 'antd';
import type { ReportData } from '../../types/domain';
import { ReportChart } from './ReportChart';

export function ReportPanel({ report }: { report?: ReportData }) {
  return (
    <section className="panel">
      <div className="section-row">
        <h2>统计报表</h2>
        <Button>导出 PDF</Button>
      </div>
      <Statistic title="本月浪费金额估算" value={report?.wasteAmount ?? 0} prefix="¥" />
      <ReportChart report={report} />
      <List
        size="small"
        header="最常购买 Top"
        dataSource={report?.mostPurchased ?? []}
        renderItem={(item) => <List.Item>{item.name} · {item.quantity}</List.Item>}
      />
    </section>
  );
}
