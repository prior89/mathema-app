-- CreateEnum
CREATE TYPE "ExamFormat" AS ENUM ('NCERT_TEXTBOOK', 'CBSE_BOARD', 'JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'KSAT', 'KR_INTERNAL', 'KR_MOCK_EVAL');

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "examFormat" "ExamFormat";
