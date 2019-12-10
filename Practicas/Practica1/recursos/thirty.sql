-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 10-12-2019 a las 16:02:38
-- Versión del servidor: 10.1.37-MariaDB
-- Versión de PHP: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `thirty`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adivinarespuesta`
--

CREATE TABLE `adivinarespuesta` (
  `id` int(11) NOT NULL,
  `emailCurrentUser` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `preguntaId` int(11) NOT NULL,
  `adivinado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `adivinarespuesta`
--

INSERT INTO `adivinarespuesta` (`id`, `emailCurrentUser`, `email`, `preguntaId`, `adivinado`) VALUES
(0, 'neku@ucm.es', 'yhon@ucm.es', 4, 1);

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
('neku@ucm.es', 'wilson@gmail.com', 1),
('yhon@ucm.es', 'neku@ucm.es', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id` int(11) NOT NULL,
  `preguntaTitle` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id`, `preguntaTitle`) VALUES
(4, 'De que color es el mar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id` int(11) NOT NULL,
  `preguntaId` int(11) NOT NULL,
  `respuestaTitle` varchar(255) NOT NULL,
  `esRespuestaInicial` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `respuesta`
--

INSERT INTO `respuesta` (`id`, `preguntaId`, `respuestaTitle`, `esRespuestaInicial`) VALUES
(10, 4, 'Azul', 1),
(11, 4, 'Rosa', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestausuario`
--

CREATE TABLE `respuestausuario` (
  `id` int(11) NOT NULL,
  `preguntaId` int(11) NOT NULL,
  `respuestaId` int(11) NOT NULL,
  `email` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `respuestausuario`
--

INSERT INTO `respuestausuario` (`id`, `preguntaId`, `respuestaId`, `email`) VALUES
(2, 4, 11, 'yhon@ucm.es');

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
('3aEFm3pXfUwMYKlsDrNymkek9i8Ftgu8', 1576015549, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"neku@ucm.es\",\"puntos\":0}'),
('6AgD-EPoMt9whOELg-wSEXIPcgiVXe-q', 1576003128, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"neku@ucm.es\"}'),
('IwQ02K1iBkdBR62wV_hvS9COQoxj-ejg', 1575936651, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"currentUser\":\"neku@ucm.es\"}');

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
-- Indices de la tabla `adivinarespuesta`
--
ALTER TABLE `adivinarespuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `emailCurrentUser` (`emailCurrentUser`),
  ADD KEY `preguntaId` (`preguntaId`);

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`solicitado`,`solicitante`),
  ADD KEY `solicitante_fk2` (`solicitante`) USING BTREE,
  ADD KEY `solicitado_fk1` (`solicitado`) USING BTREE;

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `preguntaId` (`preguntaId`);

--
-- Indices de la tabla `respuestausuario`
--
ALTER TABLE `respuestausuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `respuestaId` (`respuestaId`),
  ADD KEY `preguntaId` (`preguntaId`),
  ADD KEY `idUsuario` (`email`) USING BTREE;

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `respuestausuario`
--
ALTER TABLE `respuestausuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adivinarespuesta`
--
ALTER TABLE `adivinarespuesta`
  ADD CONSTRAINT `adivinarespuesta_ibfk_1` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`),
  ADD CONSTRAINT `adivinarespuesta_ibfk_2` FOREIGN KEY (`emailCurrentUser`) REFERENCES `usuario` (`email`),
  ADD CONSTRAINT `adivinarespuesta_ibfk_3` FOREIGN KEY (`preguntaId`) REFERENCES `pregunta` (`id`);

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `idUsuario1_fk1` FOREIGN KEY (`solicitado`) REFERENCES `usuario` (`email`),
  ADD CONSTRAINT `idUsuario1_fk2` FOREIGN KEY (`solicitante`) REFERENCES `usuario` (`email`);

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `respuesta_ibfk_1` FOREIGN KEY (`preguntaId`) REFERENCES `pregunta` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `respuestausuario`
--
ALTER TABLE `respuestausuario`
  ADD CONSTRAINT `respuestausuario_ibfk_1` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`) ON DELETE CASCADE,
  ADD CONSTRAINT `respuestausuario_ibfk_2` FOREIGN KEY (`respuestaId`) REFERENCES `respuesta` (`id`),
  ADD CONSTRAINT `respuestausuario_ibfk_3` FOREIGN KEY (`preguntaId`) REFERENCES `pregunta` (`id`),
  ADD CONSTRAINT `respuestausuario_ibfk_4` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
