# 易腐食品保质期追踪

**项目类型标签：全栈Web应用**

面向家庭和小型餐饮的食品保质期管理工具，记录食品入库信息，自动计算剩余保质期，提醒临期食品，并提供消耗库存、食谱推荐、统计报表和家庭成员共享。

## 快速启动

Docker Compose 是首选启动方式：

```bash
cp .env.example .env
docker compose up -d
```

访问地址：`http://localhost:18628`

后端健康检查：`http://localhost:19628/api/health`

## 项目主要功能

- 食品入库：录入名称、类别、生产日期、保质期天数、数量、位置、开封日期，并提供 CSV 表头模板。
- 保质期状态看板：绿色/黄色/红色/灰色卡片区分充裕、临期、过期和已消耗状态。
- 临期提醒：每天扫描 3 天内到期和已过期食品，输出站内消息和邮件模拟提醒。
- 消耗库存：记录消耗数量、日期和操作人，库存为 0 时自动标记已消耗。
- 食谱推荐：按临期优先级推荐番茄炒蛋、牛奶燕麦杯、虾仁滑蛋等简易食谱。
- 统计报表：ECharts 展示分类消耗占比，统计浪费金额、最常购买和最常浪费 Top 10，提供 PDF 导出入口模拟。
- 家庭成员共享：家庭组成员、管理员权限和操作记录展示。

## 本地开发方式

前端：

```bash
cd frontend
npm install
npm run dev
```

后端：

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

本地开发后端监听 `8000`，前端开发服务器已代理 `/api` 到该端口。

## API 示例

- `GET /api/health`
- `GET /api/dashboard/overview`
- `GET /api/foods`
- `GET /api/foods/intake-template`
- `GET /api/reminders`
- `GET /api/consumption`
- `POST /api/consumption`
- `GET /api/recipes`
- `GET /api/reports/monthly`
- `GET /api/family`

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端 | React 18、TypeScript、Vite、Ant Design、ECharts |
| 后端 | Django 4、Django REST Framework、SimpleJWT |
| 数据库 | PostgreSQL |
| 任务调度 | Celery + Redis |
| 部署 | Docker Compose、Nginx 反向代理 |

## 项目目录结构

```text
.
├── backend
│   ├── foods
│   │   ├── services
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   ├── repository.py
│   │   ├── routes.py
│   │   └── views.py
│   └── shelf_life
├── frontend
│   ├── src/api
│   ├── src/features/food
│   ├── src/features/reports
│   ├── src/features/shared
│   └── src/types
├── database/init.sql
├── docker-compose.yml
├── .env.example
└── README.md
```

## 环境变量说明

| 变量 | 说明 |
| --- | --- |
| `COMPOSE_PROJECT_NAME` | Compose 项目名，默认 `cyfreshfood` |
| `FRONTEND_PORT` | 前端映射端口，默认 `18628` |
| `BACKEND_PORT` | 后端映射端口，默认 `19628` |
| `DB_PORT` | PostgreSQL 宿主机映射端口，默认 `17628` |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` | 数据库连接信息 |
| `JWT_SECRET` | JWT 签名密钥 |

## Docker 部署说明

- `docker-compose.yml` 顶层使用 `name: cyfreshfood`，并在 `.env` 中提供 `COMPOSE_PROJECT_NAME=cyfreshfood`，可在中文目录下启动。
- 前端容器由 Nginx 托管静态文件，前端代码只请求 `/api`，由 Nginx 代理到 `http://backend:8000/`。
- PostgreSQL 和 Redis 使用命名卷 `db_data`、`redis_data` 持久化，Celery worker 使用同一后端镜像启动。
- 端口冲突时修改 `.env` 中的 `FRONTEND_PORT`、`BACKEND_PORT` 或 `DB_PORT` 后重新执行 `docker compose up -d`。

## License

MIT
