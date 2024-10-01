/*
  Warnings:

  - You are about to drop the column `user_id` on the `Role` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `userRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_user_id_fkey`;

-- AlterTable
ALTER TABLE `Role` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `userRole` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `userRole` ADD CONSTRAINT `userRole_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
