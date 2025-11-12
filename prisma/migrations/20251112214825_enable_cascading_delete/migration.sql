-- DropForeignKey
ALTER TABLE `caserecord` DROP FOREIGN KEY `CaseRecord_prisonerId_fkey`;

-- DropForeignKey
ALTER TABLE `visitor` DROP FOREIGN KEY `Visitor_prisonerId_fkey`;

-- AddForeignKey
ALTER TABLE `CaseRecord` ADD CONSTRAINT `CaseRecord_prisonerId_fkey` FOREIGN KEY (`prisonerId`) REFERENCES `Prisoner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_prisonerId_fkey` FOREIGN KEY (`prisonerId`) REFERENCES `Prisoner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
