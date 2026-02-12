-- Update get_szurt_posztok procedure to also search in poszt_alcimek (alternative names)

DROP PROCEDURE IF EXISTS `get_szurt_posztok`;

DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `get_szurt_posztok`(
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
    DECLARE csusztatas INT;
    DECLARE allergia_count INT;
    SET csusztatas = (oldalszam - 1) * poszt_limit;
    SET allergia_count = 0;

    IF p_allergia IS NOT NULL AND p_allergia != '' THEN
        SET allergia_count = LENGTH(p_allergia) - LENGTH(REPLACE(p_allergia, ',', '')) + 1;
    END IF;

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

        GROUP_CONCAT(preferenciak.preferencia_nev SEPARATOR ',') AS allergiak

    FROM poszt
    INNER JOIN felhasznalok ON poszt.felhasznalo_id = felhasznalok.felhasznalo_id
    LEFT JOIN ar ON poszt.ar_id = ar.ar_id
    LEFT JOIN konyha ON poszt.konyha_id = konyha.konyha_id
    LEFT JOIN nehezseg ON poszt.nehezseg_id = nehezseg.nehezseg_id
    LEFT JOIN fogas ON poszt.fogas_id = fogas.fogas_id
    LEFT JOIN szezon ON poszt.szezon_id = szezon.szezon_id
    LEFT JOIN poszt_preferenciak ON poszt.poszt_id = poszt_preferenciak.poszt_id
    LEFT JOIN preferenciak ON poszt_preferenciak.preferencia_id = preferenciak.preferencia_id

    WHERE
        (p_search IS NULL OR poszt.poszt_cim LIKE CONCAT('%', p_search, '%') OR poszt.poszt_alcimek LIKE CONCAT('%', p_search, '%'))
        AND (p_ar IS NULL OR poszt.ar_id = p_ar)
        AND (p_konyha IS NULL OR konyha.konyha_nev LIKE CONCAT('%', p_konyha, '%'))
        AND (p_fogas IS NULL OR fogas.fogas_nev LIKE CONCAT('%', p_fogas, '%'))
        AND (p_szezon IS NULL OR szezon.szezon_nev LIKE CONCAT('%', p_szezon, '%'))
        AND (p_nehezseg IS NULL OR poszt.nehezseg_id = p_nehezseg)
        AND (
            p_ido IS NULL
            OR (p_ido = 1 AND poszt.poszt_ido < 30)
            OR (p_ido = 2 AND poszt.poszt_ido >= 30 AND poszt.poszt_ido <= 60)
            OR (p_ido = 3 AND poszt.poszt_ido > 60 AND poszt.poszt_ido <= 180)
            OR (p_ido = 4 AND poszt.poszt_ido > 180)
        )
        AND (
            allergia_count = 0
            OR (
                SELECT COUNT(*)
                FROM poszt_preferenciak x
                INNER JOIN preferenciak y ON y.preferencia_id = x.preferencia_id
                WHERE x.poszt_id = poszt.poszt_id
                AND FIND_IN_SET(y.preferencia_nev, p_allergia)
            ) = allergia_count
        )
        AND (
            nap IS NULL
            OR poszt.poszt_datum >= CURDATE() - INTERVAL nap DAY
        )

    GROUP BY poszt.poszt_id

    ORDER BY
        CASE WHEN p_sorrend = 1 THEN RAND() END,
        CASE WHEN p_sorrend = 2 THEN poszt.poszt_datum END DESC,
        CASE WHEN p_sorrend = 3 THEN poszt.poszt_datum END ASC,
        CASE WHEN p_sorrend = 4 THEN poszt.like_db END DESC

    LIMIT csusztatas, poszt_limit;
END ;;
DELIMITER ;
