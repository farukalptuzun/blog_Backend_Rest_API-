const { z } = require('zod');

const updateMeSchema = z
  .object({
    name: z.string().min(1).max(80).optional(),
    bio: z.string().max(400).optional()
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'At least one field is required' });

module.exports = { updateMeSchema };

