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

create table rankings(
	candidate_id int primary key,
    ranking int,
    foreign key(candidate_id) references candidates(id)
);

-- Creating trigger
DELIMITER $$

create trigger update_rankings after insert on evaluations
for each row
begin
	
    insert into rankings(candidate_id,ranking) 
    values (new.candidate_id,0)
    on duplicate key update  ranking = ranking;
    
    set @r = 0;
    update rankings r 
    join(
		select candidate_id,(@r := @r + 1) as new_rank
        from evaluations 
        order by (crisis_management + sustainability + team_motivation) desc
	) ranked
    on r.candidate_id = ranked.candidate_id
    set r.ranking = ranked.new_rank;
end$$

DELIMITER ;
