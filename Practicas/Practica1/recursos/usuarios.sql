CREATE TABLE `User` (
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` int(11) NOT NULL,
  `birthday` Date,
  `photo` varchar(200)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `User` ADD PRIMARY KEY (`email`);


DROP TABLE User;
