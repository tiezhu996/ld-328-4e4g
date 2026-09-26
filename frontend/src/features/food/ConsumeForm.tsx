import { useEffect } from 'react';
import { Alert, Button, DatePicker, Form, InputNumber, Select, Statistic } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import type { ConsumeError } from '../../api/client';
import type { FoodItem } from '../../types/domain';

export interface ConsumeFormValues {
  foodId: string;
  quantity: number;
  member: string;
  date: Dayjs;
}

export interface ConsumePreset {
  key: number;
  foodId: string;
  member: string;
}

interface ConsumeFormProps {
  foods: FoodItem[];
  members: string[];
  defaultDate: string;
  submitting: boolean;
  error: ConsumeError | null;
  successMessage: string;
  preset?: ConsumePreset | null;
  onSubmit: (values: ConsumeFormValues) => void;
}

export function ConsumeForm({
  foods,
  members,
  defaultDate,
  submitting,
  error,
  successMessage,
  preset,
  onSubmit,
}: ConsumeFormProps) {
  const [form] = Form.useForm<ConsumeFormValues>();
  const foodId = Form.useWatch('foodId', form);
  const selectedFood = foods.find((food) => food.id === foodId);
  const consumableFoods = foods.filter((food) => food.quantity > 0);

  useEffect(() => {
    if (preset) {
      form.setFieldsValue({ foodId: preset.foodId, quantity: 1, member: preset.member, date: dayjs(defaultDate) });
    }
  }, [preset, form, defaultDate]);

  return (
    <Form<ConsumeFormValues>
      form={form}
      layout="vertical"
      initialValues={{ foodId: consumableFoods[0]?.id, quantity: 1, member: members[0], date: dayjs(defaultDate) }}
      onFinish={onSubmit}
    >
      {error && (
        <Form.Item>
          <Alert
            type="error"
            showIcon
            message={
              typeof error.remaining === 'number'
                ? `库存不足，当前还剩 ${error.remaining}${error.unit ?? ''}，本次消耗未生效。`
                : '提交失败'
            }
            description={error.message}
          />
        </Form.Item>
      )}
      {successMessage && (
        <Form.Item>
          <Alert type="success" showIcon message={successMessage} />
        </Form.Item>
      )}
      <Form.Item
        label="消耗食品"
        name="foodId"
        rules={[{ required: true, message: '请选择要消耗的食品' }]}
      >
        <Select
          placeholder="选择食品"
          options={consumableFoods.map((food) => ({
            value: food.id,
            label: `${food.name}（剩余 ${food.quantity}${food.unit}）`,
          }))}
        />
      </Form.Item>
      <Form.Item label="消耗数量" required>
        <div className="section-row">
          <Form.Item name="quantity" noStyle rules={[{ required: true, message: '请填写消耗数量' }]}>
            <InputNumber min={1} precision={0} style={{ width: 160 }} addonAfter={selectedFood?.unit ?? '份'} />
          </Form.Item>
          {selectedFood && (
            <Statistic
              valueStyle={{ fontSize: 14 }}
              title="当前剩余"
              value={selectedFood.quantity}
              suffix={selectedFood.unit}
            />
          )}
        </div>
      </Form.Item>
      <Form.Item label="操作人" name="member" rules={[{ required: true, message: '请选择操作人' }]}>
        <Select options={members.map((name) => ({ value: name, label: name }))} />
      </Form.Item>
      <Form.Item label="消耗日期" name="date" rules={[{ required: true, message: '请选择消耗日期' }]}>
        <DatePicker style={{ width: '100%' }} allowClear={false} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting} block>
          提交消耗
        </Button>
      </Form.Item>
    </Form>
  );
}
