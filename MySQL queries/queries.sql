-- Creating database
create database candidates_db; 
use candidates_db;

-- Creating tables
create table candidates (
	id int auto_increment primary key,
    email varchar(50) unique not null,
    name varchar(100),
    experience int,
    skills text,
    created_at timestamp default current_timestamp
);

create table evaluations (
	candidate_id int primary key,
    crisis_management int,
    sustainability int,
    team_motivation int,
    foreign key(candidate_id) references candidates(id)
);

CREATE TABLE rankings (
    candidate_id INT PRIMARY KEY,
    total_score INT,
    ranking INT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

DELIMITER $$


--  Procedure for compting ranks
CREATE PROCEDURE recompute_rankings()
BEGIN
    DELETE FROM rankings;

    INSERT INTO rankings (candidate_id, total_score, ranking)
    SELECT
        candidate_id,
        total_score,
        DENSE_RANK() OVER (ORDER BY total_score DESC)
    FROM (
        SELECT
            candidate_id,
            (crisis_management + sustainability + team_motivation) AS total_score
        FROM evaluations
    ) t;
END$$

DELIMITER ;


DELIMITER $$


-- Trigger for insert
CREATE TRIGGER trg_eval_after_insert
AFTER INSERT ON evaluations
FOR EACH ROW
BEGIN
    CALL recompute_rankings();
END$$

DELIMITER ;


-- Trigger for update
DELIMITER $$
CREATE TRIGGER trg_eval_after_update
AFTER UPDATE ON evaluations
FOR EACH ROW
BEGIN
    CALL recompute_rankings();
END$$
DELIMITER ;
