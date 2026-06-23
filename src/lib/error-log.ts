import { Prisma } from "@prisma/client";
import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

type ErrorWritableDb = typeof db & {
  errorLog?: {
    create: (args: {
      data: {
        scope: string;
        message: string;
        stack?: string | null;
        metadata?: Prisma.InputJsonValue;
      };
    }) => Promise<unknown>;
  };
};

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function logError(scope: string, error: unknown, metadata?: unknown) {
  if (!hasDatabaseUrl()) return;

  const client = db as ErrorWritableDb;
  if (!client.errorLog) return;

  try {
    await client.errorLog.create({
      data: {
        scope,
        message: errorMessage(error),
        stack: error instanceof Error ? error.stack || null : null,
        metadata: metadata === undefined ? undefined : JSON.parse(JSON.stringify(metadata)) as Prisma.InputJsonValue
      }
    });
  } catch {
    // Error logging must never create a second failure path.
  }
}
