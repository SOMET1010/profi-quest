-- Phase 1: Create application_status_history table
CREATE TABLE IF NOT EXISTS application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public_applications(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for better performance
CREATE INDEX idx_application_status_history_application_id ON application_status_history(application_id);
CREATE INDEX idx_application_status_history_created_at ON application_status_history(created_at DESC);

-- Enable RLS
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for application_status_history
CREATE POLICY "RH can view all status history"
ON application_status_history FOR SELECT
USING (has_permission(auth.uid(), 'view_all_applications'));

CREATE POLICY "RH can insert status history"
ON application_status_history FOR INSERT
WITH CHECK (has_permission(auth.uid(), 'review_applications'));

CREATE POLICY "Users can view their own application history"
ON application_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public_applications
    WHERE public_applications.id = application_status_history.application_id
      AND public_applications.user_id = auth.uid()
  )
);

-- Create function to update application status
CREATE OR REPLACE FUNCTION update_application_status(
  _application_id UUID,
  _new_status TEXT,
  _notes TEXT DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _old_status TEXT;
  _user_email TEXT;
  _first_name TEXT;
  _last_name TEXT;
  _result json;
BEGIN
  -- Get current status and user info
  SELECT status, email, first_name, last_name
  INTO _old_status, _user_email, _first_name, _last_name
  FROM public_applications
  WHERE id = _application_id;

  -- Check if application exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  -- Update application status
  UPDATE public_applications
  SET 
    status = _new_status,
    updated_at = now(),
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    notes = COALESCE(_notes, notes)
  WHERE id = _application_id;

  -- Insert status history
  INSERT INTO application_status_history (
    application_id,
    old_status,
    new_status,
    changed_by,
    notes
  ) VALUES (
    _application_id,
    _old_status,
    _new_status,
    auth.uid(),
    _notes
  );

  -- Prepare result with email info
  _result := json_build_object(
    'success', true,
    'application_id', _application_id,
    'old_status', _old_status,
    'new_status', _new_status,
    'email', _user_email,
    'first_name', _first_name,
    'last_name', _last_name
  );

  RETURN _result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_application_status TO authenticated;