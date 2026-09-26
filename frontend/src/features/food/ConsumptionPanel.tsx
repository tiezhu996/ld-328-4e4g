import { useState } from 'react';
import { Button, List, Tag } from 'antd';
import type { ConsumptionRecord } from '../../api/client';
import type { FoodItem } from '../../types/domain';
import { ConsumeForm, type ConsumeFormValues } from './ConsumeForm';
import type { ConsumePayload, ConsumptionState } from './useConsumption';

interface ConsumptionPanelProps {
  records: ConsumptionRecord[];
  foods: FoodItem[];
  members: string[];
  defaultDate: string;
  consumption: ConsumptionState & { submit: (payload: ConsumePayload) => Promise<unknown> };
}

interface Preset {
  key: number;
  foodId: string;
  member: string;
}

export function ConsumptionPanel({ records, foods, members, defaultDate, consumption }: ConsumptionPanelProps) {
  const [preset, setPreset] = useState<Preset | null>(null);

  const unitOf = (foodId: string) => foods.find((food) => food.id === foodId)?.unit ?? '份';

  const handleSubmit = (values: ConsumeFormValues) =>
    consumption.submit({
      foodId: values.foodId,
      quantity: values.quantity,
      member: values.member,
      date: values.date,
    });

  const presetAgain = (record: ConsumptionRecord) => {
    setPreset({ key: Date.now(), foodId: record.foodId, member: record.member });
  };

  return (
    <section className="panel">
      <h2>消耗与库存</h2>
      <ConsumeForm
        foods={foods}
        members={members}
        defaultDate={defaultDate}
        submitting={consumption.submitting}
        error={consumption.error}
        successMessage={consumption.successMessage}
        preset={preset}
        onSubmit={handleSubmit}
      />
      <List
        size="small"
        header={`消耗记录（${records.length} 条）`}
        dataSource={records}
        renderItem={(item) => {
          const depleted = (foods.find((food) => food.id === item.foodId)?.quantity ?? 0) <= 0;
          return (
            <List.Item
              actions={[
                <Button
                  size="small"
                  key="again"
                  disabled={depleted}
                  onClick={() => presetAgain(item)}
                >
                  再记一次
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <>
                    {item.foodName} · {item.quantity}
                    {unitOf(item.foodId)}
                    {depleted && <Tag color="default" style={{ marginLeft: 8 }}>已消耗</Tag>}
                  </>
                }
                description={`${item.member} 于 ${item.date} 记录`}
              />
            </List.Item>
          );
        }}
      />
    </section>
  );
}
