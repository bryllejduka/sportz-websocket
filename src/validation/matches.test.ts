import { describe, it, expect } from "vitest";
import {
    listMatchesQuerySchema,
    matchIdParamSchema,
    createMatchSchema,
    updateScoreSchema,
} from "./matches";

describe("listMatchesQuerySchema", () => {
    it("should accept valid limit", () => {
        const result = listMatchesQuerySchema.parse({ limit: "10" });
        expect(result.limit).toBe(10);
    });

    it("should allow undefined limit", () => {
        const result = listMatchesQuerySchema.parse({});
        expect(result.limit).toBeUndefined();
    });

    it("should reject limit greater than 100", () => {
        expect(() =>
            listMatchesQuerySchema.parse({ limit: "101" })
        ).toThrow();
    });

    it("should reject negative limit", () => {
        expect(() =>
            listMatchesQuerySchema.parse({ limit: "-5" })
        ).toThrow();
    });
});

describe("matchIdParamSchema", () => {
    it("should accept valid id", () => {
        const result = matchIdParamSchema.parse({ id: "1" });
        expect(result.id).toBe(1);
    });

    it("should reject invalid id", () => {
        expect(() =>
            matchIdParamSchema.parse({ id: "0" })
        ).toThrow();
    });
});

describe("createMatchSchema", () => {
    const validData = {
        sport: "basketball",
        homeTeam: "Lakers",
        awayTeam: "Warriors",
        startTime: "2025-01-01T10:00:00.000Z",
        endTime: "2025-01-01T12:00:00.000Z",
        homeScore: "0",
        awayScore: "0",
    };

    it("should accept valid data", () => {
        const result = createMatchSchema.parse(validData);
        expect(result.homeScore).toBe(0);
        expect(result.awayScore).toBe(0);
    });

    it("should reject empty team name", () => {
        expect(() =>
            createMatchSchema.parse({ ...validData, homeTeam: "" })
        ).toThrow();
    });

    it("should reject invalid ISO startTime", () => {
        expect(() =>
            createMatchSchema.parse({
                ...validData,
                startTime: "not-a-date",
            })
        ).toThrow();
    });

    it("should reject endTime before startTime", () => {
        expect(() =>
            createMatchSchema.parse({
                ...validData,
                endTime: "2024-01-01T00:00:00.000Z",
            })
        ).toThrow();
    });

    it("should allow missing optional scores", () => {
        const { homeScore, awayScore, ...rest } = validData;
        const result = createMatchSchema.parse(rest);

        expect(result.homeScore).toBeUndefined();
        expect(result.awayScore).toBeUndefined();
    });

    it("should reject negative scores", () => {
        expect(() =>
            createMatchSchema.parse({
                ...validData,
                homeScore: "-1",
            })
        ).toThrow();
    });
});

describe("updateScoreSchema", () => {
    it("should accept valid scores", () => {
        const result = updateScoreSchema.parse({
            homeScore: "2",
            awayScore: "3",
        });

        expect(result.homeScore).toBe(2);
        expect(result.awayScore).toBe(3);
    });

    it("should reject negative scores", () => {
        expect(() =>
            updateScoreSchema.parse({
                homeScore: "-1",
                awayScore: "1",
            })
        ).toThrow();
    });

    it("should reject missing scores", () => {
        expect(() =>
            updateScoreSchema.parse({
                homeScore: "1",
            })
        ).toThrow();
    });
});