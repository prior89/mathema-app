-- Additive: extend CountryCode enum with AE (United Arab Emirates) and ID (Indonesia).
-- AE launches as an active market (CBSE/NCERT-aligned schools reuse Indian curriculum).
-- ID is wired for a later launch (Merdeka curriculum / PSE registration still pending).
-- ALTER TYPE ... ADD VALUE is non-destructive; existing rows are unaffected.
ALTER TYPE "CountryCode" ADD VALUE IF NOT EXISTS 'AE';
ALTER TYPE "CountryCode" ADD VALUE IF NOT EXISTS 'ID';
