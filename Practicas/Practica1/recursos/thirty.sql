-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2019 a las 19:18:48
-- Versión del servidor: 10.1.38-MariaDB
-- Versión de PHP: 7.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `RespuestaUsuario`;
DROP TABLE IF EXISTS `Respuesta`;
DROP TABLE IF EXISTS `Pregunta`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `amigos`;
DROP TABLE IF EXISTS `usuario`;

SET FOREIGN_KEY_CHECKS = 1;

--
-- Base de datos: `thirty`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `solicitado` varchar(200) NOT NULL,
  `solicitante` varchar(200) NOT NULL,
  `amigos` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`solicitado`, `solicitante`, `amigos`) VALUES
('neku@ucm.es', 'ejemplo@gmail.com', 1),
('neku@ucm.es', 'wilson@gmail.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('1b5mDuyjNVdB4Kbc6rqhm6oBggr7rh2o', 1575477786, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"ejemplo@gmail.com\"}'),
('jmHAhOQ6cBVpIJAKSunTRErkhpdvwPd0', 1575568253, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"neku@ucm.es\"}'),
('lkgqattiathe1t1e6AUaEgcICT_of0Bn', 1575549004, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"neku@ucm.es\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `email` varchar(200) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `gender` char(1) NOT NULL,
  `birthDate` date DEFAULT NULL,
  `img` mediumtext,
  `puntos` int(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`email`, `password`, `name`, `gender`, `birthDate`, `img`, `puntos`) VALUES
('ejemplo@gmail.com', '123', 'Ejemplo', 'F', '2001-05-01', NULL, 0),
('neku@ucm.es', 'aaa', 'Neku', 'F', '1997-06-24', 'b32a2d7655b0414482f1c18704a43e51', 0),
('wilson@gmail.com', 'asd', 'Wilson', 'F', '1999-07-16', NULL, 0),
('yhon', '2', 'Yhondri', 'M', '1999-07-16', NULL, 0),
('yhon@ucm.es', '234', 'Yhon', 'M', '1994-02-01', 'd7cfb42d3bb9dd3be5e7fbbeca380788', 0);


--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`solicitado`,`solicitante`),
  ADD KEY `solicitante_fk2` (`solicitante`) USING BTREE,
  ADD KEY `solicitado_fk1` (`solicitado`) USING BTREE;

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`email`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `idUsuario1_fk1` FOREIGN KEY (`solicitado`) REFERENCES `usuario` (`email`),
  ADD CONSTRAINT `idUsuario1_fk2` FOREIGN KEY (`solicitante`) REFERENCES `usuario` (`email`);
COMMIT;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pregunta`
--

CREATE TABLE Pregunta (
    `id` int NOT NULL AUTO_INCREMENT,
    `texto` varchar(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Respuesta (
    `id` int NOT NULL AUTO_INCREMENT,
    `preguntaId` int NOT NULL,
    `texto` varchar(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (preguntaId) REFERENCES Pregunta(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE RespuestaUsuario (
    `id` int NOT NULL AUTO_INCREMENT,
    `preguntaId` int NOT NULL,
    `respuestaId` int NOT NULL,
    `idUsuario` varchar(200) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (idUsuario) REFERENCES usuario(email) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Pregunta` (`id`, `texto`) VALUES
(1, "¿Cuál es la peor película de la historia?"),
(2, "¿De qué color es el caballo blanco de Santiago?"),
(3, "¿En qué país se encuentra el estado de California?");

INSERT INTO `Respuesta` (`id`, `preguntaId`, `texto`) VALUES
(1, 1, "Spiderman 1"),
(2, 1, "Spiderman 2"),
(3, 1, "El Padrino"),
(4, 2, "Azul"),
(5, 2, "Verde"),
(6, 2, "Blanco"),
(7, 3, "España"),
(8, 3, "Francía"),
(9, 3, "Estados Unidos");





/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
