-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nyaminet
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ar`
--

DROP TABLE IF EXISTS `ar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ar` (
  `ar_id` int NOT NULL AUTO_INCREMENT,
  `ar_kategoria` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`ar_id`),
  UNIQUE KEY `ar_kategoria` (`ar_kategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar`
--

/*!40000 ALTER TABLE `ar` DISABLE KEYS */;
INSERT INTO `ar` VALUES (3,'drága'),(2,'közepes'),(1,'olcsó');
/*!40000 ALTER TABLE `ar` ENABLE KEYS */;

--
-- Table structure for table `elmentett_receptek`
--

DROP TABLE IF EXISTS `elmentett_receptek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elmentett_receptek` (
  `felhasznalo_id` int NOT NULL,
  `poszt_id` int NOT NULL,
  PRIMARY KEY (`felhasznalo_id`,`poszt_id`),
  KEY `fk_elmentett_poszt` (`poszt_id`),
  CONSTRAINT `fk_elmentett_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_elmentett_poszt` FOREIGN KEY (`poszt_id`) REFERENCES `poszt` (`poszt_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elmentett_receptek`
--

/*!40000 ALTER TABLE `elmentett_receptek` DISABLE KEYS */;
INSERT INTO `elmentett_receptek` VALUES (3,1),(4,1),(1,2),(3,3);
/*!40000 ALTER TABLE `elmentett_receptek` ENABLE KEYS */;

--
-- Table structure for table `felhasznalo_preferenciak`
--

DROP TABLE IF EXISTS `felhasznalo_preferenciak`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `felhasznalo_preferenciak` (
  `felhasznalo_id` int NOT NULL,
  `preferencia_id` int NOT NULL,
  PRIMARY KEY (`felhasznalo_id`,`preferencia_id`),
  KEY `fk_fp_preferencia` (`preferencia_id`),
  CONSTRAINT `fk_fp_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fp_preferencia` FOREIGN KEY (`preferencia_id`) REFERENCES `preferenciak` (`preferencia_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `felhasznalo_preferenciak`
--

/*!40000 ALTER TABLE `felhasznalo_preferenciak` DISABLE KEYS */;
INSERT INTO `felhasznalo_preferenciak` VALUES (1,1),(8,1),(12,1),(4,2),(3,3),(12,3),(1,4),(2,4),(8,4);
/*!40000 ALTER TABLE `felhasznalo_preferenciak` ENABLE KEYS */;

--
-- Table structure for table `felhasznalok`
--

DROP TABLE IF EXISTS `felhasznalok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `felhasznalok` (
  `felhasznalo_id` int NOT NULL AUTO_INCREMENT,
  `felhasznalo_jelszo_hash` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `felhasznalo_nev` varchar(100) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `sotet_mod` int NOT NULL DEFAULT '0',
  `felhasznalo_email` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `felhasznalo_letiltva` int NOT NULL DEFAULT '0',
  `role_id` int NOT NULL,
  PRIMARY KEY (`felhasznalo_id`),
  UNIQUE KEY `felhasznalo_email` (`felhasznalo_email`),
  KEY `fk_felhasznalo_role` (`role_id`),
  CONSTRAINT `fk_felhasznalo_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `felhasznalok`
--

/*!40000 ALTER TABLE `felhasznalok` DISABLE KEYS */;
INSERT INTO `felhasznalok` VALUES (1,'hash_anna','Kiss Anna',0,'anna@example.com',0,1),(2,'hash_bela','Nagy Béla',0,'bela@example.com',0,2),(3,'hash_csilla','Szabó Csilla',1,'csilla@example.com',0,1),(4,'hash_mate','Tóth Máté',0,'mate@example.com',0,1),(5,'$2b$10$BsLjdLziIFds.9J30NLpyOncmEncCWnZxrb8BP/13ekdS1rAVbZMO','Fazekas Milán',0,'fazekas.milan200610@gmail.com',0,1),(6,'$2b$10$kIihgTmlgMVOzEqpNmv./ujWzIIh2y6OCFU2LOk0KAHgCG1wLoh32','Fazekas Milan',0,'teszt@gmail.com',0,1),(7,'$2b$10$FWpBhCZVVxf6FLghMUP1seiHhoLSN1RojRWbJvz0GRCz7HWFpIwRq','Gombos Szabolcs',0,'teszt3@gomszab.com',0,1),(8,'$2b$10$OjvIPOjNHMRDJq1kPIMu1ure3X7gUL/cUZa75Cfg1Xa.KNlh.nvG2','FazekasMilán',0,'fazekas.milan@gmail.com',0,1),(9,'$2b$10$RKamds8Q2WURHMM7hY6RdOqTjSIgy13eTvf3HZfdXEkXN7Ii0upje','TesztElek',0,'tesztelek@gmail.com',0,1),(10,'$2b$10$8A1oQ2rJovR9G.JVatt8HeiTBMKx6TNM0aWSPu67Yb5JpZw9lPBnW','TesztElek2',0,'tesztelek2@gmail.com',0,1),(11,'$2b$10$Ch3praFi8CaF9ViJD5E.keOCYS9X7qSDr3xwOTfCObXfljXHVWoB2','TesztElek3',0,'tesztelek3@gmail.com',0,1),(12,'$2b$10$pEcl3gYrmHzOJH8PEV3PYuMopnOGPTziPBFNjEjagCH6RzfpPsfGO','TesztElek4',0,'tesztelek4@gmail.com',0,1);
/*!40000 ALTER TABLE `felhasznalok` ENABLE KEYS */;

