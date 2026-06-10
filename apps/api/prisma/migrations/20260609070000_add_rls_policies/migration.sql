-- Allow the authenticated/service role full access to all tables
-- This is the standard pattern for Prisma + Supabase where the API layer enforces auth

-- Grant full access to the authenticated role
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Create permissive policies for authenticated and service_role on all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'service_role_all_' || t, t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true)',
      'service_role_all_' || t,
      t
    );
  END LOOP;
END $$;

-- Also allow anon role to read public catalog tables (Subject, Chapter, Topic, Lesson, Video, Note, Quiz)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['Subject','Chapter','Topic','Lesson','Video','Note','Quiz']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'anon_read_' || t, t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT TO anon USING (true)',
      'anon_read_' || t,
      t
    );
  END LOOP;
END $$;

-- Grant anon read access to catalog tables dynamically and safely
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['Subject','Chapter','Topic','Lesson','Video','Note','Quiz']
  LOOP
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
      EXECUTE format('GRANT SELECT ON %I TO anon', t);
    END IF;
  END LOOP;
END $$;
