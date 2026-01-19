-- Create attendance table for tracking staff check-in/out
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'late', 'absent', 'leave')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create task assignees junction table
CREATE TABLE public.task_assignees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task', 'user', 'file', 'message', 'system')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  related_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Attendance policies
CREATE POLICY "Users can view all attendance" ON public.attendance
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own attendance" ON public.attendance
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance" ON public.attendance
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins and managers can manage all attendance" ON public.attendance
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'manager')
  );

-- Tasks policies (everyone can see all tasks)
CREATE POLICY "Authenticated users can view all tasks" ON public.tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create tasks" ON public.tasks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Task creators and admins can update tasks" ON public.tasks
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = created_by OR 
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'manager')
  );

CREATE POLICY "Task creators and admins can delete tasks" ON public.tasks
  FOR DELETE TO authenticated
  USING (
    auth.uid() = created_by OR 
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'manager')
  );

-- Task assignees policies
CREATE POLICY "Authenticated users can view task assignees" ON public.task_assignees
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Task creators and admins can manage assignees" ON public.task_assignees
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = task_assignees.task_id 
      AND (
        tasks.created_by = auth.uid() OR 
        public.has_role(auth.uid(), 'super_admin') OR 
        public.has_role(auth.uid(), 'manager')
      )
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();