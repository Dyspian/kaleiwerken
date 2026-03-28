-- Add display_order column to projects table
ALTER TABLE public.projects 
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create index for better performance when ordering
CREATE INDEX idx_projects_display_order ON public.projects(display_order);

-- Update existing projects to have sequential order
UPDATE public.projects 
SET display_order = sub.row_number
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_number
  FROM public.projects
) sub
WHERE public.projects.id = sub.id;