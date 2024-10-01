/*
  Warnings:

  - Added the required column `remark` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `remark` ENUM('popular', 'new', 'top', 'special', 'trending', 'regular') NOT NULL;
