const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rawValueParts] = trimmed.split("=");
    if (process.env[key]) continue;
    process.env[key] = rawValueParts.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

const requiredProductionEnv = [
  "DATABASE_URL",
  "ADMIN_EMAIL",
  "ADMIN_SESSION_SECRET",
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_SHORTCODE",
  "MPESA_PASSKEY",
  "MPESA_CALLBACK_URL",
  "NEXT_PUBLIC_SITE_URL"
];

const warnings = [];
const failures = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function env(name) {
  return process.env[name] || "";
}

for (const key of requiredProductionEnv) {
  if (!env(key)) fail(`${key} is required for production.`);
}

if (env("ADMIN_PASSWORD") === "change-this-password") {
  fail("ADMIN_PASSWORD is still using the local development default.");
}

if (env("ADMIN_SESSION_SECRET") === "change-this-secret-before-production") {
  fail("ADMIN_SESSION_SECRET is still using the local development default.");
}

if (env("ADMIN_SESSION_SECRET") && env("ADMIN_SESSION_SECRET").length < 32) {
  fail("ADMIN_SESSION_SECRET must be at least 32 characters.");
}

if (env("MPESA_ENVIRONMENT") && !["sandbox", "production"].includes(env("MPESA_ENVIRONMENT"))) {
  fail("MPESA_ENVIRONMENT must be either sandbox or production.");
}

if (env("MPESA_ENVIRONMENT") === "production" && !env("MPESA_CALLBACK_URL").startsWith("https://")) {
  fail("MPESA_CALLBACK_URL must be HTTPS for production Daraja callbacks.");
}

if (env("NEXT_PUBLIC_SITE_URL") && !env("NEXT_PUBLIC_SITE_URL").startsWith("https://")) {
  warn("NEXT_PUBLIC_SITE_URL should use HTTPS before public launch.");
}

if (env("NEXT_PUBLIC_SITE_URL") && env("NEXT_PUBLIC_SITE_URL") !== "https://h2h.techsasaonline.com") {
  warn("NEXT_PUBLIC_SITE_URL does not match https://h2h.techsasaonline.com.");
}

if (env("DATABASE_URL") && /localhost|127\.0\.0\.1/i.test(env("DATABASE_URL"))) {
  fail("DATABASE_URL still points to localhost. Use the production PostgreSQL host.");
}

if (!env("ADMIN_PASSWORD")) {
  fail("ADMIN_PASSWORD is required to seed the first production administrator.");
}

if (env("ADMIN_EMAIL") && /\.local$/i.test(env("ADMIN_EMAIL"))) {
  fail("ADMIN_EMAIL must be a real administrator email address in production.");
}

if (!env("EMAIL_PROVIDER_API_KEY")) {
  warn("EMAIL_PROVIDER_API_KEY is not set, so receipt/thank-you emails are not ready.");
}

if (!env("SMS_PROVIDER_API_KEY")) {
  warn("SMS_PROVIDER_API_KEY is not set, so SMS donor updates are not ready.");
}

console.log("Heart to Heart production readiness check");
console.log("------------------------------------------");

if (failures.length === 0) {
  console.log("Blocking checks: passed");
} else {
  console.log("Blocking checks:");
  for (const message of failures) console.log(`- ${message}`);
}

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const message of warnings) console.log(`- ${message}`);
}

if (failures.length > 0) {
  process.exitCode = 1;
}
