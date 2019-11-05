
CREATE DATABASE IF NOT EXISTS `articulos`;
USE `articulos`;


CREATE TABLE `articulos` (
  `Id` int(11) NOT NULL,
  `Titulo` varchar(300) NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `palabrasclave` (
  `IdArticulo` int(11) NOT NULL,
  `PalabraClave` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `articulos`
  ADD PRIMARY KEY (`Id`);


ALTER TABLE `palabrasclave`
  ADD KEY `palabrasclave_fk_1` (`IdArticulo`);


ALTER TABLE `articulos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


ALTER TABLE `palabrasclave`
  ADD CONSTRAINT `palabrasclave_fk_1` FOREIGN KEY (`IdArticulo`) REFERENCES `articulos` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

INSERT INTO `articulos` (`Titulo`, `Fecha`) VALUES
('An inference algorithm for guaranteeing Safe destruction', '2008-07-20'),
('A type system for region management and its proof of correctness', '2010-07-21'),
('Shape analysis by regular languages', '2009-05-30'),
('Polymorphic type specifications', '2016-03-01'),
('Yet to be written', '2017-02-01');

INSERT INTO `palabrasclave` (`IdArticulo`, `PalabraClave`) VALUES
(1, 'memory'),
(1, 'inference'),
(1, 'formal'),
(2, 'type system'),
(2, 'memory'),
(4, 'type system'),
(4, 'success types');
