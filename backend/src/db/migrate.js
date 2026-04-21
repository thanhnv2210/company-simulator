const pool = require('./index');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS flows (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      description TEXT,
      is_active   BOOLEAN NOT NULL DEFAULT true,
      state       JSONB NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE flows ADD COLUMN IF NOT EXISTS description TEXT;

    CREATE TABLE IF NOT EXISTS flow_decisions (
      id          SERIAL PRIMARY KEY,
      flow_id     INTEGER NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
      decision_id VARCHAR(100) NOT NULL,
      option_id   VARCHAR(100) NOT NULL,
      role_impacts JSONB NOT NULL,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Migration complete');
}

migrate()
  .then(() => process.exit(0))
  .catch(err => { console.error(err); process.exit(1); });
