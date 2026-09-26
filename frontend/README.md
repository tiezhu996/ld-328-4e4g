# 易腐食品保质期追踪

**项目类型标签：全栈Web应用**

易腐食品保质期追踪 是 家庭和小型餐饮用户 的食品保质期管理工具。

## 快速启动

开发模式：

```bash
npm install
npm run dev
```

访问地址：`http://localhost:18628`

生产构建：

```bash
npm run build
npm run preview
```

## 主要功能

- 食品入库录入：生产日期、保质期和位置
- 保质期看板：绿色、黄色、红色状态
- 临期提醒通知：站内消息和邮件模拟
- 消耗记录：库存余量和历史频率
- 智能推荐：临期优先食用和食谱建议
- 统计报表：浪费金额和 Top 10
- 家庭共享：成员权限和操作记录

## 本地开发方式

在项目根目录执行：

```bash
npm install
npm run dev
```

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端 | React 18 + TypeScript + Vite + Ant Design |
| 后端 | Django 4 + DRF |
| 数据库 | PostgreSQL |
| 任务调度 | Celery + Redis |
| 认证 | JWT |

## 项目目录结构

```text
. 
├── src
│   ├── components
│   ├── constants
│   ├── data
│   ├── errors
│   ├── features
│   ├── logger
│   ├── services
│   ├── types
│   └── utils
├── Dockerfile
├── nginx.conf
├── package.json
└── README.md
```

## 环境变量说明

纯前端项目默认不需要后端环境变量。地图或第三方 API Key 可放入本地 .env 文件。

## 使用说明

应用数据存储在浏览器本地。清空浏览器站点数据会重置演示数据。

## License

MIT
