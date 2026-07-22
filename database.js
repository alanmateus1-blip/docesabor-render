const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://zhapyfdjmyjpdfkourbx.supabase.co";
const supabaseKey =
  process.env.SUPABASE_KEY || "sb_publishable_bRLFYdXnNlI-BWFGs-c_6W_j0W_0uEy";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
