-- CreateTable
CREATE TABLE `accommodation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `address` TEXT NOT NULL,
    `subdistrict_id` INTEGER NOT NULL,
    `contact` LONGTEXT NOT NULL,
    `interest` TEXT NULL,
    `additional_services` TEXT NULL,
    `activites` TEXT NULL,
    `check_in` TEXT NULL,
    `check_out` TEXT NULL,
    `health` TEXT NULL,
    `date_info` LONGTEXT NULL,
    `service_fee` TEXT NULL,
    `images` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `location_id`(`location_id`),
    INDEX `subdistrict_id`(`subdistrict_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `description` TEXT NULL,
    `address` TEXT NOT NULL,
    `subdistrict_id` INTEGER NOT NULL,
    `contact` LONGTEXT NOT NULL,
    `interest` TEXT NULL,
    `product` TEXT NULL,
    `activites` TEXT NULL,
    `health` TEXT NULL,
    `date_info` LONGTEXT NULL,
    `service_fee` TEXT NULL,
    `images` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `location_id`(`location_id`),
    INDEX `subdistrict_id`(`subdistrict_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `booking_details` LONGTEXT NOT NULL,
    `booking_date` DATE NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `people` INTEGER NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_resources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `description` TEXT NULL,
    `address` TEXT NOT NULL,
    `subdistrict_id` INTEGER NOT NULL,
    `contact` LONGTEXT NOT NULL,
    `interest` TEXT NULL,
    `product` TEXT NULL,
    `activites` TEXT NULL,
    `health` TEXT NULL,
    `time_per_cycle` LONGTEXT NULL,
    `people_per_cycle` TEXT NULL,
    `cost` TEXT NULL,
    `pre_booking` TEXT NULL,
    `date_info` LONGTEXT NULL,
    `images` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `location_id`(`location_id`),
    INDEX `subdistrict_id`(`subdistrict_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `type` INTEGER NOT NULL,
    `map` LONGTEXT NULL,
    `note` TEXT NULL,
    `time_slots` LONGTEXT NULL,
    `owner_id` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `owner_id`(`owner_id`),
    INDEX `type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `payment_method` ENUM('PROMPTPAY', 'BANK_ACCOUNT_NUMBER') NULL,
    `payment_data` LONGTEXT NULL,
    `slip_image` VARCHAR(255) NULL,
    `status` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PENDING_VERIFICATION', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `transaction_id` VARCHAR(255) NULL,
    `payment_date` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `booking_id_2`(`booking_id`),
    INDEX `booking_id`(`booking_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `program_category` ENUM('SHORT', 'LONG') NOT NULL DEFAULT 'SHORT',
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `schedules` LONGTEXT NOT NULL,
    `total_price` DECIMAL(8, 2) NOT NULL,
    `wellness_dimensions` TEXT NULL,
    `images` LONGTEXT NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,
    `duration_days` INTEGER NULL,
    `status` ENUM('DRAFT', 'CONFIRMED', 'CANCELLED') NULL DEFAULT 'DRAFT',

    INDEX `created_by`(`created_by`),
    INDEX `type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `address` TEXT NOT NULL,
    `subdistrict_id` INTEGER NOT NULL,
    `contact` LONGTEXT NOT NULL,
    `Interesting_menu` TEXT NULL,
    `served_per_hour` INTEGER NULL,
    `health` TEXT NULL,
    `date_info` LONGTEXT NULL,
    `service_fee` TEXT NULL,
    `images` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `location_id`(`location_id`),
    INDEX `subdistrict_id`(`subdistrict_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slip_remaining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `count` INTEGER NOT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subdistricts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(150) NOT NULL,
    `lastname` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `tel` VARCHAR(20) NOT NULL,
    `profile_picture` VARCHAR(150) NULL DEFAULT 'default-profile.jpg',
    `role` ENUM('user', 'admin', 'hospital', 'restaurant', 'attractions', 'learning_resources', 'accommodation') NULL DEFAULT 'user',
    `usage_status` ENUM('OFFLINE', 'ONLINE') NULL DEFAULT 'OFFLINE',
    `status_last_update` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `account_status` ENUM('DELETE', 'ACTIVE', 'SUSPEND') NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('SYSTEM', 'CHAT', 'ORDER', 'PAYMENT', 'PROMOTION', 'ANNOUNCEMENT', 'STATUS_UPDATE', 'REMINDER') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `data` LONGTEXT NULL,
    `user_id` INTEGER NOT NULL,
    `status` ENUM('UNREAD', 'READ', 'ARCHIVED') NOT NULL DEFAULT 'UNREAD',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `idx_status`(`status`),
    INDEX `idx_type`(`type`),
    INDEX `idx_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `description` TEXT NULL,
    `address` TEXT NULL,
    `subdistrict_id` INTEGER NOT NULL,
    `contact` LONGTEXT NULL,
    `activites` TEXT NULL,
    `health` TEXT NULL,
    `date_info` LONGTEXT NULL,
    `coast` DECIMAL(8, 2) NULL,
    `images` LONGTEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT ('0000-00-00 00:00:00'),

    INDEX `location_id`(`location_id`),
    INDEX `subdistrict_id`(`subdistrict_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accommodation` ADD CONSTRAINT `accommodation_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accommodation` ADD CONSTRAINT `accommodation_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractions` ADD CONSTRAINT `attractions_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attractions` ADD CONSTRAINT `attractions_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_resources` ADD CONSTRAINT `learning_resources_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_resources` ADD CONSTRAINT `learning_resources_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`type`) REFERENCES `location_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `programs` ADD CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`type`) REFERENCES `program_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `programs` ADD CONSTRAINT `programs_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant` ADD CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant` ADD CONSTRAINT `restaurant_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hospital` ADD CONSTRAINT `hospital_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hospital` ADD CONSTRAINT `hospital_ibfk_2` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
