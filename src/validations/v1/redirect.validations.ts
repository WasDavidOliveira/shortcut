import { z } from 'zod';

export const redirectSchema = z.object({
  params: z.object({
    shortCode: z
      .string({ required_error: 'Código curto é obrigatório' })
      .min(1, { message: 'Código curto não pode estar vazio' })
      .max(255, { message: 'Código curto deve ter no máximo 255 caracteres' })
  })
});

export type RedirectInput = z.infer<typeof redirectSchema>; 