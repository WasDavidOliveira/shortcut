import { z } from 'zod';

export const createUrlSchema = z.object({
  body: z.object({
    originalUrl: z
      .string({ required_error: 'URL original é obrigatória' })
      .url({ message: 'URL deve ter formato válido' })
      .max(255, { message: 'URL deve ter no máximo 255 caracteres' }),
    userId: z
      .number({ required_error: 'ID do usuário é obrigatório' })
      .int({ message: 'ID do usuário deve ser um número inteiro' })
      .positive({ message: 'ID do usuário deve ser positivo' })
      .optional(),
    isActive: z
      .boolean({ message: 'Status ativo deve ser verdadeiro ou falso' })
      .default(true)
      .optional(),
  }),
});

export const updateUrlSchema = z.object({
  body: z
    .object({
      originalUrl: z
        .string()
        .url({ message: 'URL deve ter formato válido' })
        .max(255, { message: 'URL deve ter no máximo 255 caracteres' })
        .optional(),
      isActive: z
        .boolean({ message: 'Status ativo deve ser verdadeiro ou falso' })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Pelo menos um campo deve ser fornecido para atualização',
    }),
});

export const deleteUrlSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'ID é obrigatório' })
      .transform((id) => Number(id))
      .refine((id) => !isNaN(id), { message: 'ID deve ser um número válido' })
      .refine((id) => id > 0, { message: 'ID deve ser positivo' }),
  }),
});

export const getUrlSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'ID é obrigatório' })
      .transform((id) => Number(id))
      .refine((id) => !isNaN(id), { message: 'ID deve ser um número válido' })
      .refine((id) => id > 0, { message: 'ID deve ser positivo' }),
  }),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>;
