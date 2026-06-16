-- Adicionar campos description e due_date à tabela tasks
ALTER TABLE public.tasks
ADD COLUMN description TEXT,
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;

-- Atualizar políticas RLS se necessário (já existem para a tabela)
-- As políticas existentes já cobrem SELECT, INSERT, UPDATE, DELETE para authenticated users