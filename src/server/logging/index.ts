import "server-only";

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "pin",
  "pinhash",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "cookie",
  "secret",
  "secretkey",
  "apikey",
  "cardnumber",
  "pan",
  "cvv",
]);

function redact(value: unknown, depth = 0): unknown {
  if (depth > 6 || value == null) return value;
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));
  if (value instanceof Error)
    return { name: value.name, message: value.message };
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(
      value as Record<string, unknown>,
    )) {
      output[key] = SENSITIVE_KEYS.has(key.toLowerCase())
        ? "[REDACTED]"
        : redact(entry, depth + 1);
    }
    return output;
  }
  return value;
}

export type LogLevel = "info" | "warn" | "error";

export function log(
  level: LogLevel,
  message: string,
  fields: Record<string, unknown> = {},
): void {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(redact(fields) as Record<string, unknown>),
  });
  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.log(entry);
  }
}
