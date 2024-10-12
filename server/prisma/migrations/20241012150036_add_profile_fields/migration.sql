-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "skills" TEXT,
ALTER COLUMN "username" DROP NOT NULL;
