/*
  Warnings:

  - You are about to drop the column `studentId` on the `project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_studentId_fkey`;

-- DropIndex
DROP INDEX `Project_studentId_fkey` ON `project`;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `studentId`;

-- CreateTable
CREATE TABLE `ProjectStudent` (
    `projectId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `role` VARCHAR(191) NULL,

    PRIMARY KEY (`projectId`, `studentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectStudent` ADD CONSTRAINT `ProjectStudent_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStudent` ADD CONSTRAINT `ProjectStudent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
