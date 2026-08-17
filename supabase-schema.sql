CREATE TABLE IF NOT EXISTS glowup_state (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS glowup_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schema text DEFAULT 'glowup-event-v1',
  date text NOT NULL,
  time text,
  source text DEFAULT 'web',
  area text NOT NULL,
  item text NOT NULL,
  status text DEFAULT 'done',
  value numeric,
  unit text,
  exact_update text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE glowup_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE glowup_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'glowup_state' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON glowup_state FOR ALL USING (true) WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'glowup_events' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON glowup_events FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
