import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp,
    pgEnum,
    jsonb,
    text,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

/**
 * ENUMS
 */
export const matchStatusEnum = pgEnum("match_status", [
    "scheduled",
    "live",
    "finished",
]);

/**
 * MATCHES TABLE
 */
export const matches = pgTable("matches", {
    id: serial("id").primaryKey(),

    sport: varchar("sport", {length: 50}).notNull(),

    homeTeam: varchar("home_team", {length: 100}).notNull(),
    awayTeam: varchar("away_team", {length: 100}).notNull(),

    status: matchStatusEnum("status").notNull().default("scheduled"),

    startTime: timestamp("start_time", {withTimezone: true}),
    endTime: timestamp("end_time", {withTimezone: true}),

    homeScore: integer("home_score").notNull().default(0),
    awayScore: integer("away_score").notNull().default(0),

    createdAt: timestamp("created_at", {withTimezone: true})
        .notNull()
        .defaultNow(),
});

/**
 * COMMENTARY TABLE
 */
export const commentary = pgTable("commentary", {
    id: serial("id").primaryKey(),

    matchId: integer("match_id")
        .notNull()
        .references(() => matches.id, {onDelete: "cascade"}),

    minute: integer("minute"),
    sequence: integer("sequence").notNull(),
    period: varchar("period", {length: 50}),

    eventType: varchar("event_type", {length: 50}),
    actor: varchar("actor", {length: 100}),
    team: varchar("team", {length: 100}),

    message: text("message"),

    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    tags: text("tags").array(),

    createdAt: timestamp("created_at", {withTimezone: true})
        .notNull()
        .defaultNow(),
});

/**
 * RELATIONS
 */
export const matchesRelations = relations(matches, ({many}) => ({
    commentary: many(commentary),
}));

export const commentaryRelations = relations(commentary, ({one}) => ({
    match: one(matches, {
        fields: [commentary.matchId],
        references: [matches.id],
    }),
}));

/**
 * TYPES (for strong typing across your app)
 */
export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

export type Commentary = typeof commentary.$inferSelect;
export type NewCommentary = typeof commentary.$inferInsert;

