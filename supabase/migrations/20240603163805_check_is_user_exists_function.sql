CREATE OR REPLACE FUNCTION email_exists(email_address text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
exists_flag boolean;
BEGIN
SELECT EXISTS(
SELECT 1
FROM auth.users
WHERE email = email_address
) INTO exists_flag;

RETURN exists_flag;
END;
$$;

CREATE
OR REPLACE FUNCTION update_user_profiles_email () RETURNS TRIGGER AS $$ 
BEGIN   
   UPDATE public.user_profiles   
   SET email = NEW.email   
   WHERE user_id = NEW.id;   
   RETURN NEW; 
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_email
AFTER
UPDATE OF email ON auth.users FOR EACH ROW
EXECUTE FUNCTION update_user_profiles_email ();
