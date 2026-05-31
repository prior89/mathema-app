-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ErrorCode" ADD VALUE 'CONDITION_MISSING';
ALTER TYPE "ErrorCode" ADD VALUE 'DENOMINATOR_ERROR';
ALTER TYPE "ErrorCode" ADD VALUE 'GEOMETRY_PROPERTY_ERROR';
ALTER TYPE "ErrorCode" ADD VALUE 'RATIO_SCALE_ERROR';
ALTER TYPE "ErrorCode" ADD VALUE 'PROBABILITY_COUNTING_ERROR';
ALTER TYPE "ErrorCode" ADD VALUE 'STATISTICS_INTERPRETATION_ERROR';
ALTER TYPE "ErrorCode" ADD VALUE 'SLOPE_INTERCEPT_CONFUSION';
ALTER TYPE "ErrorCode" ADD VALUE 'CORRESPONDING_PART_ERROR';
ALTER TYPE "ErrorCode" ADD VALUE 'AREA_RATIO_ERROR';
ALTER TYPE "ErrorCode" ADD VALUE 'ADD_NUMERATOR_ONLY';
