/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ex_author`
--
DROP TABLE IF EXISTS `ex_author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ex_author` (
  `authorID` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `dod` date DEFAULT NULL,
  PRIMARY KEY (`authorID`)
) AUTO_INCREMENT=1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Sample data for table `ex_author`
--
LOCK TABLES `ex_author` WRITE;
/*!40000 ALTER TABLE `ex_author` DISABLE KEYS */;
INSERT INTO `ex_author` VALUES
  (1,'Orwell, George','1903-06-25','1950-01-21'),
  (2,'Hawking, Stephen','1942-01-08','2018-03-14'),
  (3,'Dawkins, Richard','1941-03-26',NULL),
  (4,'Fischer, David Hackett','1935-12-02',NULL),
  (5,'Herbert, Franklin Patrick Jr.','1920-10-08','1986-02-11');
/*!40000 ALTER TABLE `ex_author` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Table structure for table `ex_author`
--
DROP TABLE IF EXISTS `ex_publisher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ex_publisher` (
  `publisherID` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`publisherID`)
) AUTO_INCREMENT=1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Sample data for table `ex_publisher`
--
LOCK TABLES `ex_publisher` WRITE;
/*!40000 ALTER TABLE `ex_publisher` DISABLE KEYS */;
INSERT INTO `ex_publisher` VALUES
  (1,'Harvill Secker'),
  (2,'Bantam Books'),
  (3,'Oxford University Press'),
  (4,'Chilton Company');
/*!40000 ALTER TABLE `ex_publisher` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Table structure for table `ex_book`
--
DROP TABLE IF EXISTS `ex_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ex_book` (
  `ISBN` bigint NOT NULL,
  `year_published` date DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `authorID` int(10) NOT NULL,
  `publisherID` int(10) NOT NULL,
  PRIMARY KEY (`ISBN`),
  FOREIGN KEY (`authorID`) REFERENCES ex_author(`authorID`),
  FOREIGN KEY (`publisherID`) REFERENCES ex_publisher(`publisherID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Sample data for table `ex_book`
--
LOCK TABLES `ex_book` WRITE;
/*!40000 ALTER TABLE `ex_book` DISABLE KEYS */;
INSERT INTO `ex_book` VALUES
  (9780241416419,'1949','Nineteen Eighty-Four',1,1),
  (9781846553547,'1945','Animal Farm',1,1),
  (9780553380163,'1988','A Brief History of Time',2,2),
  (9780618680009,'2006','The God Delusion',3,2),
  (9780192860927,'1990','The Selfish Gene',3,3),
  (9780195069051,'1989','Albion\'s Seed: Four British Folways in America',4,3),
  (9780195098310,'1995','Paul Revere\'s Ride',4,3),
  (9780441172719,'1965','Dune',5,4);
/*!40000 ALTER TABLE `ex_book` ENABLE KEYS */;
UNLOCK TABLES;