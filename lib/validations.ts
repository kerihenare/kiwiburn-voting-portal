import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const createTopicSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    memberListId: z.number({ required_error: "Member list is required" }),
    opensAt: z.string().min(1, "Opens at is required"),
    closesAt: z.string().min(1, "Closes at is required"),
  })
  .refine((data) => new Date(data.closesAt) > new Date(data.opensAt), {
    message: "Closes at must be after opens at",
    path: ["closesAt"],
  })

export const updateTopicSchema = createTopicSchema

export const createMemberListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export const addMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const castVoteSchema = z.object({
  topicId: z.number(),
  vote: z.enum(["yes", "no"]),
})

export type SignInInput = z.infer<typeof signInSchema>
export type CreateTopicInput = z.infer<typeof createTopicSchema>
export type CreateMemberListInput = z.infer<typeof createMemberListSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
export type CastVoteInput = z.infer<typeof castVoteSchema>
