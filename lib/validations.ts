import { z } from "zod"

export const uuidSchema = z.string().uuid()

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const createTopicSchema = z
  .object({
    closesAt: z.string().min(1, "Closes at is required"),
    description: z.string().max(5000, "Description is too long").optional(),
    isActive: z.boolean().optional(),
    memberListId: z
      .string({ required_error: "Member list is required" })
      .uuid(),
    opensAt: z.string().min(1, "Opens at is required"),
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  })
  .refine((data) => new Date(data.closesAt) > new Date(data.opensAt), {
    message: "Closes at must be after opens at",
    path: ["closesAt"],
  })

export const createMemberListSchema = z.object({
  description: z.string().max(5000, "Description is too long").optional(),
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
})

export const addMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const castVoteSchema = z.object({
  topicId: z.string().uuid(),
  vote: z.enum(["yes", "no"]),
})
