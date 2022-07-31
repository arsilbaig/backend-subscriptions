-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2022 at 06:09 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `plab`
--

-- --------------------------------------------------------

--
-- Table structure for table `authuser`
--

CREATE TABLE `authuser` (
  `authuser_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` int(11) NOT NULL,
  `otp_expiry` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authuser`
--

INSERT INTO `authuser` (`authuser_id`, `email`, `otp`, `otp_expiry`) VALUES
(3, 'raza4907404@gmail.com', 841100, '2022-07-30 15:23:59'),
(7, '+923224907404', 838867, '2022-07-30 16:21:25');

-- --------------------------------------------------------

--
-- Table structure for table `customer_subscriptions`
--

CREATE TABLE `customer_subscriptions` (
  `customer_subscription_id` int(11) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'marchant', '2022-07-30 11:13:36', '2022-07-30 11:13:36'),
(2, 'customer', '2022-07-30 11:13:36', '2022-07-30 11:13:36');

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `subscription_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sub_name` varchar(255) NOT NULL,
  `withdraw_amount` decimal(15,2) NOT NULL,
  `frequency` varchar(20) NOT NULL,
  `image` longtext NOT NULL,
  `description` text NOT NULL,
  `terms` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`subscription_id`, `user_id`, `sub_name`, `withdraw_amount`, `frequency`, `image`, `description`, `terms`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Custom Monthly NFTees', '2.00', 'Once Per month', 'test.png', 'In publishing and graphic design', 'In publishing and graphic design', 0, '2022-07-30 18:15:32', '2022-07-30 18:15:32'),
(2, 2, 'Custom Monthly NFTees', '2.00', 'Once Per month', 'test.png', 'In publishing and graphic design', 'In publishing and graphic design', 0, '2022-07-30 19:25:44', '2022-07-30 19:25:44'),
(3, 2, 'Custom Monthly NFTees', '2.00', 'Once Per month', 'test.png', 'In publishing and graphic design', 'In publishing and graphic design', 0, '2022-07-31 01:03:04', '2022-07-31 01:03:04');

-- --------------------------------------------------------

--
-- Table structure for table `subscription_order`
--

CREATE TABLE `subscription_order` (
  `subscription_order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subscription_order`
--

INSERT INTO `subscription_order` (`subscription_order_id`, `user_id`, `subscription_id`, `amount`, `expiry_date`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 2, 1, '20.00', '2022-07-30 21:47:37', 0, '2022-07-30 21:47:37', '2022-07-30 21:47:37'),
(2, 1, 1, '0.00', '2022-07-30 22:32:06', 0, '2022-07-30 22:32:06', '2022-07-30 22:32:06'),
(3, 2, 1, '0.00', '2022-07-30 22:32:06', 0, '2022-07-30 22:32:06', '2022-07-30 22:32:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `account_id` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `business_email` varchar(255) DEFAULT NULL,
  `image_url` longtext NOT NULL,
  `business_website_url` varchar(255) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `account_id`, `email`, `business_email`, `image_url`, `business_website_url`, `country_code`, `phone`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Raza', 'Umer', 'raza.testplab', '', 'test@test.tv', 'test tets t', 'test test ', '+92', '3224907404', 0, '2022-07-30 11:18:36', '2022-07-30 11:18:36'),
(2, 'Adnan', 'Younus', 'adnan.testplab', 'adnanyounus1@gmail.com', 'test@test12.tv', 'test tets t', 'test test ', '', '', 0, '2022-07-30 14:28:47', '2022-07-30 14:28:47');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`roleId`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2022-07-30 11:18:38', '2022-07-30 11:18:38'),
(1, 2, '2022-07-30 14:28:48', '2022-07-30 14:28:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authuser`
--
ALTER TABLE `authuser`
  ADD PRIMARY KEY (`authuser_id`);

--
-- Indexes for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  ADD PRIMARY KEY (`customer_subscription_id`),
  ADD KEY `customer_subscription_id` (`customer_subscription_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `user_id_2` (`subscription_id`) USING BTREE;

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`subscription_id`),
  ADD KEY `user_subscription_ibfk_1` (`user_id`);

--
-- Indexes for table `subscription_order`
--
ALTER TABLE `subscription_order`
  ADD PRIMARY KEY (`subscription_order_id`),
  ADD KEY `user_subscription_order_ibfk_2` (`user_id`),
  ADD KEY `subscription_order_ibfk_2` (`subscription_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`roleId`,`userId`),
  ADD UNIQUE KEY `user_roles_userId_roleId_unique` (`roleId`,`userId`),
  ADD KEY `user_roles_ibfk_2` (`userId`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `authuser`
--
ALTER TABLE `authuser`
  MODIFY `authuser_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  MODIFY `customer_subscription_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `subscription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subscription_order`
--
ALTER TABLE `subscription_order`
  MODIFY `subscription_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  ADD CONSTRAINT `customer_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `customer_subscriptions_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`);

--
-- Constraints for table `subscription`
--
ALTER TABLE `subscription`
  ADD CONSTRAINT `user_subscription_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subscription_order`
--
ALTER TABLE `subscription_order`
  ADD CONSTRAINT `subscription_order_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_subscription_order_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
