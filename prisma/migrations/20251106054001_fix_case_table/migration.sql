/*
  Warnings:

  - You are about to drop the `case` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `case` DROP FOREIGN KEY `Case_prisonerId_fkey`;

-- DropTable
DROP TABLE `case`;

-- CreateTable
CREATE TABLE `CaseRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `hearingDate` DATETIME(3) NOT NULL,
    `prisonerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CaseRecord` ADD CONSTRAINT `CaseRecord_prisonerId_fkey` FOREIGN KEY (`prisonerId`) REFERENCES `Prisoner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