--
-- Table structure for table `fogas`
--

DROP TABLE IF EXISTS `fogas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fogas` (
  `fogas_id` int NOT NULL AUTO_INCREMENT,
  `fogas_nev` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`fogas_id`),
  UNIQUE KEY `fogas_nev` (`fogas_nev`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fogas`
--

/*!40000 ALTER TABLE `fogas` DISABLE KEYS */;
INSERT INTO `fogas` VALUES (3,'desszert'),(1,'előétel'),(2,'főétel'),(4,'leves');
/*!40000 ALTER TABLE `fogas` ENABLE KEYS */;

--
-- Table structure for table `hozzavalok`
--

DROP TABLE IF EXISTS `hozzavalok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hozzavalok` (
  `hozzavalo_id` int NOT NULL AUTO_INCREMENT,
  `hozzavalo_nev` varchar(100) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`hozzavalo_id`),
  UNIQUE KEY `hozzavalo_nev` (`hozzavalo_nev`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hozzavalok`
--

/*!40000 ALTER TABLE `hozzavalok` DISABLE KEYS */;
INSERT INTO `hozzavalok` VALUES (1,'csirkemell'),(8,'cukor'),(2,'fokhagyma'),(7,'liszt'),(3,'olívaolaj'),(4,'paradicsom'),(5,'tészta'),(9,'tojás'),(6,'trappista sajt'),(10,'vaj');
/*!40000 ALTER TABLE `hozzavalok` ENABLE KEYS */;

--
-- Table structure for table `indoklas`
--

DROP TABLE IF EXISTS `indoklas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indoklas` (
  `indoklas_id` int NOT NULL AUTO_INCREMENT,
  `indoklas_szoveg` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`indoklas_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indoklas`
--

/*!40000 ALTER TABLE `indoklas` DISABLE KEYS */;
INSERT INTO `indoklas` VALUES (1,'Sértő tartalom'),(2,'Spam / reklám'),(3,'Nem megfelelő kategória');
/*!40000 ALTER TABLE `indoklas` ENABLE KEYS */;

--
-- Table structure for table `komment`
--

DROP TABLE IF EXISTS `komment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `komment` (
  `komment_id` int NOT NULL AUTO_INCREMENT,
  `komment_datum` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `komment_tartalom` text COLLATE utf8mb4_hungarian_ci NOT NULL,
  `felhasznalo_id` int NOT NULL,
  `poszt_id` int NOT NULL,
  PRIMARY KEY (`komment_id`),
  KEY `fk_komment_felhasznalo` (`felhasznalo_id`),
  KEY `fk_komment_poszt` (`poszt_id`),
  CONSTRAINT `fk_komment_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_komment_poszt` FOREIGN KEY (`poszt_id`) REFERENCES `poszt` (`poszt_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `komment`
--

/*!40000 ALTER TABLE `komment` DISABLE KEYS */;
INSERT INTO `komment` VALUES (1,'2025-12-01 17:51:56','Nagyon finom lett, köszi a receptet!',3,1),(2,'2025-12-01 17:51:56','Kicsit száraz lett, legközelebb több vajat teszek bele.',1,2),(3,'2025-12-01 17:51:56','Olcsó és gyors, pont amire szükségem volt.',2,3),(6,'2026-01-15 16:26:47','Nagyon jól eltalált ízek, gyorsan elkészült!',2,1),(7,'2026-01-15 16:26:47','Puha lett és nem túl édes, biztos újra megcsinálom.',3,2),(8,'2026-01-15 16:26:47','Egyszerű recept, de nagyon finom lett.',4,3),(9,'2026-01-15 16:26:47','Tökéletes hétköznapi vacsora, imádom a vegán verziót.',1,14),(10,'2026-01-15 16:26:47','Igazi klasszikus, a család minden tagjának ízlett.',3,15),(11,'2026-01-15 16:26:47','Nem is hiányzott belőle a liszt, szuper recept!',4,18),(12,'2026-01-15 16:26:47','Könnyű, egészséges és laktató leves.',2,19),(13,'2026-01-15 16:26:47','Nagyon jó fűszerezés, különleges ízvilág.',1,20);
/*!40000 ALTER TABLE `komment` ENABLE KEYS */;

--
-- Table structure for table `konyha`
--

DROP TABLE IF EXISTS `konyha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `konyha` (
  `konyha_id` int NOT NULL AUTO_INCREMENT,
  `konyha_nev` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`konyha_id`),
  UNIQUE KEY `konyha_nev` (`konyha_nev`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `konyha`
--

/*!40000 ALTER TABLE `konyha` DISABLE KEYS */;
INSERT INTO `konyha` VALUES (3,'ázsiai'),(1,'magyar'),(2,'olasz');
/*!40000 ALTER TABLE `konyha` ENABLE KEYS */;

--
-- Table structure for table `lepesek`
--

DROP TABLE IF EXISTS `lepesek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lepesek` (
  `lepesek_id` int NOT NULL AUTO_INCREMENT,
  `lepesek_szoveg` text COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`lepesek_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lepesek`
--

/*!40000 ALTER TABLE `lepesek` DISABLE KEYS */;
INSERT INTO `lepesek` VALUES (1,'Kapcsold be a sütőt ||| Tedd be a tésztát ||| Süsd 20 percig'),(2,'Keverd össze a száraz alapanyagokat, majd add hozzá a nedveseket és süsd meg.'),(3,'Főzd meg a tésztát, készíts paradicsomszószt, majd forgasd össze.'),(8,'Forrald fel a vizet ||| Főzd meg a pennét ||| Keverd össze a paradicsomszósszal és a bazsalikommall'),(9,'Forrald fel a vizet ||| Főzd meg a pennét ||| Keverd össze a paradicsomszósszal és a bazsalikommall'),(10,'Forrald fel a vizet ||| Főzd meg a pennét ||| Keverd össze a paradicsomszósszal és a bazsalikommall'),(11,'Forrald fel a vizet ||| Főzd meg a pennét ||| Keverd össze a paradicsomszósszal és a bazsalikommall'),(13,'Melegítsd fel a vajat, add hozzá a fokhagymát, majd a garnélát és végül a citromot.'),(14,'Főzd meg a tésztát, pirítsd a zöldségeket, keverd össze.'),(15,'Krumplit főzöd, rétegezed, sütöd.'),(18,'Összekevered, megsütöd.'),(19,'Zöldségek főzése fűszerekkel.'),(20,'Pirítás, fűszerezés, lassú főzés.'),(21,'Pirítás, fűszerezés, lassú főzés.');
/*!40000 ALTER TABLE `lepesek` ENABLE KEYS */;

--
-- Table structure for table `mertekegyseg`
--

DROP TABLE IF EXISTS `mertekegyseg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mertekegyseg` (
  `mertekegyseg_id` int NOT NULL AUTO_INCREMENT,
  `mertekegyseg_nev` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`mertekegyseg_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mertekegyseg`
--

/*!40000 ALTER TABLE `mertekegyseg` DISABLE KEYS */;
INSERT INTO `mertekegyseg` VALUES (1,'gramm'),(2,'dekagramm'),(3,'kilogramm'),(4,'milliliter'),(5,'centiliter'),(6,'deciliter'),(7,'liter'),(8,'darab'),(9,'teáskanál'),(10,'evőkanál'),(11,'csipet'),(12,'csomag'),(13,'szelet'),(14,'marék');
/*!40000 ALTER TABLE `mertekegyseg` ENABLE KEYS */;

--
-- Table structure for table `nehezseg`
--

DROP TABLE IF EXISTS `nehezseg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nehezseg` (
  `nehezseg_id` int NOT NULL AUTO_INCREMENT,
  `nehezseg_kategoria` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`nehezseg_id`),
  UNIQUE KEY `nehezseg_kategoria` (`nehezseg_kategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nehezseg`
--

/*!40000 ALTER TABLE `nehezseg` DISABLE KEYS */;
INSERT INTO `nehezseg` VALUES (1,'könnyű'),(2,'közepes'),(3,'nehéz');
/*!40000 ALTER TABLE `nehezseg` ENABLE KEYS */;

--
-- Table structure for table `poszt`
--

DROP TABLE IF EXISTS `poszt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poszt` (
  `poszt_id` int NOT NULL AUTO_INCREMENT,
  `poszt_alcimek` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `poszt_adag` int DEFAULT NULL,
  `poszt_cim` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `poszt_datum` date NOT NULL DEFAULT (curdate()),
  `poszt_ido` int DEFAULT NULL,
  `poszt_leiras` text COLLATE utf8mb4_hungarian_ci,
  `poszt_kepurl` varchar(500) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `felhasznalo_id` int NOT NULL,
  `szezon_id` int DEFAULT NULL,
  `nehezseg_id` int DEFAULT NULL,
  `konyha_id` int DEFAULT NULL,
  `ar_id` int DEFAULT NULL,
  `fogas_id` int DEFAULT NULL,
  `lepesek_id` int DEFAULT NULL,
  `engedelyezve` int DEFAULT NULL,
  `like_db` int DEFAULT '0',
  `dislike_db` int DEFAULT '0',
  PRIMARY KEY (`poszt_id`),
  KEY `fk_poszt_felhasznalo` (`felhasznalo_id`),
  KEY `fk_poszt_szezon` (`szezon_id`),
  KEY `fk_poszt_nehezseg` (`nehezseg_id`),
  KEY `fk_poszt_konyha` (`konyha_id`),
  KEY `fk_poszt_ar` (`ar_id`),
  KEY `fk_poszt_fogas` (`fogas_id`),
  KEY `fk_poszt_lepesek` (`lepesek_id`),
  CONSTRAINT `fk_poszt_ar` FOREIGN KEY (`ar_id`) REFERENCES `ar` (`ar_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_poszt_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`),
  CONSTRAINT `fk_poszt_fogas` FOREIGN KEY (`fogas_id`) REFERENCES `fogas` (`fogas_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_poszt_konyha` FOREIGN KEY (`konyha_id`) REFERENCES `konyha` (`konyha_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_poszt_lepesek` FOREIGN KEY (`lepesek_id`) REFERENCES `lepesek` (`lepesek_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_poszt_nehezseg` FOREIGN KEY (`nehezseg_id`) REFERENCES `nehezseg` (`nehezseg_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_poszt_szezon` FOREIGN KEY (`szezon_id`) REFERENCES `szezon` (`szezon_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poszt`
--

/*!40000 ALTER TABLE `poszt` DISABLE KEYS */;
INSERT INTO `poszt` VALUES (1,'Gyors hétköznapi vacsora',2,'Tejszínes csirke tésztával','2025-01-15',30,'Krémes csirkés tészta, amit fél óra alatt elkészíthetsz.','https://example.com/csirke_teszta.jpg',1,1,2,1,2,2,1,1,3,1),(2,'Puha, belül szaftos süti',8,'Csokis brownie házilag','2025-01-20',45,'Klasszikus csokis brownie ropogós kérggel.','https://example.com/brownie.jpg',3,4,2,2,2,3,2,NULL,1,2),(3,'Olaszos gyors ebéd',3,'Paradicsomos fokhagymás tészta','2025-01-10',20,'Egyszerű, olcsó paradicsomos tészta sok fokhagymával.','https://example.com/paradicsomos_teszta.jpg',1,5,1,2,1,2,3,NULL,1,3),(14,'gyors, vegán',2,'Vegán zöldséges tészta','2026-01-15',25,'Egyszerű, gyors vegán vacsora sok zöldséggel.','https://example.com/vegan_teszta.jpg',1,5,1,2,1,2,14,NULL,0,0),(15,'magyar, klasszikus',4,'Sajtos-tejfölös rakott krumpli','2026-01-15',50,'Klasszikus magyar vegetáriánus étel.','https://example.com/rakott.jpg',2,4,2,1,2,2,15,NULL,0,0),(18,'desszert, gluténmentes',8,'Gluténmentes csokis brownie','2026-01-15',40,'Puha, csokis sütemény liszt nélkül.','https://example.com/gm_brownie.jpg',1,5,2,2,2,3,18,NULL,0,0),(19,'könnyű, leves',4,'Laktózmentes zöldségleves','2026-01-15',35,'Könnyű, egészséges leves.','https://example.com/zoldsegleves.jpg',4,1,1,1,1,4,19,NULL,0,0),(20,'ázsiai, vegán',3,'Vegán gluténmentes curry','2026-01-15',90,'Komplex fűszerezésű ázsiai curry.','https://example.com/vegan_curry.jpg',2,2,3,3,2,2,20,NULL,0,0),(21,'ázsiai, vegán',3,'Sajtos moha','2026-01-16',90,'Komplex fűszerezésű ázsiai curry.','https://example.com/vegan_curry.jpg',2,2,3,3,2,2,21,NULL,0,0);
/*!40000 ALTER TABLE `poszt` ENABLE KEYS */;

--
-- Table structure for table `poszt_hozzavalok`
--

DROP TABLE IF EXISTS `poszt_hozzavalok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poszt_hozzavalok` (
  `poszt_id` int NOT NULL,
  `hozzavalo_id` int NOT NULL,
  `mennyiseg` decimal(10,2) NOT NULL,
  `mertekegyseg_id` int NOT NULL,
  PRIMARY KEY (`poszt_id`,`hozzavalo_id`),
  KEY `hozzavalo_id` (`hozzavalo_id`),
  KEY `mertekegyseg_id` (`mertekegyseg_id`),
  CONSTRAINT `poszt_hozzavalok_ibfk_1` FOREIGN KEY (`poszt_id`) REFERENCES `poszt` (`poszt_id`) ON DELETE CASCADE,
  CONSTRAINT `poszt_hozzavalok_ibfk_2` FOREIGN KEY (`hozzavalo_id`) REFERENCES `hozzavalok` (`hozzavalo_id`) ON DELETE CASCADE,
  CONSTRAINT `poszt_hozzavalok_ibfk_3` FOREIGN KEY (`mertekegyseg_id`) REFERENCES `mertekegyseg` (`mertekegyseg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poszt_hozzavalok`
--

/*!40000 ALTER TABLE `poszt_hozzavalok` DISABLE KEYS */;
INSERT INTO `poszt_hozzavalok` VALUES (1,1,300.00,1),(1,2,2.00,8),(1,3,2.00,10),(1,5,200.00,1),(1,6,100.00,1),(2,7,150.00,1),(2,8,80.00,1),(2,9,3.00,8),(2,10,50.00,1),(3,2,4.00,8),(3,3,1.00,10),(3,4,3.00,8),(3,5,150.00,1),(14,3,2.00,2),(14,4,150.00,1),(14,5,200.00,1),(15,6,200.00,1),(15,9,4.00,3),(18,8,120.00,1),(18,9,3.00,3),(19,4,200.00,1),(20,3,3.00,2),(21,3,3.00,2);
/*!40000 ALTER TABLE `poszt_hozzavalok` ENABLE KEYS */;

--
-- Table structure for table `poszt_preferenciak`
--

DROP TABLE IF EXISTS `poszt_preferenciak`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poszt_preferenciak` (
  `poszt_id` int NOT NULL,
  `preferencia_id` int NOT NULL,
  PRIMARY KEY (`poszt_id`,`preferencia_id`),
  KEY `preferencia_id` (`preferencia_id`),
  CONSTRAINT `poszt_preferenciak_ibfk_1` FOREIGN KEY (`poszt_id`) REFERENCES `poszt` (`poszt_id`) ON DELETE CASCADE,
  CONSTRAINT `poszt_preferenciak_ibfk_2` FOREIGN KEY (`preferencia_id`) REFERENCES `preferenciak` (`preferencia_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poszt_preferenciak`
--

/*!40000 ALTER TABLE `poszt_preferenciak` DISABLE KEYS */;
INSERT INTO `poszt_preferenciak` VALUES (2,1),(3,1),(15,1),(3,2),(14,2),(20,2),(21,2),(3,3),(19,3),(14,4),(18,4),(20,4),(21,4);
/*!40000 ALTER TABLE `poszt_preferenciak` ENABLE KEYS */;

--
-- Table structure for table `poszt_szavazas`
--

DROP TABLE IF EXISTS `poszt_szavazas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poszt_szavazas` (
  `felhasznalo_id` int NOT NULL,
  `poszt_id` int NOT NULL,
  `szavazat` int NOT NULL,
  PRIMARY KEY (`felhasznalo_id`,`poszt_id`),
  KEY `poszt_id` (`poszt_id`),
  CONSTRAINT `poszt_szavazas_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE,
  CONSTRAINT `poszt_szavazas_ibfk_2` FOREIGN KEY (`poszt_id`) REFERENCES `poszt` (`poszt_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poszt_szavazas`
--

/*!40000 ALTER TABLE `poszt_szavazas` DISABLE KEYS */;
INSERT INTO `poszt_szavazas` VALUES (1,1,1),(1,2,-1),(1,3,-1),(2,1,-1),(2,2,-1),(2,3,-1),(3,1,1),(3,2,1),(3,3,-1),(4,1,1),(4,3,1);
/*!40000 ALTER TABLE `poszt_szavazas` ENABLE KEYS */;

--
-- Table structure for table `preferenciak`
--

DROP TABLE IF EXISTS `preferenciak`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preferenciak` (
  `preferencia_id` int NOT NULL AUTO_INCREMENT,
  `preferencia_nev` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  PRIMARY KEY (`preferencia_id`),
  UNIQUE KEY `preferencia_nev` (`preferencia_nev`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferenciak`
--

/*!40000 ALTER TABLE `preferenciak` DISABLE KEYS */;
INSERT INTO `preferenciak` VALUES (4,'gluténmentes'),(3,'laktózmentes'),(2,'vegán'),(1,'vegetáriánus');
/*!40000 ALTER TABLE `preferenciak` ENABLE KEYS */;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `felhasznalo_id` int NOT NULL,
  `report_szoveg` text COLLATE utf8mb4_hungarian_ci,
  `komment_tartalom` text COLLATE utf8mb4_hungarian_ci,
  `indoklas_id` int DEFAULT NULL,
  `poszt_id` int DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `fk_report_felhasznalo` (`felhasznalo_id`),
  KEY `fk_report_indoklas` (`indoklas_id`),
  KEY `fk_report_poszt` (`poszt_id`),
  CONSTRAINT `fk_report_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_indoklas` FOREIGN KEY (`indoklas_id`) REFERENCES `indoklas` (`indoklas_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_report_poszt` FOREIGN KEY (`poszt_id`) REFERENCES `poszt` (`poszt_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES (1,3,'A leírásban trágár kifejezések vannak.','Ez a recept stílusban nem illik az oldalra.',1,3),(2,4,'Duplikált recept, már van nagyon hasonló.','Szerintem ez feleslegesen ismétli egy másik poszt tartalmát.',3,3),(3,1,'A brownie receptben hiányzik pár fontos részlet.','Nem derül ki pontosan a sütési hőfok.',3,2);
/*!40000 ALTER TABLE `report` ENABLE KEYS */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_nev` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_nev` (`role_nev`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (2,'admin'),(1,'user');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;

--
-- Table structure for table `szezon`
--

DROP TABLE IF EXISTS `szezon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `szezon` (
  `szezon_id` int NOT NULL AUTO_INCREMENT,
  `szezon_nev` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`szezon_id`),
  UNIQUE KEY `szezon_nev` (`szezon_nev`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `szezon`
--

/*!40000 ALTER TABLE `szezon` DISABLE KEYS */;
INSERT INTO `szezon` VALUES (5,'bármikor'),(2,'nyár'),(3,'ősz'),(1,'tavasz'),(4,'tél');
/*!40000 ALTER TABLE `szezon` ENABLE KEYS */;

--
-- Dumping routines for database 'nyaminet'
--
/*!50003 DROP PROCEDURE IF EXISTS `get_szurt_posztok` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `get_szurt_posztok`(
    #rossz kodnyelv vagymiafaszom miatt atkellett allitanom
    IN poszt_limit INT,
    IN oldalszam INT,
    IN p_search VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
    IN p_ar INT,
    IN p_konyha VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
    IN p_ido INT,
    IN p_allergia VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
    IN nap INT,
    IN p_fogas VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
    IN p_nehezseg INT,
    IN p_szezon VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
    IN p_sorrend INT
)
BEGIN
    #oldalkezeles
    DECLARE csusztatas INT;
    DECLARE allergia_count INT;
    SET csusztatas = (oldalszam - 1) * poszt_limit;
    SET allergia_count = 0;
    #allergia formázása,vesszők számlálása hogy tudjuk mennyi allergia van
    IF p_allergia IS NOT NULL AND p_allergia != '' THEN
        SET allergia_count = LENGTH(p_allergia) - LENGTH(REPLACE(p_allergia, ',', '')) + 1;
        #SET allergia_count = REGEXP_COUNT(p_allergia, ',') + 1;
    END IF;
    #mi kell
    SELECT 
        poszt.poszt_id,
        poszt.poszt_cim,
        poszt.poszt_datum,
        poszt.poszt_ido,
        poszt.poszt_leiras,
        poszt.poszt_kepurl,
        poszt.like_db,
        poszt.dislike_db,
        
        felhasznalok.felhasznalo_nev,
        ar.ar_kategoria,
        konyha.konyha_nev,
        nehezseg.nehezseg_kategoria,
        fogas.fogas_nev,
        szezon.szezon_nev,
    #az allergiak igy neznek ki: vega,vegeáriánus,gluténmentes
        GROUP_CONCAT(preferenciak.preferencia_nev SEPARATOR ',') AS allergiak

    #osszekotes
    FROM poszt
    INNER JOIN felhasznalok ON poszt.felhasznalo_id = felhasznalok.felhasznalo_id
    LEFT JOIN ar ON poszt.ar_id = ar.ar_id
    LEFT JOIN konyha ON poszt.konyha_id = konyha.konyha_id
    LEFT JOIN nehezseg ON poszt.nehezseg_id = nehezseg.nehezseg_id
    LEFT JOIN fogas ON poszt.fogas_id = fogas.fogas_id
    LEFT JOIN szezon ON poszt.szezon_id = szezon.szezon_id
    LEFT JOIN poszt_preferenciak ON poszt.poszt_id = poszt_preferenciak.poszt_id
    LEFT JOIN preferenciak ON poszt_preferenciak.preferencia_id = preferenciak.preferencia_id

    #minden csekkolasa, valtozo fogas,szezon stb. esetén használtam így
    WHERE
        (p_search IS NULL OR poszt.poszt_cim LIKE CONCAT('%', p_search, '%'))
        AND (p_ar IS NULL OR poszt.ar_id = p_ar)
        AND (p_konyha IS NULL OR konyha.konyha_nev LIKE CONCAT('%', p_konyha, '%'))
        AND (p_fogas IS NULL OR fogas.fogas_nev LIKE CONCAT('%', p_fogas, '%'))
        AND (p_szezon IS NULL OR szezon.szezon_nev LIKE CONCAT('%', p_szezon, '%'))
        AND (p_nehezseg IS NULL OR poszt.nehezseg_id = p_nehezseg)
        #kisebb vagy egyenlő, ido mint elkeszitesi ido
        #AND (p_ido IS NULL OR poszt.poszt_ido <= p_ido) ha csuszka

        AND (
            p_ido IS NULL
            OR (
                p_ido = 1 AND poszt.poszt_ido < 30
            )
            OR (
                p_ido = 2 AND poszt.poszt_ido >= 30 AND poszt.poszt_ido <= 60
            )
            OR (
                p_ido = 3 AND poszt.poszt_ido > 60 AND poszt.poszt_ido <= 180
            )
            OR (
                p_ido = 4 AND poszt.poszt_ido > 180
            )
        )


        #allergiak csekkolasa, csak olyan ami mindet tartalmazza
        AND (
            allergia_count = 0
            OR (
                SELECT COUNT(*)
                FROM poszt_preferenciak x
                INNER JOIN preferenciak y ON y.preferencia_id = x.preferencia_id
                WHERE x.poszt_id = poszt.poszt_id
                AND FIND_IN_SET(y.preferencia_nev, p_allergia)
            ) = allergia_count
            #akkor jó ha a megszámolt allergiaszám pontosan egyenlő a szűrés számmal
        )

       AND (
            nap IS NULL
            OR poszt.poszt_datum >= CURDATE() - INTERVAL nap DAY
        )

    #oldalkezeles,kiiratas
    GROUP BY poszt.poszt_id
    #sorrendek
ORDER BY
    # 1. random
    CASE WHEN p_sorrend = 1 THEN RAND() END,

    # 2. újabb elől
    CASE WHEN p_sorrend = 2 THEN poszt.poszt_datum END DESC,

    # 3. régebbi elől
    CASE WHEN p_sorrend = 3 THEN poszt.poszt_datum END ASC,

    # 4. legtöbb like elől
    CASE WHEN p_sorrend = 4 THEN poszt.like_db END DESC

LIMIT csusztatas, poszt_limit;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `kommentek_lekerese` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `kommentek_lekerese`(
    IN p_poszt_id INT
)
BEGIN
    SELECT 
        k.komment_id,
        k.komment_tartalom,
        k.komment_datum,
        f.felhasznalo_nev
    FROM komment AS k
    INNER JOIN felhasznalok AS f ON f.felhasznalo_id = k.felhasznalo_id
    WHERE k.poszt_id = p_poszt_id
    ORDER BY k.komment_datum DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `komment_hozzaadasa` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `komment_hozzaadasa`(
    IN p_felhasznalo_id INT,
    IN p_poszt_id INT,
    IN p_tartalom TEXT
)
BEGIN
    INSERT INTO komment (komment_tartalom, felhasznalo_id, poszt_id)
    VALUES (p_tartalom, p_felhasznalo_id, p_poszt_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `likekezeles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `likekezeles`(
    IN p_felhasznalo_id INT,
    IN p_poszt_id INT,
    IN p_szavazat INT   
    #egy = like minuszegy = dislike
)
BEGIN
    

    DECLARE elozo INT;
    #van-e szavazat
    SELECT szavazat 
    INTO elozo
    FROM poszt_szavazas
    WHERE felhasznalo_id = p_felhasznalo_id
      AND poszt_id = p_poszt_id;

    #ha meg nem szavazott eleg betenni
    IF elozo IS NULL THEN
        INSERT INTO poszt_szavazas (felhasznalo_id, poszt_id, szavazat)
        VALUES (p_felhasznalo_id, p_poszt_id, p_szavazat);

    #ha ugyanarra szavazott toroljuk azt csuma
    ELSEIF elozo = p_szavazat THEN
        DELETE FROM poszt_szavazas
        WHERE felhasznalo_id = p_felhasznalo_id
          AND poszt_id = p_poszt_id;

    #ha masikat kuld ellentetjere valtoztatjuk 1*-1 = -1
    ELSE
        UPDATE poszt_szavazas
        SET szavazat = szavazat * -1
        WHERE felhasznalo_id = p_felhasznalo_id
          AND poszt_id = p_poszt_id;
    END IF;

    #poszt szamanak frissitese
    UPDATE poszt SET
        like_db = (
            SELECT COUNT(szavazat)
            FROM poszt_szavazas
            WHERE poszt_id = p_poszt_id
            AND szavazat = 1
        ),
        dislike_db = (
            SELECT COUNT(szavazat)
            FROM poszt_szavazas
            WHERE poszt_id = p_poszt_id
            AND szavazat = -1
        )
    #mindnek atirna te barom
    WHERE poszt_id = p_poszt_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `preferencia_kezeles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `preferencia_kezeles`(
    IN p_felhasznalo_id INT,
    IN p_preferencia_nev VARCHAR(50)
)
BEGIN
    DECLARE talalt_preferencia_id INT;
    # 1 hozzadva 2 torolve -1 hibas megadott preferencia
    DECLARE letezike INT DEFAULT NULL;

    #nev alapjan preferencia id
    SELECT preferencia_id
    INTO talalt_preferencia_id
    FROM preferenciak
    WHERE preferencia_nev = p_preferencia_nev;

    -- ha nincs ilyen preferencia
    IF talalt_preferencia_id IS NOT NULL THEN
        #van e a felhasznalonak barmilyen preferenciája, null marad ha nincs
        SELECT 1
        INTO letezike
        FROM felhasznalo_preferenciak
        WHERE felhasznalo_id = p_felhasznalo_id
        AND preferencia_id = talalt_preferencia_id;

        #letezike alapjan hozzaadas vagy torles
        IF letezike IS NULL THEN
            #hozzaadas mert nem letezik
            INSERT INTO felhasznalo_preferenciak (felhasznalo_id, preferencia_id)
            VALUES (p_felhasznalo_id, talalt_preferencia_id);
            SET letezike = 1;
        ELSE
        #torles mert letezik
            DELETE FROM felhasznalo_preferenciak
            WHERE felhasznalo_id = p_felhasznalo_id
            AND preferencia_id = talalt_preferencia_id;
            SET letezike = 0;
        END IF;

    END IF;

    SELECT letezike AS eredmeny;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `reszletesposzt` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `reszletesposzt`(IN p_poszt_id INT)
BEGIN
    SELECT 
        poszt.poszt_id,
        poszt.poszt_cim,
        poszt.poszt_datum,
        poszt.poszt_ido,
        poszt.poszt_kepurl,
        poszt.poszt_leiras,
        poszt.poszt_adag,
        poszt.poszt_alcimek,

        feltolto.felhasznalo_nev AS feltolto,

        fogas.fogas_nev,
        nehezseg.nehezseg_kategoria,
        ar_kategoria.ar_kategoria,
        konyha.konyha_nev,
        szezon.szezon_nev,

        GROUP_CONCAT(DISTINCT allergia.preferencia_nev SEPARATOR ', ') AS allergiak

    FROM poszt AS poszt
    JOIN felhasznalok AS feltolto ON poszt.felhasznalo_id = feltolto.felhasznalo_id
    LEFT JOIN fogas AS fogas ON poszt.fogas_id = fogas.fogas_id
    LEFT JOIN nehezseg AS nehezseg ON poszt.nehezseg_id = nehezseg.nehezseg_id
    LEFT JOIN ar AS ar_kategoria ON poszt.ar_id = ar_kategoria.ar_id
    LEFT JOIN konyha AS konyha ON poszt.konyha_id = konyha.konyha_id
    LEFT JOIN szezon AS szezon ON poszt.szezon_id = szezon.szezon_id
    LEFT JOIN poszt_preferenciak AS poszt_pref ON poszt.poszt_id = poszt_pref.poszt_id
    LEFT JOIN preferenciak AS allergia ON poszt_pref.preferencia_id = allergia.preferencia_id


    WHERE poszt.poszt_id = p_poszt_id
    GROUP BY poszt.poszt_id;
   #tojás,liszt,cukor
    SELECT
    hozzavalo.hozzavalo_nev,
    ph.mennyiseg,
    mertekegyseg.mertekegyseg_nev
    FROM poszt_hozzavalok ph
    INNER JOIN hozzavalok hozzavalo ON ph.hozzavalo_id = hozzavalo.hozzavalo_id
    INNER JOIN mertekegyseg ON ph.mertekegyseg_id = mertekegyseg.mertekegyseg_id
    WHERE ph.poszt_id = p_poszt_id;
    
    #lepesek
    SELECT lepesek_szoveg
    FROM lepesek
    WHERE lepesek_id = (
        SELECT lepesek_id
        FROM poszt
        WHERE poszt_id = p_poszt_id
    );
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `uj_poszt_felvetele` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `uj_poszt_felvetele`(
    IN p_poszt_cim VARCHAR(255),
    IN p_poszt_leiras VARCHAR(250),
    IN p_poszt_ido INT,
    IN p_poszt_adag INT,
    IN p_ar_id INT,
    IN p_konyha_id INT,
    IN p_fogas_id INT,
    IN p_nehezseg_id INT,
    IN p_szezon_id INT,
    IN p_poszt_kepurl VARCHAR(500),
    IN p_felhasznalo_id INT,

    IN p_lepesek_szoveg VARCHAR(250),

    #VARCHAR a bemenet miatt
    IN p_hozzavalo_ids VARCHAR(500),
    IN p_mennyisegek VARCHAR(500),
    IN p_mertekegyseg_ids VARCHAR(500)
)
BEGIN
    DECLARE uj_poszt_id INT;
    DECLARE uj_lepes_id INT;

    DECLARE h_index INT DEFAULT 1;
    DECLARE hozzavaloszam INT;

    DECLARE h_hozzavalo_id INT;
    DECLARE h_mennyiseg VARCHAR(50);
    DECLARE h_mertekegyseg_id INT;


    INSERT INTO poszt
    #nem kerul fel lepesek id-val mert még nemtudjuk milesz az id-ja, updatelni kell
        (poszt_cim, poszt_leiras, poszt_ido, poszt_adag, ar_id, konyha_id, fogas_id, nehezseg_id, szezon_id, poszt_kepurl, felhasznalo_id)
    VALUES 
        (p_poszt_cim, p_poszt_leiras, p_poszt_ido, p_poszt_adag, p_ar_id, p_konyha_id, p_fogas_id, p_nehezseg_id, p_szezon_id, p_poszt_kepurl, p_felhasznalo_id);
    #maxxal akartam visszaszerezni az ID-t de nem megfelelőt ad vissza,ez azonnal visszaadja amit feltöltök
    SET uj_poszt_id = LAST_INSERT_ID();
    # a idvel már betudjuk tenni a többi táblát
    INSERT INTO lepesek (lepesek_szoveg)
    VALUES (p_lepesek_szoveg);
    SET uj_lepes_id = LAST_INSERT_ID();
    #majd MOST hogy már tudjuk kell atallitani a lepes id-t
    UPDATE poszt
    SET lepesek_id = uj_lepes_id
    WHERE poszt_id = uj_poszt_id;

    #Hozzavalok
    #mennyi hozzavalo van "1,2,5" -> 125 azaz 3
    SET hozzavaloszam = LENGTH(p_hozzavalo_ids) - LENGTH(REPLACE(p_hozzavalo_ids, ',', '')) + 1;

    #végigmegyünk
    WHILE h_index <= hozzavaloszam DO

        #azért nemlehet szerintem máshogy mert valahogy tudni kell a több elemű hozzávalókat is
        #kivesszük id alapján az első elemet "1,2,5" -> "1",","(VALAMIER) -> 1 ||| a -1 ek az utolsó elemnek kellenek

        #AS INT-re hibát dob SIGNED != nem egész vagy null abc -> 0
        SET h_hozzavalo_id =
            CAST((SUBSTRING_INDEX(SUBSTRING_INDEX(p_hozzavalo_ids, ',', h_index), ',', -1)) AS SIGNED);
        SET h_mennyiseg =
            CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_mennyisegek, ',', h_index), ',', -1) AS DECIMAL(10,2));
        SET h_mertekegyseg_id =
            CAST((SUBSTRING_INDEX(SUBSTRING_INDEX(p_mertekegyseg_ids, ',', h_index), ',', -1)) AS SIGNED);


        #BESZURAAAAS
        INSERT INTO poszt_hozzavalok (
            poszt_id, hozzavalo_id, mennyiseg, mertekegyseg_id
        )
        VALUES (
            uj_poszt_id, h_hozzavalo_id, h_mennyiseg, h_mertekegyseg_id
        );

        SET h_index = h_index + 1;
    END WHILE;


    #visszaadjuk az id-t
    SELECT uj_poszt_id AS poszt_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-30 14:18:19
