-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- 생성 시간: 17-08-09 08:00
-- 서버 버전: 5.6.36
-- PHP 버전: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `crytomanager`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `balance`
--

CREATE TABLE `balance` (
  `exchng_id` varchar(20) NOT NULL,
  `crnc_code` varchar(10) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `balance_amt` decimal(20,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='가상화폐 잔고';

--
-- 테이블의 덤프 데이터 `balance`
--

INSERT INTO `balance` (`exchng_id`, `crnc_code`, `user_id`, `balance_amt`) VALUES
('BITH', 'ETH', 'wysong', '0.70000000');

-- --------------------------------------------------------

--
-- 테이블 구조 `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('CXAXopO76xSUKWw7FrxVkhEhehFI1RAK', 1502292022, '{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2017-08-09T15:08:48.274Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"local:wysong\"}}'),
('lFskygFZf31poo33R5RWbCWMLdht8vKe', 1502292373, '{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2017-08-09T15:24:55.025Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"local:wysong\"}}');

-- --------------------------------------------------------

--
-- 테이블 구조 `trade_info`
--

CREATE TABLE `trade_info` (
  `deal_dt` date NOT NULL,
  `deal_no` int(11) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `exchng_id` varchar(20) NOT NULL,
  `deal_tp` varchar(1) NOT NULL,
  `crnc_code` varchar(10) NOT NULL,
  `key_crnc_code` varchar(10) NOT NULL,
  `qry` decimal(20,8) NOT NULL,
  `unit_prc` decimal(20,8) NOT NULL,
  `deal_amt` decimal(20,8) NOT NULL,
  `cmsn_amt` decimal(20,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='거래정보';

--
-- 테이블의 덤프 데이터 `trade_info`
--

INSERT INTO `trade_info` (`deal_dt`, `deal_no`, `user_id`, `exchng_id`, `deal_tp`, `crnc_code`, `key_crnc_code`, `qry`, `unit_prc`, `deal_amt`, `cmsn_amt`) VALUES
('2017-06-25', 1, 'wysong', 'PLNX', '1', 'BURST', 'BTC', '1.00000000', '0.00000000', '1.00000000', '0.00000000'),
('2017-06-25', 2, 'wysong', 'PLNX', '1', 'WAVE', 'BTC', '1.00000000', '0.00000000', '1.00000000', '0.00000000'),
('2017-06-25', 3, 'wysong', 'PLNX', '1', 'ETH', 'BTC', '4000.21000000', '0.00000793', '1.39356500', '0.00000500'),
('2017-08-09', 1, 'wysong', 'BITH', '1', 'ETH', 'KRW', '1.50000000', '350000.00000000', '525000.00000000', '800.00000000'),
('2017-08-09', 2, 'wysong', 'BITH', '2', 'ETH', 'KRW', '0.80000000', '360000.00000000', '288000.00000000', '800.00000000');

-- --------------------------------------------------------

--
-- 테이블 구조 `user`
--

CREATE TABLE `user` (
  `id` varchar(20) NOT NULL COMMENT '유저ID',
  `auth_id` varchar(20) NOT NULL COMMENT '인증ID',
  `password` varchar(255) NOT NULL COMMENT '비밀번호',
  `salt` varchar(255) NOT NULL COMMENT '솔트',
  `displayName` varchar(50) DEFAULT NULL COMMENT '닉네임'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `user`
--

INSERT INTO `user` (`id`, `auth_id`, `password`, `salt`, `displayName`) VALUES
('kkk', 'local:kkk', 'QyNM2Bv8sv+/EfDjDj7LoEC12wA2IhjNivozDrPWc/xqfxz+2JIoOYE00ET1vFMYSQiHFMneb82zTFzZQRDfkFv7z0nUXcVFrdrhRsKu7+KjcOIkazTdfXmdmf4X17VwG8VjS+9iWFHVZctJuXfNSlh8PnjEzr+lqy15UZ3KhIA=', 'BH4NeetAXFNcY70okd6RSkqEOGfNYxFgJt7TuE36Fv12DTkp5D8bIFWLtz4jXuzSiR2mPOaRUvIrIsgmK0LNBg==', 'kkkkk'),
('love', 'local:love', 'z7i69JylI+dII7+GCHe0F8iO79oVgFgilr0RCyPuoJLehFaYxD2qX1gRSYharue2wn9lzD2xxHkIrk43P3wMGmLpOJ6vP151+PgAzTdxZzwoSFM3n5jJYmxpBj/Q61mobW2rqGoVGoPDF3VKC9f03/CIRP66tYNjUuG8oA7065w=', 'Diow2BbvJHwm4HfZ1u/ES/XuAfCwZVp1RZewrRnCtmMfbJKxc+jO5oCxbrIKQKcH99U7tDtNCL7UU4VB6cuJow==', 'loveyourself'),
('song', 'local:song', 'RT1oPpUuPqZJq/I8AzWw+UYZN3arqMUzwA429kF/u37WxZOnoe9Z3x37ZquUrXgOCINXhQTjn8Ye6e/+HPO/U1/En++8RW+TpLLpWkiluaKq57qF3my2+bHb5/Nxh5WD3mIMNZMEk5UK8zHka/ChPPknBnsERc9wWIpWdXQ+NDg=', 'MriuN3M8tA9eWiaHoyS/vMUqCy2wB3f/6eRbf3fGCxbi5EmXqRJb/MYBuQmlhDWMFpNRJl/lJM0A0R8PkVefQA==', 'songki'),
('test', 'local:test', 'dG38AIDbKxWcxdDMPDWpRfC5z98hcyFAByd3zgv2fDTaSBNuIBWnTge3Pvijt+1cmZnVjZjinKzl1KNzq+QpPvGcDcbuKS3rTosbud0rsKr/upoJLLGya+8PV3/GJUlmaR6XEK/Lh1FnX8WrsYsKQUCH++NGeX8+YDQAkWygczM=', 'P6ETq7ODWYv1h9OqcpimYuKfJNTACoH5bWHMUR/tW6NxgJ4C6sCuchuiemMKlY0AQZ0pv5oZedEETWSJ0zimvA==', '1234'),
('wysong', 'local:wysong', '1WpgI9jOTLWALcOyGLjij2fJA0E5TFwQinx8+u4m8k8y7hNa05HdP7TjNb40NWCeQzPwQqrfGSzsdRi+rW0TGTt4r4DqbnH8vQflkj1E2Kl4MsM23V8tb9xOSjYREiGdfEYy/b25R7Uz6qCKIi0vJB/+ZSDEhJTpD6a+n50HABo=', '4qnEAyuJTxPZEvdt/YSkmFfgh1Mn2nCOs6mmqkU9hWDFYa6iIxFDS8fV5O3cPkFIoDEnZ8Gsm51NOumVtsKRHA==', 'bit');

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `balance`
--
ALTER TABLE `balance`
  ADD PRIMARY KEY (`exchng_id`,`crnc_code`,`user_id`);

--
-- 테이블의 인덱스 `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- 테이블의 인덱스 `trade_info`
--
ALTER TABLE `trade_info`
  ADD PRIMARY KEY (`deal_dt`,`deal_no`,`user_id`);

--
-- 테이블의 인덱스 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user.auth_id` (`auth_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
