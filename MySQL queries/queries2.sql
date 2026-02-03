use candidates_db;
select * from candidates;
select * from evaluations;
select * from rankings;

select r.ranking as 'rank',c.name, c.email from rankings r ,candidates c
where r.candidate_id = c.id
order by r.ranking;
