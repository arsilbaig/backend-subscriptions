-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 19, 2022 at 03:54 PM
-- Server version: 8.0.18
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
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
(4, 'razatest@test.com', 376345, '2022-08-19 15:03:22');

-- --------------------------------------------------------

--
-- Table structure for table `card_detail`
--

CREATE TABLE `card_detail` (
  `card_detail_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_name` varchar(100) NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `expiry_date` varchar(10) NOT NULL,
  `cvc` int(3) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `isActive` int(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `card_detail`
--

INSERT INTO `card_detail` (`card_detail_id`, `user_id`, `card_name`, `card_number`, `expiry_date`, `cvc`, `zip_code`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Raza Umer', '4111111111111116', '042004', 123, '54000', 0, '2022-08-18 11:30:55', '2022-08-18 11:30:55'),
(2, 1, 'Arsil', '5321982787653456', '042005', 123, '54000', 0, '2022-08-18 19:47:42', '2022-08-18 19:47:42');

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `currency_id` int(11) NOT NULL,
  `cur_name` varchar(100) NOT NULL,
  `cur_image` longtext NOT NULL,
  `cur_code` varchar(5) NOT NULL,
  `cur_price` decimal(15,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`currency_id`, `cur_name`, `cur_image`, `cur_code`, `cur_price`, `createdAt`, `updatedAt`) VALUES
(1, 'Etherium', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMYSURBVHgBtVc7UNtAEN07fxLZZoYSqjgz0Jv0BNFBqhTBKcFOHUMZ0+CKtMSkjQJlLDJJFUpM3EeipgipQgczluQ00mX3DIoVDNzxeTMaSXene3e773ZXDBTR6/VmwlCUGANTCChhU3Gg28XrFK+v2Wy6nc1mD1TmZNcNOCNt4KMJ6sDFsI1CwdiGm5CfnJwUM5kHHzVJ/8dRKsVMwzB+Devkwxpxt4vpdNa5JTGhGIaRGwTBMqiQ+35vDc28xRgbhTsBG40i2PB9f+1Cz+ALrZAGwj0BXbCELoh1EO+cfHwmLGV0Ot91hgO6YANd+ugCOYprT8fUu7vfYHW1Do7jgDrYKLk0Qe55vUVIntsr4XldsCxLPlvWB9CEScc3JgcQK6CBVqsFx8e/5bPrOvj+SedzOHcv8zwPoxVXth2RLiy8SLQVCgWw7R28j6hOQ+IzOWIGNNBsvrvQhhuI3aAKIUSJRxF7rvoBiazT6Qzts+2WlvgwP5joc6GkcDL3dbvTER8lJxJcSWXw4eFhLLLLQOKjcYooctWR09NPUdU7MDY2NrS/VJqS/ZOTk6AKZXLH+QGYy9G3n6FeX40XQfdmcxM2N9+jZY6h2+2qTklHLfgJigGmXn8D4+PjUC6XyWcyvM7PP8Nk1Fc7LaRafQVqEC7z/eALTqSkeIpslcoSrRlJqpKYRGbbNp7xvLSKBtpMN5OR+Wu114k2CjKWtSWtogrOYYUzlnFBA1NTTzDClRNtlUpVi5gQRdE+N4zMPpqxrfNhrbYMExN9Vc/NzaMGXoIehIvWcqXaU6l0AzSxvv4WFzChIbB/SKW4dHNcyWBa3cMVmaABEqBOMpGEDI7y+dzjBDnmWCr2HEr4cG8Qp0iMtT+T1WwcZLC2wjKXa+V1XXDOGufECfKzBWxjZwPuAYyJRi6XS+TjoT8NQfAHz37YuBsXiFOy6GDVeiU5gTQQRWIPo18RbgzWzucfLg2aehCXJhbSAKmSam3o/whqkQrBZvFfbfYyYjkKFEG1HpVc/cpHFiCDdcARHiEXr3YYsoOREaOtMudfejREgDGyL0kAAAAASUVORK5CYII=', 'ETH', '250.00', '2022-08-15 00:00:00', '2022-08-15 00:00:00'),
(2, 'Bitcoin', ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOlSURBVHgBtVddTttAEJ5Zr6U+pgKqqgLqnAA4AekJyA2gJwDeKTiUPhdO0PQG4QQNJwBOgCGorZRWTZ9j73RmExsnxPG6pZ/kxN5d7zf/O0ZwxE1Yq/na3zLGNJBwHRADHq6NpwdAFBHSFRF0DSXn9XAwcNkXyxYwceApvYuAOznCUhCYtlZJ+OpgcAt/I4Bo7IE+QoV78A8gQ6cJxK0ii2ABeeAr/wsBBPAEYLdE2hs2ZllDTQ/cH79Ye0pyASIEceJ3Ze9Hc/mHp9Z8GrMsoXLktcrkCHuA9IYj7gokE0ZX8fKxJYTrkQAScNU1p+uVdz+6LEhAQO2Vw/5zVrMLJUII14QAYnqnaBdtR1fIV0fI7z/U1nmmxhufjwgwKN2Gub6e1F7LvZYfX3mifSk8jG/G/uumY8Phs4H2kr04ia9EEVcrxkaLwvso/tDK/wWOkAKzevjzbdH8/cnSNhgIywWhQWziuvK1twVVQKqRf7w7Xvh021rYTk26fND/vHzYr3N6tedvhDXhVixtAyoAud6n9+J/BLWjULUT40ciSDo3NMN9KMkKY1RDEal1qABD2MkeyJsoLApUFsi29NKDsLOABOtKUggqCQDXGT95wcSkos4kA85XDinA3vGSSwKMCSFaPerXp8cl+uWftY7SsV5raZeVOy3bU0MF5P0vpAq9Td9LupyaUX5d7/3iEadL6LClLUROjYMg73+O4M00+Hqtxcu71kKWTVwTzsbluQQ0ULwwAkdM+h+b2QT7GlF10hpvAxCpvLISRopL6FxJxe+x8epSguthP1tr27IpaE9nY+jFv6GUH660AbjgorFTuAggrIffI76N0jGrqWIfEzWloMCoVWvbgyl70VuDMgG4f0xL8Q0U9HtiAQk+Q9QZB9wtOICz4JKzYG4axmb4XIm/5CgtWoS2TmDTBhz51u/3Jwvb+aDLQxS6Cxc/lpGzZdvCbdMwMfqMO1iH5pNsEJJRpxwEbb49FzIUMkyzCRvg0D1rpUP5t/2A+JitUFo05DiePv+V4mxAIZWssJlRSi5crw6+WVdmhSgxcYtbsua8Y1RyPnswuNY7XqSqXZTEVEJxK32eakpfclOa/OemVDdS7QUTbfko3bCJ4F6cqpBz0WnmyQUFHyZPa4lZmqdQs14QS3BDseESmKXkvEdCw41Z5AKHj1NrDWlad8AdtrZwgTstInYW4EGQ0ee5tHAkeU/WPQ+f5wgRjU7Ai8QMO66f538AjazE4Mo3yd0AAAAASUVORK5CYII=', 'BTC', '500.00', '2022-08-15 00:00:00', '2022-08-15 00:00:00'),
(3, 'PrimeLab', ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAVCAYAAABR915hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUrSURBVHgBbVZLjxRVFP7urUf3wMwAoQdUxiECE00clLAxRoW4wESUrQv9CyZGjQsX7t25Mm6NbJQNGuOCaFCjK4KJCcoA8jJKYGYcnWe/quoev3Nudc+MUp1Tt7rq1v3O953HLff+iXXB4HAC7zj4gCShpQFpUiLLCqR5Dzmt0VBro9noIG+2ed2hdflMrY+cc7Okx3f5XlIh8SUSF+ChJnBQDEGK+x7OpoBn4WBm94DKzKF0jgs5Lppw5JXjUlJxTkDwmS2s8xO+m7rK5niJ4GpbgRWB3ilzp7h2whA8OPrNexXH0ikYQWnwKZ8rYEXjPC5c6XzvkaCPklDKOkG0/wObjzVT+8W/xpaAwSyCGiBZEoIgmQGVdLikhwVfyzinkJJsPUEoN9mmA3Aqk4obiBvPj5+gj+2AmxcLAw68p8R1VKYUVwXkswSVV8AAFVjB9k3tI/kSS/duE6RPS8AZHFOCV8gkxjvlu2mNGLny+uTbDSzPBdz4qahZqvIRNBhzCuV0mZSMKBlZJhpv3j/01FGuIfj+y7tQqNQxwZhcGWozB8rojAH6iDxgb/I6F+OqiePJklJFpmIsnctVC/tZ4tTRc3y26kYoZwTLpTDGuTLW/1Qh55iK1c9Q603RjvG0eIuLMeX1E8fHcPDJJsZ3Z1hZ7mF29i/MXp/XQERneTU9M4PpAw+h6PexsLiAa1cuoVd2DFCtwcAQuE7m/5STSaw/ZmblxDL16ZfG8cypMfS6gk63wr79o2buhxwXZucsFDu2j+DIzCHML62jmTcxfXAardYEzn13fghaWIwz1bXO4I1WYhkcy0pd0rgKxlo5bv9W4MzpRXT4+tgeh7den8TRIxP49spKXfvAR+euYHF1hc2jwGvHZjDV2on9Bx7D1Vs30ZQ+Co11sHXdFsZWt4lXPAPUMXD44pN1ZOPAo0e3Ye/DHjt2J3E+X2hLg3Mcrs+1cX2JCZcwzozqjzcW8GprByYm9uDirbus6pTGs2Qb1buFsY+AkUVsHMdONvH8qaY971DuxeUK7Z5YbNsUcpCMa2jyXFkG3+lESkmaYwUjaDitBjKWNLZCA98MrIy1iylbvrt3yhvoP38HfHqmi6t/MlYNwYfv7SQ40CVjYcI08wQdXmuyJQTZNhIdXSuBVQIr4yh17oZMg2yUk8bPac0qa9r4RPT8l0sVrt0IBPV48Vg+rABdUJlP7cpweHIUF+51MZYFvHK4ZXMu3utgzUXgUphcVd3NnduQemfL4c0PGth8XP65QqcteO54hgcmPUa2OUw+6E1q9bQbUs1RO955dhzz7VFsZ+Kq/brYx9d/FAxGk1Kz41FGxrjeCGqpz39VbYl1ne+4c0dw9myJEy+n2LXb4/e7Aae/KXgNNEY1J1J8frnEatAwCV54JKW8FW6uVPjs2hqLJzfASryN7t03ChkqbMEWzRAM6kvqLNdarih5SYX6TMiCIepTlB7V1rHM9R7nZax5jqI9MQnWyTwd0TaZaQvlBmENJKQb3UNClE0dEDqgPTpILCltDiGBbXva7SrEpLN+bntUvBebTdwabWHdyXSP1u1UGRNc10olH2o62PENFDWoHpVEEGWspuC6wwcXrwMdUWesnCR+KFQiw6SxTcZKMsQtVjTGyeYYS0wQ2ch0sa7m7L6wti3LFdQPPhBcvakM+nsElforptbQvkwGG5G+k1K+jyOEt4cSdRp6G+o4UCyTEj6WWGD82BMRNxlC+Lq/O22EzpQZfkj4qAJsL9c9PeBffzZ02cU8inMAAAAASUVORK5CYII=', 'LAB', '100.00', '2022-08-15 00:00:00', '2022-08-15 00:00:00'),
(4, 'LiteCoin', ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALCSURBVHgBtVdNchJREO7uYSBulNxg3FllxZATZNByTapcWbggJ9CcQDxB4glgkYou4wGEyQmCblw63oByCeF1uoefkOExvOHn2zD069fdr3/fQ3BEELbKT71SDdmEwFABxEDI5clyH5hjQOixgeg/DH/E0WnfRS6uYngRtoIi+R8RsDGn0AHcHgA2/3Tq/2AdA5ITg/8ZCT/BBmDgCzLDL70lHrEaoKcuYbErqwFsAwzxACG0eYPShJfV74dbVa4QWUWGSGUvLs1h6ydPw+KJmQEa82dYvN2Z8jkjkAdH05yYhUATbufKFaLDkOia/YWJ66n411UGwV5w23n3KKEO31x2gTF0lTEQp2soEg+U5ixaCWk2aeUVCV8e5QofOClvSjaPm4wbGHpp0sgvHUJOiOsbqpsM+LU8Gw151wvCRuYEcgPLxvNrhARhnm0F4y94AFFmwxpACRtJ7Nw3W+KfYCzDafik5FUoV+lZ4q/41anvQ65BNZXHAeXZyIiRjX7w9uoY1gKWyZ0XI49LUZp8UL06phGvPTELMI5dphd0pP7+WT+zrRFyBGuD+6S9eSUbFSIbfX3XT4AYaxL2VvLdjSrWUTriEDaBJHXBANxIIjSy+KRXNIvgt9N0z/MjHg1Pl0gvM+A5ZOmXvEJthzweRFl5EEupPYcc0PBIckZZPGgG+6RzWZKsDdmIICccwtNW3UkZkvG+ZnEuq/9MAzDbABnpzYRvSnj1+vJcrt4b3YBdkZR158PZ2JCpRXJ1lp8Ydo94omusd/qh8UBD1R0bIXW/F86/ER614l70Pr5j72RHRsQkstPT1PowqYTfAibTlc8AtqVcTm4b5dZhpJ6QGj3SZIENoTJUlvUeAQ6P04k39NLaAHckvcWDJxfLFDsb8GBIS+5w+jyX+tYrGCfheXieo+SN9HYReANmcN1zfJ7fA/SkFGKRlvrGAAAAAElFTkSuQmCC', 'LTC', '150.00', '2022-08-15 00:00:00', '2022-08-15 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `customer_subscriptions`
--

CREATE TABLE `customer_subscriptions` (
  `customer_subscription_id` int(11) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `isActive` int(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customer_subscriptions`
--

INSERT INTO `customer_subscriptions` (`customer_subscription_id`, `subscription_id`, `user_id`, `quantity`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 0, '2022-08-18 19:48:49', '2022-08-18 19:48:49'),
(3, 1, 1, 1, 1, '2022-08-19 13:37:00', '2022-08-19 13:37:00');

-- --------------------------------------------------------

--
-- Table structure for table `payment_transactions`
--

CREATE TABLE `payment_transactions` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `card_detail_id` int(11) NOT NULL,
  `amount` int(15) NOT NULL,
  `currency_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payment_transactions`
--

INSERT INTO `payment_transactions` (`payment_id`, `user_id`, `subscription_id`, `card_detail_id`, `amount`, `currency_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2, 323, 4, '2022-08-18 19:48:49', '2022-08-18 19:48:49'),
(2, 1, 1, 1, 24, 1, '2022-08-19 13:37:00', '2022-08-19 13:37:00');

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
(1, 'merchant', '2022-07-30 11:13:36', '2022-07-30 11:13:36'),
(2, 'customer', '2022-07-30 11:13:36', '2022-07-30 11:13:36');

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `subscription_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sub_name` varchar(255) NOT NULL,
  `withdraw_amount` int(15) NOT NULL,
  `frequency` varchar(20) NOT NULL,
  `image` longtext NOT NULL,
  `description` text NOT NULL,
  `terms` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `isActive` int(1) DEFAULT '0',
  `isEnded` int(1) NOT NULL,
  `isDeleted` int(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`subscription_id`, `user_id`, `sub_name`, `withdraw_amount`, `frequency`, `image`, `description`, `terms`, `status`, `isActive`, `isEnded`, `isDeleted`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'first subs', 323, '1/Year', 'data:image/jpeg;base64,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', 'sgjksdsks', 'klhdhsdlks ', 1, 0, 0, 0, '2022-08-18 11:29:25', '2022-08-19 15:21:56');

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
  `isMerchant` int(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `account_id`, `email`, `business_email`, `image_url`, `business_website_url`, `country_code`, `phone`, `status`, `isMerchant`, `createdAt`, `updatedAt`) VALUES
(1, 'Raza Test', '', 'razatest.Web3', 'razatest@test.com', '', 'data:image/jpeg;base64,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', 'http://localhost.com', '+', '', 1, 1, '2022-08-18 11:24:14', '2022-08-18 11:26:03');

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
(2, 1, '2022-08-18 11:24:14', '2022-08-18 11:29:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authuser`
--
ALTER TABLE `authuser`
  ADD PRIMARY KEY (`authuser_id`);

--
-- Indexes for table `card_detail`
--
ALTER TABLE `card_detail`
  ADD PRIMARY KEY (`card_detail_id`),
  ADD KEY `user_card_ibfk_1` (`user_id`);

--
-- Indexes for table `currency`
--
ALTER TABLE `currency`
  ADD PRIMARY KEY (`currency_id`);

--
-- Indexes for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  ADD PRIMARY KEY (`customer_subscription_id`),
  ADD KEY `customer_subscription_id` (`customer_subscription_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `user_id_2` (`subscription_id`) USING BTREE;

--
-- Indexes for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `payment_card_ibfk_1` (`card_detail_id`),
  ADD KEY `payment_subscription_ibfk_1` (`subscription_id`),
  ADD KEY `payment_user_ibfk_1` (`user_id`),
  ADD KEY `payment_currency_ibfk_1` (`currency_id`);

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
  MODIFY `authuser_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `card_detail`
--
ALTER TABLE `card_detail`
  MODIFY `card_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `currency`
--
ALTER TABLE `currency`
  MODIFY `currency_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  MODIFY `customer_subscription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `subscription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subscription_order`
--
ALTER TABLE `subscription_order`
  MODIFY `subscription_order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `card_detail`
--
ALTER TABLE `card_detail`
  ADD CONSTRAINT `user_card_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer_subscriptions`
--
ALTER TABLE `customer_subscriptions`
  ADD CONSTRAINT `customer_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `customer_subscriptions_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`);

--
-- Constraints for table `payment_transactions`
--
ALTER TABLE `payment_transactions`
  ADD CONSTRAINT `payment_card_ibfk_1` FOREIGN KEY (`card_detail_id`) REFERENCES `card_detail` (`card_detail_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_currency_ibfk_1` FOREIGN KEY (`currency_id`) REFERENCES `currency` (`currency_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_subscription_ibfk_1` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`subscription_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
