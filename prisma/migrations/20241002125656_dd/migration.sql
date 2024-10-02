-- CreateTable
CREATE TABLE `sslcommerz_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` VARCHAR(255) NOT NULL,
    `store_passwd` VARCHAR(255) NOT NULL,
    `currency` VARCHAR(255) NOT NULL,
    `success_url` VARCHAR(255) NOT NULL,
    `fail_url` VARCHAR(255) NOT NULL,
    `cancel_url` VARCHAR(255) NOT NULL,
    `ipn_url` VARCHAR(255) NOT NULL,
    `init_url` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
