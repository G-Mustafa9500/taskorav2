-- Fix permissive notification INSERT policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

CREATE POLICY "Users can create notifications for others" ON public.notifications
  FOR INSERT TO authenticated 
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'manager') OR
    auth.uid() = user_id
  );