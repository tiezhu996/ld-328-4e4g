import { Button, Empty, InputNumber, List, Select, message } from 'antd';
import { useState } from 'react';
import { api } from '../../api/client';
import { AppException } from '../../errors/AppException';
import type { FoodItem } from '../../types/domain';

interface ConsumptionPanelProps {
  foods: FoodItem[];
  records: Array<Record<string, string | number>>;
  members: string[];
  onConsumed: () => void;
}

export function ConsumptionPanel({ foods, records, members, onConsumed }: ConsumptionPanelProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [member, setMember] = useState<string>();
  const [pendingId, setPendingId] = useState<string>();
  const operator = member ?? members[0] ?? '家庭成员';
  const activeFoods = foods.filter((food) => food.status !== 'consumed');

  const consume = async (food: FoodItem) => {
    const quantity = quantities[food.id] ?? 1;
    setPendingId(food.id);
    try {
      const result = await api.consume(food.id, quantity, operator);
      message.success(`${result.member} 于 ${result.date} 消耗 ${result.foodName} ${result.quantity} 份，剩余 ${result.remaining}`);
      onConsumed();
    } catch (error) {
      message.error(error instanceof AppException ? error.message : '消耗失败，请稍后重试');
    } finally {
      setPendingId(undefined);
    }
  };

  return (
    <section className="panel">
      <h2>消耗与库存</h2>
      <p>
        操作人
        <Select
          size="small"
          style={{ marginLeft: 8, minWidth: 120 }}
          value={operator}
          options={members.map((name) => ({ value: name, label: name }))}
          onChange={(value) => setMember(value)}
        />
      </p>
      <List
        size="small"
        header="当前库存"
        dataSource={activeFoods}
        locale={{ emptyText: <Empty description="库存已全部消耗" /> }}
        renderItem={(food) => (
          <List.Item
            actions={[
              <InputNumber
                key="quantity"
                size="small"
                min={1}
                value={quantities[food.id] ?? 1}
                onChange={(value) => setQuantities((prev) => ({ ...prev, [food.id]: value ?? 1 }))}
              />,
              <Button key="consume" size="small" type="primary" loading={pendingId === food.id} onClick={() => consume(food)}>
                消耗
              </Button>,
            ]}
          >
            <List.Item.Meta title={food.name} description={`剩余 ${food.quantity} ${food.unit} · ${food.location}`} />
          </List.Item>
        )}
      />
      <List
        size="small"
        header="消耗记录"
        dataSource={records}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={`${item.foodName} · ${item.quantity}`} description={`${item.member} 于 ${item.date} 记录`} />
          </List.Item>
        )}
      />
    </section>
  );
}
