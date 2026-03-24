import { z } from "zod";

// Constant for match statuses
export const MATCH_STATUS = {
    SCHEDULED: "scheduled",
    LIVE: "live",
    FINISHED: "finished",
} as const;

// Helper function to validate ISO date strings
const isValidISODate = (value: string): boolean => {
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && value === date.toISOString();
};

// Query schema for listing matches
export const listMatchesQuerySchema = z.object({
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .optional(),
});

// Param schema for match ID
export const matchIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

// Schema for creating a match
export const createMatchSchema = z
    .object({
        sport: z.string().min(1, "sport is required"),
        homeTeam: z.string().min(1, "homeTeam is required"),
        awayTeam: z.string().min(1, "awayTeam is required"),

        startTime: z.string().refine(isValidISODate, {
            message: "startTime must be a valid ISO date string",
        }),
        endTime: z.string().refine(isValidISODate, {
            message: "endTime must be a valid ISO date string",
        }),

        homeScore: z.coerce.number().int().min(0).optional(),
        awayScore: z.coerce.number().int().min(0).optional(),
    })
    .superRefine((data, ctx) => {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);

        if (end <= start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "endTime must be after startTime",
                path: ["endTime"],
            });
        }
    });

// Schema for updating scores
export const updateScoreSchema = z.object({
    homeScore: z.coerce.number().int().min(0),
    awayScore: z.coerce.number().int().min(0),
});

export type ListMatchesQuery = z.infer<typeof listMatchesQuerySchema>;
export type MatchIdParam = z.infer<typeof matchIdParamSchema>;
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;