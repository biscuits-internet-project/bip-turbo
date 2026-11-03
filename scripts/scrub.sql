CREATE OR REPLACE FUNCTION scrub_test_identity(prefix TEXT)
RETURNS TABLE (email TEXT, first_name TEXT, last_name TEXT) AS $$
BEGIN
    email := prefix || replace(gen_random_uuid()::text, '-', '') || '@bip-localhost-test.com';
    first_name := substring(replace(gen_random_uuid()::text, '-', ''), 1, 6);
    last_name := substring(replace(gen_random_uuid()::text, '-', ''), 1, 6);
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE scrub_auth_user(old_email TEXT, new_email TEXT, fn TEXT, ln TEXT)
AS $$
BEGIN
    UPDATE auth.users
    SET email = new_email,
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) ||
                             jsonb_build_object(
                                 'name', fn,
                                 'full_name', fn || ' ' || ln,
                                 'first_name', fn,
                                 'last_name', ln,
                                 'email', new_email
                             )
    WHERE email = old_email;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE scrub_public_user(old_email TEXT, new_email TEXT, fn TEXT, ln TEXT)
AS $$
BEGIN
    UPDATE public.users
    SET email = new_email,
        first_name = fn,
        last_name = ln
    WHERE email = old_email;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE scrub_auth_audit_actor(old_email TEXT, new_email TEXT)
AS $$
BEGIN
    UPDATE auth.audit_log_entries
    SET payload = (COALESCE(payload::jsonb, '{}'::jsonb) ||
                   jsonb_build_object(
                       'actor_username', new_email
                   )
    )::json
    WHERE payload ->> 'actor_username' = old_email;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE scrub_auth_audit_traits(old_email TEXT, new_email TEXT)
AS $$
BEGIN
    UPDATE auth.audit_log_entries
    SET payload = (COALESCE(payload::jsonb, '{}'::jsonb) ||
                   jsonb_build_object(
                        'traits', jsonb_build_object(
                           'user_email', new_email
                       )
                   )
    )::json
    WHERE payload -> 'traits' ->> 'user_email' = old_email;
END;
$$ LANGUAGE plpgsql;

-- Sanity check before scrub
SELECT (SELECT COUNT(*)
        FROM auth.users
        WHERE email NOT LIKE '%@bip-localhost-test.com') +
       (SELECT COUNT(*)
        FROM public.users
        WHERE email NOT LIKE '%@bip-localhost-test.com') +
       (SELECT count(*)
        FROM auth.audit_log_entries, json_each_text(payload -> 'traits')
        WHERE value LIKE '%@%.com'
        AND value NOT LIKE '%@bip-localhost-test.com') +
       (SELECT count(*)
        FROM auth.audit_log_entries, json_each_text(payload)
        WHERE key != 'traits'
        AND value LIKE '%@%.com'
        AND value NOT LIKE '%@bip-localhost-test.com')
AS before_non_test_email_count;


DO $BODY$
DECLARE
    email_record RECORD;
    new_test_email TEXT;
    random_first_name TEXT;
    random_last_name TEXT;
BEGIN
    -- Case 1: Emails present in both public.users and auth.users
    FOR email_record IN
        SELECT DISTINCT au.email as original_email
        FROM auth.users au
        INNER JOIN public.users pu ON au.email = pu.email
    LOOP
        SELECT *
        INTO new_test_email, random_first_name, random_last_name
        FROM scrub_test_identity('test-joined');

        CALL scrub_auth_user(email_record.original_email, new_test_email, random_first_name, random_last_name);
        CALL scrub_public_user(email_record.original_email, new_test_email, random_first_name, random_last_name);
        CALL scrub_auth_audit_actor(email_record.original_email, new_test_email);
        CALL scrub_auth_audit_traits(email_record.original_email, new_test_email);
    END LOOP;

    -- Case 2: Email present only in auth.users
    FOR email_record IN
        SELECT DISTINCT au.email as original_email
        FROM auth.users au
        WHERE au.email NOT LIKE '%@bip-localhost-test.com'
    LOOP
        SELECT *
        INTO new_test_email, random_first_name, random_last_name
        FROM scrub_test_identity('test-au-only');

        CALL scrub_auth_user(email_record.original_email, new_test_email, random_first_name, random_last_name);
        CALL scrub_auth_audit_actor(email_record.original_email, new_test_email);
        CALL scrub_auth_audit_traits(email_record.original_email, new_test_email);
    END LOOP;

    -- Case 3: Email present only in public.users
    FOR email_record IN
        SELECT DISTINCT pu.email as original_email
        FROM public.users pu
        WHERE pu.email NOT LIKE '%@bip-localhost-test.com'
    LOOP
        SELECT *
        INTO new_test_email, random_first_name, random_last_name
        FROM scrub_test_identity('test-pu-only');

        CALL scrub_public_user(email_record.original_email, new_test_email, random_first_name, random_last_name);
        CALL scrub_auth_audit_actor(email_record.original_email, new_test_email);
        CALL scrub_auth_audit_traits(email_record.original_email, new_test_email);
    END LOOP;

    -- Case 4: Orphaned payload.actor_username auth.audit_log_entries
    FOR email_record IN
        SELECT DISTINCT aa.payload ->> 'actor_username' as original_email
        FROM auth.audit_log_entries aa
        WHERE aa.payload ->> 'actor_username' LIKE '%@%.com'
        AND aa.payload ->> 'actor_username' NOT LIKE '%@bip-localhost-test.com'
    LOOP
        SELECT *
        INTO new_test_email
        FROM scrub_test_identity('test-auth-audit-actor');

        CALL scrub_auth_audit_actor(email_record.original_email, new_test_email);
    END LOOP;

    -- Case 5: Orphaned payload.traits.user_email auth.audit_log_entries
    FOR email_record IN
        SELECT DISTINCT aa.payload -> 'traits' ->> 'user_email' as original_email
        FROM auth.audit_log_entries aa
        WHERE aa.payload -> 'traits' ->> 'user_email' LIKE '%@%.com'
        AND aa.payload -> 'traits' ->> 'user_email' NOT LIKE '%@bip-localhost-test.com'
    LOOP
        SELECT *
        INTO new_test_email
        FROM scrub_test_identity('test-auth-audit-trait');

        CALL scrub_auth_audit_traits(email_record.original_email, new_test_email);
    END LOOP;
END $BODY$;


-- Sanity check after scrub
SELECT (SELECT COUNT(*)
        FROM auth.users
        WHERE email NOT LIKE '%@bip-localhost-test.com') +
       (SELECT COUNT(*)
        FROM public.users
        WHERE email NOT LIKE '%@bip-localhost-test.com') +
       (SELECT count(*)
        FROM auth.audit_log_entries, json_each_text(payload -> 'traits')
        WHERE value LIKE '%@%.com'
        AND value NOT LIKE '%@bip-localhost-test.com') +
       (SELECT count(*)
        FROM auth.audit_log_entries, json_each_text(payload)
        WHERE key != 'traits'
        AND value LIKE '%@%.com'
        AND value NOT LIKE '%@bip-localhost-test.com')
AS after_non_test_email_count;


DROP FUNCTION scrub_test_identity(TEXT);
DROP PROCEDURE scrub_auth_user(TEXT, TEXT, TEXT, TEXT);
DROP PROCEDURE scrub_public_user(TEXT, TEXT, TEXT, TEXT);
DROP PROCEDURE scrub_auth_audit_actor(TEXT, TEXT);
DROP PROCEDURE scrub_auth_audit_traits(TEXT, TEXT);