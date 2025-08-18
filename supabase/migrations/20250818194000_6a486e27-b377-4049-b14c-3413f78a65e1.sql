-- Fix security vulnerability: Remove public access to sensitive business data
-- Replace permissive RLS policies with role-based access control

-- 1. Fix projets_hierarchiques table
DROP POLICY IF EXISTS "all_select" ON public.projets_hierarchiques;
DROP POLICY IF EXISTS "all_insert" ON public.projets_hierarchiques;
DROP POLICY IF EXISTS "all_update" ON public.projets_hierarchiques;
DROP POLICY IF EXISTS "all_delete" ON public.projets_hierarchiques;

CREATE POLICY "Admins and HR managers can view projects" 
ON public.projets_hierarchiques 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can insert projects" 
ON public.projets_hierarchiques 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can update projects" 
ON public.projets_hierarchiques 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Only admins can delete projects" 
ON public.projets_hierarchiques 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix activites table
DROP POLICY IF EXISTS "all_select" ON public.activites;
DROP POLICY IF EXISTS "all_insert" ON public.activites;
DROP POLICY IF EXISTS "all_update" ON public.activites;
DROP POLICY IF EXISTS "all_delete" ON public.activites;

CREATE POLICY "Admins and HR managers can view activities" 
ON public.activites 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can insert activities" 
ON public.activites 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can update activities" 
ON public.activites 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Only admins can delete activities" 
ON public.activites 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix programmes table
DROP POLICY IF EXISTS "all_select" ON public.programmes;
DROP POLICY IF EXISTS "all_insert" ON public.programmes;
DROP POLICY IF EXISTS "all_update" ON public.programmes;
DROP POLICY IF EXISTS "all_delete" ON public.programmes;

CREATE POLICY "Admins and HR managers can view programmes" 
ON public.programmes 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can insert programmes" 
ON public.programmes 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can update programmes" 
ON public.programmes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Only admins can delete programmes" 
ON public.programmes 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix directions table
DROP POLICY IF EXISTS "all_select" ON public.directions;
DROP POLICY IF EXISTS "all_insert" ON public.directions;
DROP POLICY IF EXISTS "all_update" ON public.directions;
DROP POLICY IF EXISTS "all_delete" ON public.directions;

CREATE POLICY "Admins and HR managers can view directions" 
ON public.directions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can insert directions" 
ON public.directions 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Admins and HR managers can update directions" 
ON public.directions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'hr_manager'::app_role));

CREATE POLICY "Only admins can delete directions" 
ON public.directions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));