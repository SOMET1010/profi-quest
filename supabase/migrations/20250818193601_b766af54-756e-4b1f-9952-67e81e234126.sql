-- Remove the overly permissive RLS policies for employees table
DROP POLICY IF EXISTS "all_select" ON public.employees;
DROP POLICY IF EXISTS "all_insert" ON public.employees;
DROP POLICY IF EXISTS "all_update" ON public.employees;
DROP POLICY IF EXISTS "all_delete" ON public.employees;

-- Create secure RLS policies for employees table
-- Only admins and HR managers can view employee data
CREATE POLICY "Admins and HR managers can view employees" 
ON public.employees 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

-- Only admins and HR managers can insert employee data
CREATE POLICY "Admins and HR managers can insert employees" 
ON public.employees 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

-- Only admins and HR managers can update employee data
CREATE POLICY "Admins and HR managers can update employees" 
ON public.employees 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

-- Only admins can delete employee data (more restrictive)
CREATE POLICY "Only admins can delete employees" 
ON public.employees 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));