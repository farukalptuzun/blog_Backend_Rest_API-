const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
  name: z.string().min(1).max(80)
});

const loginSchema = z
  .object({
    email: z.string().email().max(254).optional(),
    username: z.string().min(1).max(80).optional(),
    password: z.string().min(1).max(200)
  })
  .refine((d) => Boolean(d.email || d.username), {
    message: 'email or username is required',
    path: ['email']
  });

module.exports = { registerSchema, loginSchema };

