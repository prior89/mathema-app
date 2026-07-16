-- Persist Google's stable OpenID subject so sign-in never depends on a
-- potentially mutable or reassigned non-Gmail email address.
ALTER TABLE "User" ADD COLUMN "googleSubject" TEXT;

CREATE UNIQUE INDEX "User_googleSubject_key" ON "User"("googleSubject");
