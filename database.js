const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://zhapyfdjmyjpdfkourbx.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoYXB5ZmRqbXlqcGRma291cmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDk4ODMsImV4cCI6MjA5NDQyNTg4M30.O9mB9AwD-dBKXNXQbeo38T9hhnqRaIKXo40Jii1pkKI";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
