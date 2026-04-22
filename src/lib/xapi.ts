import { z } from "zod";

/**
 * Minimal xAPI (Tin Can) statement shape, tuned for pharma training.
 * Strict enough to act as a CFR Part 11 compliant training record once
 * paired with signed user identity and tamper-evident storage.
 */

export const XAPI_VERB_IRI = {
  attempted: "http://adlnet.gov/expapi/verbs/attempted",
  completed: "http://adlnet.gov/expapi/verbs/completed",
  passed: "http://adlnet.gov/expapi/verbs/passed",
  failed: "http://adlnet.gov/expapi/verbs/failed",
  interacted: "http://adlnet.gov/expapi/verbs/interacted",
  initialized: "http://adlnet.gov/expapi/verbs/initialized",
  terminated: "http://adlnet.gov/expapi/verbs/terminated",
  // Pharma-specific extensions
  violated: "https://mktech.pharma/verbs/violated-sop",
  deviation: "https://mktech.pharma/verbs/recorded-deviation",
} as const;

export type XApiVerbKey = keyof typeof XAPI_VERB_IRI;

export const ActorSchema = z.object({
  objectType: z.literal("Agent").default("Agent"),
  name: z.string().min(1),
  account: z.object({
    homePage: z.string().url(),
    name: z.string().min(1),
  }),
});

export const VerbSchema = z.object({
  id: z.string().url(),
  display: z.record(z.string(), z.string()),
});

export const ActivitySchema = z.object({
  id: z.string().url(),
  definition: z.object({
    name: z.record(z.string(), z.string()),
    description: z.record(z.string(), z.string()).optional(),
    type: z.string().url().optional(),
  }),
});

export const ResultSchema = z
  .object({
    score: z
      .object({
        scaled: z.number().min(-1).max(1).optional(),
        raw: z.number().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
      })
      .optional(),
    success: z.boolean().optional(),
    completion: z.boolean().optional(),
    duration: z.string().optional(), // ISO 8601 duration
    extensions: z.record(z.string(), z.unknown()).optional(),
  })
  .optional();

export const ContextSchema = z
  .object({
    registration: z.string().uuid().optional(),
    platform: z.string().optional(),
    extensions: z
      .object({
        "https://mktech.pharma/ext/machine-id": z.string().optional(),
        "https://mktech.pharma/ext/sop-id": z.string().optional(),
        "https://mktech.pharma/ext/batch-id": z.string().optional(),
        "https://mktech.pharma/ext/cleanroom-grade": z
          .enum(["A", "B", "C", "D", "CNC"])
          .optional(),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .optional();

export const XApiStatementSchema = z.object({
  id: z.string().uuid().optional(),
  actor: ActorSchema,
  verb: VerbSchema,
  object: ActivitySchema,
  result: ResultSchema,
  context: ContextSchema,
  timestamp: z.string().datetime().optional(),
});

export type XApiStatement = z.infer<typeof XApiStatementSchema>;

export function buildStatement(input: {
  actorName: string;
  actorId: string;
  verb: XApiVerbKey;
  verbDisplay?: string;
  activityId: string;
  activityName: string;
  machineId?: string;
  sopId?: string;
  success?: boolean;
  scaled?: number;
  durationSec?: number;
  extensions?: Record<string, unknown>;
}): XApiStatement {
  const homePage = "https://mktech.pharma/users";
  return XApiStatementSchema.parse({
    actor: {
      objectType: "Agent",
      name: input.actorName,
      account: { homePage, name: input.actorId },
    },
    verb: {
      id: XAPI_VERB_IRI[input.verb],
      display: { "en-US": input.verbDisplay ?? input.verb },
    },
    object: {
      id: input.activityId,
      definition: {
        name: { "en-US": input.activityName },
        type: "http://adlnet.gov/expapi/activities/simulation",
      },
    },
    result:
      input.success !== undefined || input.scaled !== undefined
        ? {
            success: input.success,
            completion: input.success !== undefined,
            score:
              input.scaled !== undefined ? { scaled: input.scaled } : undefined,
            duration:
              input.durationSec !== undefined
                ? `PT${Math.max(1, Math.round(input.durationSec))}S`
                : undefined,
            extensions: input.extensions,
          }
        : undefined,
    context: {
      platform: "mktech-pharmasim-web",
      extensions: {
        "https://mktech.pharma/ext/machine-id": input.machineId,
        "https://mktech.pharma/ext/sop-id": input.sopId,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
