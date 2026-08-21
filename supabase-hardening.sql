-- =============================================================================
-- SECURITY HARDENING for GlowUp Supabase tables
-- =============================================================================
--
-- THE PROBLEM
--
-- supabase-schema.sql enables Row Level Security but then attaches:
--
--     CREATE POLICY "Allow all" ON glowup_state FOR ALL USING (true) WITH CHECK (true);
--
-- USING (true) means the policy matches every row for every caller, so RLS is
-- on in name only. Combined with the anon key being published in the client
-- bundle and the public git repo, that means ANY person on the internet can
-- read, modify, or delete everything in these tables.
--
-- Verified on 2026-08-21: an anonymous GET with only the public anon key
-- returned the 'basith' state row and event rows, HTTP 200.
--
-- That row contains bodyweight, body measurements, food logs, habit history
-- and personal reflections. This is sensitive data.
--
-- =============================================================================
-- IMPORTANT — READ BEFORE RUNNING
--
-- Applying this WILL break syncing until the app authenticates. The app
-- currently talks to Supabase as the anonymous role; these policies require a
-- logged-in user. Do both parts, or neither:
--
--   1. Run this SQL.
--   2. Wire Supabase Auth in the client (signInWithPassword / magic link) so
--      requests carry a real user JWT.
--
-- The passcode gate in App.tsx is NOT authentication. It is a client-side
-- string comparison and controls nothing on the server.
--
-- If you would rather not add auth right now, the safer interim option is to
-- stop syncing and rely on the local IndexedDB store, which already holds the
-- full dataset offline.
-- =============================================================================

-- Ownership column, so a row can belong to a specific authenticated user.
ALTER TABLE glowup_state  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE glowup_events ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Claim existing rows for your account before the strict policies land,
-- otherwise they become unreadable. Replace the UUID with your auth.users id.
--
--   UPDATE glowup_state  SET user_id = 'YOUR-AUTH-UID' WHERE user_id IS NULL;
--   UPDATE glowup_events SET user_id = 'YOUR-AUTH-UID' WHERE user_id IS NULL;

DROP POLICY IF EXISTS "Allow all" ON glowup_state;
DROP POLICY IF EXISTS "Allow all" ON glowup_events;

-- Each caller may only touch rows they own. auth.uid() is null for the
-- anonymous role, so anonymous access matches nothing at all.
CREATE POLICY "own rows only" ON glowup_state
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own rows only" ON glowup_events
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE glowup_state  ENABLE ROW LEVEL SECURITY;
ALTER TABLE glowup_events ENABLE ROW LEVEL SECURITY;

-- Verify afterwards: this should return zero rows when run with the anon key.
--   SELECT * FROM glowup_state;
