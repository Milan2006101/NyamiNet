-- Table for storing recipe likes/dislikes
DROP TABLE IF EXISTS `recept_ertekelesek`;

CREATE TABLE `recept_ertekelesek` (
  `ertekeles_id` int NOT NULL AUTO_INCREMENT,
  `felhasznalo_id` int NOT NULL,
  `poszt_id` int NOT NULL,
  `ertekeles_tipus` ENUM('like', 'dislike') NOT NULL,
  `ertekeles_datum` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ertekeles_id`),
  UNIQUE KEY `unique_user_post` (`felhasznalo_id`, `poszt_id`),
  KEY `fk_ertekeles_felhasznalo` (`felhasznalo_id`),
  KEY `fk_ertekeles_poszt` (`poszt_id`),
  CONSTRAINT `fk_ertekeles_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ertekeles_poszt` FOREIGN KEY (`poszt_id`) REFERENCES `poszt` (`poszt_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Stored procedure to get user's rating for a recipe
DROP PROCEDURE IF EXISTS `felhasznalo_ertekeles_lekerese`;
DELIMITER $$
CREATE PROCEDURE `felhasznalo_ertekeles_lekerese`(
    IN p_felhasznalo_id INT,
    IN p_poszt_id INT
)
BEGIN
    SELECT ertekeles_tipus
    FROM recept_ertekelesek
    WHERE felhasznalo_id = p_felhasznalo_id AND poszt_id = p_poszt_id;
END$$
DELIMITER ;

-- Stored procedure to add or update a rating
DROP PROCEDURE IF EXISTS `ertekeles_hozzaadasa_modositasa`;
DELIMITER $$
CREATE PROCEDURE `ertekeles_hozzaadasa_modositasa`(
    IN p_felhasznalo_id INT,
    IN p_poszt_id INT,
    IN p_ertekeles_tipus VARCHAR(10)
)
BEGIN
    INSERT INTO recept_ertekelesek (felhasznalo_id, poszt_id, ertekeles_tipus)
    VALUES (p_felhasznalo_id, p_poszt_id, p_ertekeles_tipus)
    ON DUPLICATE KEY UPDATE 
        ertekeles_tipus = p_ertekeles_tipus,
        ertekeles_datum = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Stored procedure to remove a rating
DROP PROCEDURE IF EXISTS `ertekeles_torlese`;
DELIMITER $$
CREATE PROCEDURE `ertekeles_torlese`(
    IN p_felhasznalo_id INT,
    IN p_poszt_id INT
)
BEGIN
    DELETE FROM recept_ertekelesek
    WHERE felhasznalo_id = p_felhasznalo_id AND poszt_id = p_poszt_id;
END$$
DELIMITER ;

-- Stored procedure to get like/dislike counts for a recipe
DROP PROCEDURE IF EXISTS `ertekeles_statisztika`;
DELIMITER $$
CREATE PROCEDURE `ertekeles_statisztika`(
    IN p_poszt_id INT
)
BEGIN
    SELECT 
        COUNT(CASE WHEN ertekeles_tipus = 'like' THEN 1 END) as like_count,
        COUNT(CASE WHEN ertekeles_tipus = 'dislike' THEN 1 END) as dislike_count
    FROM recept_ertekelesek
    WHERE poszt_id = p_poszt_id;
END$$
DELIMITER ;
