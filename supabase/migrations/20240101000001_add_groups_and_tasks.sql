-- 创建任务组表
CREATE TABLE IF NOT EXISTS task_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id), -- 如果为空则是系统默认组
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 授予权限
GRANT SELECT ON task_groups TO anon;
GRANT ALL PRIVILEGES ON task_groups TO authenticated;
GRANT INSERT ON task_groups TO anon;

-- 修改 suggestions 表，添加 group_id 和 user_id
ALTER TABLE suggestions ADD COLUMN group_id UUID REFERENCES task_groups(id);
ALTER TABLE suggestions ADD COLUMN user_id UUID REFERENCES users(id);

-- 创建默认任务组
INSERT INTO task_groups (id, name, description, is_default) VALUES
  ('00000000-0000-0000-0000-000000000001', '默认任务组', '系统内置的基础任务', TRUE);

-- 将现有任务关联到默认组
UPDATE suggestions SET group_id = '00000000-0000-0000-0000-000000000001' WHERE group_id IS NULL;

-- 插入更多“去哪里”任务 (总数达到15个以上)
INSERT INTO suggestions (type, content, category, group_id) VALUES
  ('where', '去最近的书店逛逛', 'culture', '00000000-0000-0000-0000-000000000001'),
  ('where', '找个有台阶的地方坐十分钟', 'relax', '00000000-0000-0000-0000-000000000001'),
  ('where', '去看看最近的河流或湖泊', 'nature', '00000000-0000-0000-0000-000000000001'),
  ('where', '走进一家从未去过的便利店', 'exploration', '00000000-0000-0000-0000-000000000001'),
  ('where', '去最近的邮筒寄一张明信片', 'activity', '00000000-0000-0000-0000-000000000001'),
  ('where', '找一棵最大的树', 'nature', '00000000-0000-0000-0000-000000000001'),
  ('where', '去看看日落方向的尽头', 'scenery', '00000000-0000-0000-0000-000000000001'),
  ('where', '找个能看到高楼的地方', 'city', '00000000-0000-0000-0000-000000000001'),
  ('where', '去最近的公园荡秋千', 'play', '00000000-0000-0000-0000-000000000001'),
  ('where', '沿着人行道一直走直到遇到红灯', 'random', '00000000-0000-0000-0000-000000000001'),
  ('where', '去寻找附近的涂鸦墙', 'art', '00000000-0000-0000-0000-000000000001'),
  ('where', '去最近的公交车站看下一班车去哪', 'transport', '00000000-0000-0000-0000-000000000001'),
  ('where', '找个安静的角落听一首歌', 'relax', '00000000-0000-0000-0000-000000000001'),
  ('where', '去看看附近的桥', 'structure', '00000000-0000-0000-0000-000000000001'),
  ('where', '跟着一只猫走一段路', 'adventure', '00000000-0000-0000-0000-000000000001');

-- 插入更多“做什么”任务 (总数达到15个以上)
INSERT INTO suggestions (type, content, category, group_id) VALUES
  ('what', '买一瓶没喝过的饮料', 'food', '00000000-0000-0000-0000-000000000001'),
  ('what', '拍三张不同颜色的花', 'photo', '00000000-0000-0000-0000-000000000001'),
  ('what', '观察云的形状像什么', 'imagination', '00000000-0000-0000-0000-000000000001'),
  ('what', '和路过的狗打个招呼（心里默念）', 'interaction', '00000000-0000-0000-0000-000000000001'),
  ('what', '寻找并记录三种不同的鸟叫声', 'nature', '00000000-0000-0000-0000-000000000001'),
  ('what', '数一数路过的自行车', 'observation', '00000000-0000-0000-0000-000000000001'),
  ('what', '找一块形状特别的石头', 'collection', '00000000-0000-0000-0000-000000000001'),
  ('what', '对自己说一句鼓励的话', 'mindfulness', '00000000-0000-0000-0000-000000000001'),
  ('what', '观察影子的变化', 'observation', '00000000-0000-0000-0000-000000000001'),
  ('what', '闻一闻路边的花香', 'sensory', '00000000-0000-0000-0000-000000000001'),
  ('what', '在心里编一个小故事', 'creativity', '00000000-0000-0000-0000-000000000001'),
  ('what', '模仿一个路人的走路姿势（小心别被发现）', 'fun', '00000000-0000-0000-0000-000000000001'),
  ('what', '找找看有没有心形的物品', 'observation', '00000000-0000-0000-0000-000000000001'),
  ('what', '深呼吸十次', 'relax', '00000000-0000-0000-0000-000000000001'),
  ('what', '给未来的自己录一段音', 'record', '00000000-0000-0000-0000-000000000001');

-- 授予权限 (更新)
GRANT INSERT ON suggestions TO anon;
GRANT UPDATE ON suggestions TO anon;
