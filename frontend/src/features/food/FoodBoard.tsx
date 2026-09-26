import { Button, Card, Progress, Tag } from 'antd';
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

interface FoodBoardProps {
  items: FoodItem[];
  consumingId?: string;
  onConsumeOne?: (food: FoodItem) => void;
}

export function FoodBoard({ items, consumingId, onConsumeOne }: FoodBoardProps) {
  return (
    <section className="food-grid">
      {items.map((item) => (
        <Card key={item.id} size="small" className={`food-card ${item.status}`}>
          <div className="food-head">
            <strong>{item.name}</strong>
            <Tag color={statusColor[item.status]}>{statusText[item.status]}</Tag>
          </div>
          <p>{item.category} · {item.location} · 剩余 {item.quantity}{item.unit}</p>
          <Progress percent={item.progress} showInfo={false} status={item.status === 'expired' ? 'exception' : 'active'} />
          <small>到期日 {item.expireDate}，剩余 {item.daysLeft} 天，操作人 {item.owner}</small>
          {item.quantity > 0 && (
            <Button
              size="small"
              type="primary"
              ghost
              block
              style={{ marginTop: 10 }}
              loading={consumingId === item.id}
              onClick={() => onConsumeOne?.(item)}
            >
              消耗 1{item.unit}
            </Button>
          )}
        </Card>
      ))}
    </section>
  );
}
