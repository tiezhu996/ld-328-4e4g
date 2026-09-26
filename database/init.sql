CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  role VARCHAR(40) NOT NULL,
  permission VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS foods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(40) NOT NULL,
  production_date DATE NOT NULL,
  shelf_life_days INTEGER NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  location VARCHAR(60) NOT NULL,
  opened_date DATE,
  owner VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'fresh',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consumption_records (
  id SERIAL PRIMARY KEY,
  food_id INTEGER REFERENCES foods(id),
  quantity NUMERIC(10, 2) NOT NULL,
  consumed_at DATE NOT NULL,
  member_name VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS reminder_preferences (
  id SERIAL PRIMARY KEY,
  days_before INTEGER NOT NULL DEFAULT 3,
  remind_time VARCHAR(10) NOT NULL DEFAULT '09:00',
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO family_members(name,role,permission)
VALUES ('妈妈','管理员','添加/消耗/编辑')
ON CONFLICT DO NOTHING;

INSERT INTO foods(name,category,production_date,shelf_life_days,quantity,unit,location,owner,status)
VALUES ('有机鸡蛋','生鲜','2026-05-22',15,10,'个','冰箱','妈妈','fresh')
ON CONFLICT DO NOTHING;
