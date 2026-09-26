import { Button, Form, Input, InputNumber, Select } from 'antd';

export function IntakePanel({ categories, locations }: { categories: string[]; locations: string[] }) {
  return (
    <section className="panel">
      <h2>食品入库</h2>
      <Form layout="vertical" className="compact-form">
        <Form.Item label="食品名称"><Input placeholder="例如 低温鲜牛奶" /></Form.Item>
        <Form.Item label="类别"><Select options={categories.map((value) => ({ value, label: value }))} /></Form.Item>
        <Form.Item label="生产日期"><Input type="date" /></Form.Item>
        <Form.Item label="保质期天数"><InputNumber min={1} /></Form.Item>
        <Form.Item label="数量"><InputNumber min={0} /></Form.Item>
        <Form.Item label="存放位置"><Select options={locations.map((value) => ({ value, label: value }))} /></Form.Item>
        <Form.Item label="CSV 批量导入"><Input placeholder="name,category,productionDate..." /></Form.Item>
        <Button type="primary">模拟入库</Button>
      </Form>
    </section>
  );
}
