const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://zhapyfdjmyjpdfkourbx.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "SUA_CHAVE_AQUI";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
