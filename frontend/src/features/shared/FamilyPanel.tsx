import { List, Tag } from 'antd';
import type { FamilyData } from '../../types/domain';

export function FamilyPanel({ family }: { family?: FamilyData }) {
  return (
    <section className="panel">
      <h2>家庭成员共享</h2>
      <p>{family?.name} · 管理员 {family?.admin}</p>
      <List
        dataSource={family?.members ?? []}
        renderItem={(member) => (
          <List.Item>
            <strong>{member.name}</strong>
            <Tag>{member.role}</Tag>
            <span>{member.permission}</span>
          </List.Item>
        )}
      />
      <List
        size="small"
        header="操作记录"
        dataSource={family?.activity ?? []}
        renderItem={(item) => <List.Item>{item.createdAt} · {item.member} · {item.action}</List.Item>}
      />
    </section>
  );
}
