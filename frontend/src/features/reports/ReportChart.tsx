import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import type { ReportData } from '../../types/domain';

export function ReportChart({ report }: { report?: ReportData }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !report) return;
    const chart = echarts.init(ref.current);
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: '分类消耗',
          type: 'pie',
          radius: ['42%', '70%'],
          data: report.categoryShare,
        },
      ],
    });
    return () => chart.dispose();
  }, [report]);

  return <div className="chart" ref={ref} />;
}
