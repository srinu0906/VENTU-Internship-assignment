use candidates_db;
select * from candidates;
select * from evaluations;
select * from rankings;

select r.ranking as 'rank',c.name, c.email,(e.crisis_management+ sustainability+team_motivation) as total_score from rankings r ,candidates c, evaluations e
where r.candidate_id = c.id and c.id = e.candidate_id
order by r.ranking;
