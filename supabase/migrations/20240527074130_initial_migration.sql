CREATE TABLE
  public.user_profiles (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    image_url TEXT,
    language TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

CREATE OR REPLACE FUNCTION 
  public.handle_new_user () 
  RETURNS TRIGGER 
  LANGUAGE plpgsql 
  SECURITY DEFINER AS $$
  BEGIN
    INSERT INTO public.user_profiles (user_id, email, user_name, image_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data ->> 'name',
            NEW.raw_user_meta_data ->> 'full_name',
            NEW.raw_user_meta_data ->> 'user_name',
            '[redacted]'
        ),
        NEW.raw_user_meta_data ->> 'image_url'
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
        email = EXCLUDED.email,
        user_name = EXCLUDED.user_name,
        image_url = EXCLUDED.image_url;
    
    RETURN NEW;
  END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user ();

CREATE TRIGGER on_auth_user_verified
AFTER
UPDATE ON auth.users FOR EACH ROW WHEN (
  OLD.last_sign_in_at IS NULL
  AND NEW.last_sign_in_at IS NOT NULL
)
EXECUTE PROCEDURE public.handle_new_user ();

ALTER TABLE "public"."user_profiles" enable row level security; 

CREATE POLICY 
  "Enable Create, Delete, Update, Read for users based on user_id" 
  ON "public"."user_profiles" 
  AS PERMISSIVE FOR ALL
  TO public 
  USING (auth.uid() = "user_id");
  
