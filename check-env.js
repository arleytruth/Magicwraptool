// Netlify build zamanında environment variables'ları kontrol et
console.log("========================================");
console.log("🔍 Checking Environment Variables at BUILD TIME");
console.log("========================================");

const envVars = {
  "NEXT_PUBLIC_SUPABASE_URL": process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + "...",
  "SUPABASE_SERVICE_ROLE_KEY": process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "...",
  "CLERK_SECRET_KEY": process.env.CLERK_SECRET_KEY?.substring(0, 20) + "...",
};

Object.entries(envVars).forEach(([key, value]) => {
  if (value && value !== "undefined...") {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`❌ ${key}: MISSING!`);
  }
});

console.log("========================================");
