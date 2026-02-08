-- 创建表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 授予权限
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

-- 创建表
CREATE TABLE IF NOT EXISTS suggestion_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  where_to_go TEXT NOT NULL,
  what_to_do TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_suggestion_history_user_id ON suggestion_history(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_history_created_at ON suggestion_history(created_at DESC);

-- 授予权限
GRANT SELECT ON suggestion_history TO anon;
GRANT ALL PRIVILEGES ON suggestion_history TO authenticated;
-- 额外授予 anon 角色插入权限，因为我们允许未登录用户使用
GRANT INSERT ON suggestion_history TO anon;

-- 创建表
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) CHECK (type IN ('where', 'what')),
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入初始数据
INSERT INTO suggestions (type, content, category) VALUES
  ('where', '随便走个六十分钟', 'time'),
  ('where', '随便换乘电车30分钟后下车', 'transport'),
  ('where', '找个公园坐坐', 'nature'),
  ('where', '沿着这条街走到尽头', 'exploration'),
  ('where', '找个咖啡馆休息一下', 'relax'),
  ('where', '探索附近的小巷子', 'exploration'),
  ('what', '吃个套餐吧', 'food'),
  ('what', '找找像脸的东西吧', 'observation'),
  ('what', '数一数看到的红色物品', 'game'),
  ('what', '给今天的心情拍张照片', 'photo'),
  ('what', '听听周围的声音', 'mindfulness'),
  ('what', '观察路人的鞋子', 'observation');

-- 授予权限
GRANT SELECT ON suggestions TO anon;
GRANT ALL PRIVILEGES ON suggestions TO authenticated;
