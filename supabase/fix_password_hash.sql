-- password_hash no es necesaria en la tabla porque Supabase Auth
-- maneja las contraseñas. La hacemos nullable para no obligar a
-- insertarla desde el frontend.
ALTER TABLE usuarios ALTER COLUMN password_hash DROP NOT NULL;
