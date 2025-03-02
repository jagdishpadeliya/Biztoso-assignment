import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  listingStatuses,
  MAX_FILE_SIZE,
} from "./constants";

const businessProfileSchema = z.object({
  id: z
    .string()
    .default(() => crypto.randomUUID())
    .optional(),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  logo: z.string().optional(),
  emailAddress: z.string().email({
    message: "Email must be a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  websiteUrl: z.string().url({
    message: "Website must be a valid URL.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  foundedYear: z.number().int().min(4, {
    message: "Year must be at least 4 characters.",
  }),
  noOfEmployees: z.number().int().min(1, {
    message: "Number of employees must be at least 1.",
  }),
});

const listingSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  price: z.number().min(1, {
    message: "Price must be at least 1.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  status: z.enum([...listingStatuses, ""]),
  images: z
    .array(
      z
        .custom<File>()
        .refine((file) => file instanceof File, {
          message: "Please upload a valid file",
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "File size must be less than 5MB",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: "Only .jpg, .jpeg, .png, .webp, and .gif files are accepted",
        })
    )
    .min(1, {
      message: "At least one image is required",
    }),
  createdAt: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  updatedAt: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().optional()
  ),
  ownerId: z.string().optional(),
  id: z
    .string()
    .default(() => crypto.randomUUID())
    .optional(),
});

export { businessProfileSchema, listingSchema };
