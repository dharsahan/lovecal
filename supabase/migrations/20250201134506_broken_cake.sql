/*
  # Love Calculator Schema

  1. New Tables
    - `love_calculations`
      - `id` (uuid, primary key)
      - `name1` (text, first person's name)
      - `name2` (text, second person's name)
      - `percentage` (integer, love percentage)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `love_calculations` table
    - Add policy for authenticated users to read all calculations
    - Add policy for authenticated users to insert their own calculations
*/

CREATE TABLE IF NOT EXISTS love_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name1 text NOT NULL,
  name2 text NOT NULL,
  percentage integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE love_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read love calculations"
  ON love_calculations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert love calculations"
  ON love_calculations
  FOR INSERT
  TO anon
  WITH CHECK (true);