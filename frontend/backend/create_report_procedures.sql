-- Report-related stored procedures

USE nyaminet;

-- Drop existing procedures if they exist
DROP PROCEDURE IF EXISTS `get_reported_posztok`;
DROP PROCEDURE IF EXISTS `get_osszes_egyeni_report`;
DROP PROCEDURE IF EXISTS `reszletesreportoltposzt`;
DROP PROCEDURE IF EXISTS `reportoltposzttorles`;
DROP PROCEDURE IF EXISTS `engedelyezes`;

DELIMITER $$

-- Get all reported posts grouped with count
CREATE PROCEDURE `get_reported_posztok`()
BEGIN
  SELECT
    p.poszt_id,
    p.poszt_cim,
    p.felhasznalo_id AS posztolo_id,
    u.felhasznalo_nev AS posztolo_nev,
    COUNT(r.report_id) AS report_count
  FROM report r
  JOIN poszt p ON p.poszt_id = r.poszt_id
  JOIN felhasznalok u ON u.felhasznalo_id = p.felhasznalo_id
  GROUP BY p.poszt_id, p.poszt_cim, p.felhasznalo_id, u.felhasznalo_nev
  ORDER BY report_count DESC, p.poszt_id DESC;
END$$

-- Get every individual report (one row per report)
CREATE PROCEDURE `get_osszes_egyeni_report`()
BEGIN
  SELECT
    r.report_id,
    fu.felhasznalo_nev AS reportolo_nev,
    i.indoklas_szoveg,
    p.poszt_cim,
    p.poszt_id
  FROM report r
  LEFT JOIN felhasznalok fu ON fu.felhasznalo_id = r.felhasznalo_id
  LEFT JOIN indoklas i ON i.indoklas_id = r.indoklas_id
  LEFT JOIN poszt p ON p.poszt_id = r.poszt_id
  ORDER BY r.report_id DESC;
END$$

-- Get detailed reports for a specific post
CREATE PROCEDURE `reszletesreportoltposzt`(IN p_poszt_id INT)
BEGIN
  SELECT
    r.report_id,
    r.report_szoveg,
    r.indoklas_id,
    i.indoklas_szoveg,
    r.felhasznalo_id AS reportolo_id,
    fu.felhasznalo_nev AS reportolo_nev,
    r.poszt_id
  FROM report r
  LEFT JOIN indoklas i ON i.indoklas_id = r.indoklas_id
  LEFT JOIN felhasznalok fu ON fu.felhasznalo_id = r.felhasznalo_id
  WHERE r.poszt_id = p_poszt_id
  ORDER BY r.report_id DESC;
END$$

-- Delete reported post and its reports
CREATE PROCEDURE `reportoltposzttorles`(IN p_poszt_id INT)
BEGIN
  DECLARE v_user_id INT;

  START TRANSACTION;

  SELECT felhasznalo_id
    INTO v_user_id
  FROM poszt
  WHERE poszt_id = p_poszt_id
  LIMIT 1;

  IF v_user_id IS NULL THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Nincs ilyen poszt';
  END IF;

  DELETE FROM report WHERE poszt_id = p_poszt_id;
  DELETE FROM poszt  WHERE poszt_id = p_poszt_id;

  COMMIT;

  SELECT v_user_id AS posztolo_id;
END$$

-- Approve/dismiss reports (delete them, keep the post)
CREATE PROCEDURE `engedelyezes`(IN p_poszt_id INT)
BEGIN
  DELETE FROM report WHERE poszt_id = p_poszt_id;
  SELECT ROW_COUNT() AS deleted_reports;
END$$

DELIMITER ;
