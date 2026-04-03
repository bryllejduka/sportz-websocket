import { MATCH_STATUS } from "@/validation/matches";

// Derive type from constant
type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

interface Match {
    startTime: string;
    endTime: string;
    status: MatchStatus | null | undefined;
}

type UpdateStatusFn = (status: MatchStatus) => Promise<void>;

export function getMatchStatus(
    startTime: string,
    endTime: string,
    now: Date = new Date()
): MatchStatus | null {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
    }

    if (now < start) {
        return MATCH_STATUS.SCHEDULED;
    }

    if (now >= end) {
        return MATCH_STATUS.FINISHED;
    }

    return MATCH_STATUS.LIVE;
}

export async function syncMatchStatus(
    match: Match,
    updateStatus: UpdateStatusFn
): Promise<MatchStatus | null | undefined> {
    const nextStatus = getMatchStatus(match.startTime, match.endTime);

    if (!nextStatus) {
        return match.status;
    }

    if (match.status !== nextStatus) {
        await updateStatus(nextStatus);
        match.status = nextStatus;
    }

    return match.status;
}