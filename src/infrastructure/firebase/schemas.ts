import { z } from "zod";

/**
 * Core domain schemas for runtime validation
 * Ensures data from Firestore conforms to expected types
 */

// ==================== Shared Types ====================

export const RoastPersonaSchema = z.enum(["brutal", "gentle"]);
export type RoastPersona = z.infer<typeof RoastPersonaSchema>;

export const TagSentimentSchema = z.enum(["love", "ok", "veto"]);
export type TagSentiment = z.infer<typeof TagSentimentSchema>;

export const TagSchema = z.object({
  name: z.string().min(1, "Tag name required"),
  sentiment: TagSentimentSchema,
});
export type Tag = z.infer<typeof TagSchema>;

export const SkillRadarSchema = z.object({
  frontend: z.number().min(1).max(10),
  backend: z.number().min(1).max(10),
  design: z.number().min(1).max(10),
  data: z.number().min(1).max(10),
  devops: z.number().min(1).max(10),
  soft: z.number().min(1).max(10),
});
export type SkillRadar = z.infer<typeof SkillRadarSchema>;

export const SquadStatusSchema = z.enum(["open", "looking", "closed"]);
export type SquadStatus = z.infer<typeof SquadStatusSchema>;

// ==================== Member/Profile ====================

export const MemberIdentitySchema = z.object({
  uid: z.string().min(1),
  displayName: z.string().min(1),
  photoURL: z.string().url().optional(),
  bio: z.string().default(""),
});
export type MemberIdentity = z.infer<typeof MemberIdentitySchema>;

export const MemberRolesSchema = z.object({
  role: z.string().min(1),
  secondaryRoles: z.array(z.string()).default([]),
});
export type MemberRoles = z.infer<typeof MemberRolesSchema>;

export const MemberSkillsSchema = z.object({
  skills: SkillRadarSchema,
});
export type MemberSkills = z.infer<typeof MemberSkillsSchema>;

export const MemberTagsSchema = z.object({
  tags: z.array(TagSchema).min(1, "At least 1 tag required"),
});
export type MemberTags = z.infer<typeof MemberTagsSchema>;

export const MemberSquadStatusSchema = z.object({
  squadId: z.string().optional(),
  squadStatus: SquadStatusSchema.default("open"),
});
export type MemberSquadStatus = z.infer<typeof MemberSquadStatusSchema>;

export const MemberSchema = MemberIdentitySchema.merge(MemberRolesSchema)
  .merge(MemberSkillsSchema)
  .merge(MemberTagsSchema)
  .merge(MemberSquadStatusSchema)
  .merge(
    z.object({
      createdAt: z.any(), // Timestamp type
      updatedAt: z.any(), // Timestamp type
      visibility: z.enum(["public", "private"]).default("private"),
    }),
  );
export type Member = z.infer<typeof MemberSchema>;

export const PublicMemberSchema = MemberIdentitySchema.merge(MemberRolesSchema).merge(
  z.object({
    visibility: z.literal("public"),
    tags: z.array(TagSchema).optional(),
  }),
);
export type PublicMember = z.infer<typeof PublicMemberSchema>;

// ==================== Squad ====================

export const SquadMemberSchema = z.object({
  uid: z.string(),
  displayName: z.string(),
  photoURL: z.string().url().optional(),
  role: z.string(),
  joinedAt: z.any(), // Timestamp
});
export type SquadMember = z.infer<typeof SquadMemberSchema>;

export const SquadSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  ownerId: z.string().min(1),
  members: z.array(SquadMemberSchema).default([]),
  maxMembers: z.number().int().positive().default(5),
  createdAt: z.any(), // Timestamp
  updatedAt: z.any(), // Timestamp
});
export type Squad = z.infer<typeof SquadSchema>;

// ==================== Roast/Analysis ====================

export const RoastInputSchema = z.object({
  entityId: z.string(),
  entityType: z.enum(["member", "squad"]),
  persona: RoastPersonaSchema,
});
export type RoastInput = z.infer<typeof RoastInputSchema>;

export const RoastResultSchema = z.object({
  text: z.string(),
  persona: RoastPersonaSchema,
  createdAt: z.any(), // Timestamp
});
export type RoastResult = z.infer<typeof RoastResultSchema>;

export const AnalysisRequestSchema = z.object({
  type: z.enum(["profile", "compatibility", "team"]),
  tone: z.enum(["brutal", "gentle"]),
  data: z.record(z.string(), z.any()),
});
export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;

export const AnalysisResultSchema = z.object({
  result: z.string(),
  type: z.enum(["profile", "compatibility", "team"]),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ==================== Utility Types ====================

export const ProfileFiltersSchema = z.object({
  role: z.string().optional(),
  tags: z.array(z.string()).optional(),
  squadStatus: SquadStatusSchema.optional(),
  minSkillLevel: z.number().min(1).max(10).optional(),
});
export type ProfileFilters = z.infer<typeof ProfileFiltersSchema>;

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.record(z.string(), z.string()).optional(),
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
