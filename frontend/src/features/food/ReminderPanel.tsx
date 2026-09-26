import { Alert, List } from 'antd';

export function ReminderPanel({ messages }: { messages: Array<Record<string, string | string[]>> }) {
  return (
    <section className="panel">
      <h2>临期提醒</h2>
      {messages.length > 0 && <Alert type="warning" showIcon message={`${messages.length} 条临期或过期提醒`} />}
      <List
        dataSource={messages}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={String(item.title)} description={String(item.body)} />
          </List.Item>
        )}
      />
    </section>
  );
}
