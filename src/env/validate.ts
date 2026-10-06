import type { z } from "zod";

export function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

export function validate<T extends z.ZodType>(
  schema: T,
  source: unknown,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Invalid ${label} environment variables:\n${formatIssues(result.error)}\n\n` +
        "Copy .env.example to .env and fill in the values.",
    );
  }
  return result.data;
}
