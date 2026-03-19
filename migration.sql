-- ============================================================
--  OptimaTech-Smart  |  Migración inicial
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories (
  id          VARCHAR(80)   PRIMARY KEY,
  label       VARCHAR(120)  NOT NULL,
  icon        VARCHAR(10)   NOT NULL DEFAULT '📦',
  description TEXT          DEFAULT '',
  color       VARCHAR(10)   NOT NULL DEFAULT '#FF6200',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id          VARCHAR(20)    PRIMARY KEY,
  name        VARCHAR(200)   NOT NULL,
  category_id VARCHAR(80)    REFERENCES categories(id) ON DELETE SET NULL,
  price       NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  stock       VARCHAR(20)    NOT NULL DEFAULT 'in-stock'
                             CHECK (stock IN ('in-stock','low-stock','out-stock')),
  badge       VARCHAR(60)    DEFAULT '',
  description TEXT           DEFAULT '',
  specs       TEXT[]         DEFAULT '{}',
  images      TEXT[]         DEFAULT '{}',
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL         PRIMARY KEY,
  customer    JSONB          NOT NULL,
  items       JSONB          NOT NULL,
  total       NUMERIC(10,2)  NOT NULL,
  status      VARCHAR(30)    NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Datos iniciales
INSERT INTO categories (id, label, icon, description, color) VALUES
  ('peri',  'Periféricos',    '🖱️', 'Mouse, teclados, auriculares y más',     '#FF6200'),
  ('mon',   'Monitores',      '🖥️', 'Full HD, 2K y 4K para trabajo y gaming', '#22d3ee'),
  ('store', 'Almacenamiento', '💾', 'SSD, NVMe, RAM y memorias USB',           '#a855f7'),
  ('net',   'Redes',          '🌐', 'Routers, switches y access points',       '#f59e0b'),
  ('cable', 'Cables & Hubs',  '🔌', 'Hubs USB-C, cables y adaptadores',        '#4ade80')
ON CONFLICT (id) DO NOTHING;
