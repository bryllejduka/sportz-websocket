import {Router, type Request, type Response} from 'express';
import {createMatchSchema, CreateMatchInput, listMatchesQuerySchema} from "@/validation/matches";
import type {ZodSafeParseResult} from 'zod'
import {db} from "@/db/db";
import {matches} from "@/db/schema";
import {getMatchStatus} from "@/utils/match-status";
import {desc} from "drizzle-orm";

export const matchRouter = Router();

const MAX_LIMIT = 100

matchRouter.get('/', async (req: Request, res: Response): Promise<void> => {
    const parsed = listMatchesQuerySchema.safeParse((req.query));

    if (!parsed.success) {
        res.status(400).json({
            error: 'Invalid query',
            details: JSON.stringify(parsed.error)
        })
        return;
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

    try {
        const data = await db.select().from(matches).orderBy((desc(matches.createdAt))).limit(limit);
        res.status(200).json({data})
    } catch (e) {
        res.status(500).json({
            error: 'Failed to list matches',
            details: JSON.stringify(e)
        })
    }

})

matchRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    const parsed = createMatchSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({
            error: 'Invalid payload',
            details: JSON.stringify(parsed.error)
        })
        return;
    }

    const {startTime, endTime, homeScore, awayScore, ...rest} = parsed.data

    try {
        const [event] = await db.insert(matches).values({
            ...rest,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime) ?? undefined,

        }).returning();

        res.status(201).json({
            data: event
        })

    } catch (e) {
        res.status(500).json({error: 'Failed to create match.', details: JSON.stringify(e)})
    }
})
