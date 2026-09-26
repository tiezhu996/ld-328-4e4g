import { Card, Progress, Tag } from 'antd';
import type { FoodItem } from '../../types/domain';

const statusText = {
  fresh: '充裕',
  expiring: '临期',
  expired: '已过期',
  consumed: '已消耗',
};

const statusColor = {
  fresh: 'green',
  expiring: 'gold',
  expired: 'red',
  consumed: 'default',
};

export function FoodBoard({ items }: { items: FoodItem[] }) {
  return (
    <section className="food-grid">
      {items.map((item) => (
        <Card key={item.id} size="small" className={`food-card ${item.status}`}>
          <div className="food-head">
            <strong>{item.name}</strong>
            <Tag color={statusColor[item.status]}>{statusText[item.status]}</Tag>
          </div>
          <p>{item.category} · {item.location} · {item.quantity}{item.unit}</p>
          <Progress percent={item.progress} showInfo={false} status={item.status === 'expired' ? 'exception' : 'active'} />
          <small>到期日 {item.expireDate}，剩余 {item.daysLeft} 天，操作人 {item.owner}</small>
        </Card>
      ))}
    </section>
  );
}
