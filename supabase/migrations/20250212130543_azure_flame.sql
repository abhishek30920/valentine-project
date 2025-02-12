/*
  # Create Valentines Gift Tables

  1. New Tables
    - `valentines_gifts`
      - `id` (uuid, primary key)
      - `from_name` (text)
      - `to_name` (text)
      - `message` (text)
      - `created_at` (timestamp)
      - `opened` (boolean)
  
  2. Security
    - Enable RLS on `valentines_gifts` table
    - Add policies for public access (since this is a public gift sharing app)
*/

CREATE TABLE IF NOT EXISTS valentines_gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_name text NOT NULL,
  to_name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  opened boolean DEFAULT false
);

ALTER TABLE valentines_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create gifts"
  ON valentines_gifts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read gifts"
  ON valentines_gifts
  FOR SELECT
  TO public
  USING (true);


DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'valentines_gifts' AND column_name = 'images'
  ) THEN
    ALTER TABLE valentines_gifts ADD COLUMN images text[] DEFAULT '{}';
  END IF;
END $$;