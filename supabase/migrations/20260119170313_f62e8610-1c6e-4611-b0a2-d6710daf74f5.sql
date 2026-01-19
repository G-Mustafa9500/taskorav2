-- Create files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for files bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view files in their company"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'files');

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create file_metadata table to store file info
CREATE TABLE public.file_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  subject TEXT,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on file_metadata
ALTER TABLE public.file_metadata ENABLE ROW LEVEL SECURITY;

-- File metadata policies
CREATE POLICY "Users can view all files"
ON public.file_metadata FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can upload files"
ON public.file_metadata FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
ON public.file_metadata FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create whiteboards table
CREATE TABLE public.whiteboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled Whiteboard',
  canvas_data TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on whiteboards
ALTER TABLE public.whiteboards ENABLE ROW LEVEL SECURITY;

-- Whiteboard policies
CREATE POLICY "Users can view their own whiteboards"
ON public.whiteboards FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_shared = true);

CREATE POLICY "Users can create whiteboards"
ON public.whiteboards FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own whiteboards"
ON public.whiteboards FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own whiteboards"
ON public.whiteboards FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add manager_id to profiles for team assignment
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS manager_id UUID;

-- Update trigger for file_metadata
CREATE TRIGGER update_file_metadata_updated_at
BEFORE UPDATE ON public.file_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for whiteboards
CREATE TRIGGER update_whiteboards_updated_at
BEFORE UPDATE ON public.whiteboards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();