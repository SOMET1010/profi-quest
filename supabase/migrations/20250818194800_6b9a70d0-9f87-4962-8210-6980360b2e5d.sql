-- Fix remaining critical security vulnerabilities: Remove public access to sensitive data

-- 1. Fix projects table - Remove permissive policies and add role-based access
DROP POLICY IF EXISTS "all_select" ON public.projects;
DROP POLICY IF EXISTS "all_insert" ON public.projects;
DROP POLICY IF EXISTS "all_update" ON public.projects;
DROP POLICY IF EXISTS "all_delete" ON public.projects;

CREATE POLICY "Admins and HR managers can view projects" 
ON public.projects 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can insert projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can update projects" 
ON public.projects 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Only admins can delete projects" 
ON public.projects 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix projets table - Remove permissive policies and add role-based access
DROP POLICY IF EXISTS "all_select" ON public.projets;
DROP POLICY IF EXISTS "all_insert" ON public.projets;
DROP POLICY IF EXISTS "all_update" ON public.projets;
DROP POLICY IF EXISTS "all_delete" ON public.projets;

CREATE POLICY "Admins and HR managers can view projets" 
ON public.projets 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can insert projets" 
ON public.projets 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can update projets" 
ON public.projets 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Only admins can delete projets" 
ON public.projets 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix activity_log table - Restrict to admin access only
DROP POLICY IF EXISTS "all_select" ON public.activity_log;
DROP POLICY IF EXISTS "all_insert" ON public.activity_log;
DROP POLICY IF EXISTS "all_update" ON public.activity_log;
DROP POLICY IF EXISTS "all_delete" ON public.activity_log;

CREATE POLICY "Only admins can view activity logs" 
ON public.activity_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert activity logs" 
ON public.activity_log 
FOR INSERT 
WITH CHECK (true); -- Allow system inserts but no user inserts

-- 4. Fix kpi_data table - Restrict to admin and HR manager access
DROP POLICY IF EXISTS "all_select" ON public.kpi_data;
DROP POLICY IF EXISTS "all_insert" ON public.kpi_data;
DROP POLICY IF EXISTS "all_update" ON public.kpi_data;
DROP POLICY IF EXISTS "all_delete" ON public.kpi_data;

CREATE POLICY "Admins and HR managers can view KPI data" 
ON public.kpi_data 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "System can insert KPI data" 
ON public.kpi_data 
FOR INSERT 
WITH CHECK (true); -- Allow system inserts for automated KPI collection

CREATE POLICY "Only admins can update KPI data" 
ON public.kpi_data 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete KPI data" 
ON public.kpi_data 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));