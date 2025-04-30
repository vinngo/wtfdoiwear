import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://aizxpqhqjrsjqohxugxv.supabase.co";
const anonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpenhwcWhxanJzanFvaHh1Z3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NzUzMzAsImV4cCI6MjA2MTU1MTMzMH0.v39gFMuIg1GSuZpDck8Cxi3ERQ_Z7R3uppLAWuqXLtA";

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
