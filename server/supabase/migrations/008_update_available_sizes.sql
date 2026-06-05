-- Update jersey sizes to include the full chart set
ALTER TABLE public.jerseys
  ALTER COLUMN available_sizes SET DEFAULT ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'];

UPDATE public.jerseys
SET available_sizes = ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'];