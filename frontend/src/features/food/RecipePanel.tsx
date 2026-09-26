import { List, Tag } from 'antd';

export function RecipePanel({ recommendations }: { recommendations: Array<Record<string, string | number>> }) {
  return (
    <section className="panel">
      <h2>食谱推荐</h2>
      <List
        dataSource={recommendations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<span>{item.recipe} <Tag color="orange">剩余 {item.daysLeft} 天</Tag></span>}
              description={`${item.foodName}：${item.need}`}
            />
          </List.Item>
        )}
      />
    </section>
  );
}
