import { Button, List } from 'antd';

export function ConsumptionPanel({ records }: { records: Array<Record<string, string | number>> }) {
  return (
    <section className="panel">
      <h2>消耗与库存</h2>
      <List
        dataSource={records}
        renderItem={(item) => (
          <List.Item actions={[<Button size="small" key="consume">再消耗 1 份</Button>]}>
            <List.Item.Meta title={`${item.foodName} · ${item.quantity}`} description={`${item.member} 于 ${item.date} 记录`} />
          </List.Item>
        )}
      />
    </section>
  );
}
