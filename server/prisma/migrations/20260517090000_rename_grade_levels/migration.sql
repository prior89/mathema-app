-- Rename GradeLevel enum values from Korean school grades to NCERT Class
-- labels (G_MIDDLE_1 -> CLASS_7 ... G_HIGH_3 -> CLASS_12). Mapping is 1:1 and
-- preserves every row of every column that references GradeLevel.
--
-- Postgres requires ALTER TYPE ... RENAME VALUE in its own statement (one per
-- value, no batching). The order is irrelevant — each rename is atomic.

ALTER TYPE "GradeLevel" RENAME VALUE 'G_MIDDLE_1' TO 'CLASS_7';
ALTER TYPE "GradeLevel" RENAME VALUE 'G_MIDDLE_2' TO 'CLASS_8';
ALTER TYPE "GradeLevel" RENAME VALUE 'G_MIDDLE_3' TO 'CLASS_9';
ALTER TYPE "GradeLevel" RENAME VALUE 'G_HIGH_1'   TO 'CLASS_10';
ALTER TYPE "GradeLevel" RENAME VALUE 'G_HIGH_2'   TO 'CLASS_11';
ALTER TYPE "GradeLevel" RENAME VALUE 'G_HIGH_3'   TO 'CLASS_12';
