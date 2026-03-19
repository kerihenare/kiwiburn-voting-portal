import { glide } from "@/lib/glidepath"

export const FormStack = glide("form", {
  other: "space-y-6",
})

export const FieldGroup = glide("div", {
  other: "space-y-2",
})

export const FieldError = glide("p", {
  color: "text-destructive",
  fontSize: "text-sm",
})

export const FormActions = glide("div", {
  display: "flex",
  gap: "gap-2",
  justifyContent: "justify-end",
})

export const DateGrid = glide("div", {
  display: "grid",
  gap: "gap-4",
  gridTemplateColumns: ["grid-cols-1", "sm:grid-cols-2"],
})

export const CheckboxRow = glide("div", {
  alignItems: "items-center",
  display: "flex",
  gap: "gap-2",
})
