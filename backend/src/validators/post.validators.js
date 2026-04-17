const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  categoryId: z.string().optional(),
  tags: z.array(z.string().min(1).max(40)).optional().default([]),
  published: z.boolean().optional().default(false)
});

const updatePostSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    categoryId: z.string().nullable().optional(),
    tags: z.array(z.string().min(1).max(40)).optional(),
    published: z.boolean().optional()
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'At least one field is required' });

module.exports = { createPostSchema, updatePostSchema };

