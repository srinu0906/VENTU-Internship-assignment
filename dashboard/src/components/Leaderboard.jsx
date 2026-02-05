import { useState } from "react";
import { Table, Card, Title, Group, Text } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import styles from "../styles/Leaderboard.module.css";

export default function Leaderboard({ data }) {
  const [sortBy, setSortBy] = useState("total");
  const [direction, setDirection] = useState("desc");

  const sortData = (field) => {
    const dir = field === sortBy && direction === "desc" ? "asc" : "desc";
    setSortBy(field);
    setDirection(dir);
  };

  const sorted = [...data].sort((a, b) => {
    const aTotal = a.crisis_management + a.sustainability + a.team_motivation;
    const bTotal = b.crisis_management + b.sustainability + b.team_motivation;

    const map = {
      name: a.name.localeCompare(b.name),
      crisis: a.crisis_management - b.crisis_management,
      sustainability: a.sustainability - b.sustainability,
      motivation: a.team_motivation - b.team_motivation,
      total: aTotal - bTotal,
    };

    const val =
      sortBy === "name"
        ? map.name
        : sortBy === "crisis"
          ? map.crisis
          : sortBy === "sustainability"
            ? map.sustainability
            : sortBy === "motivation"
              ? map.motivation
              : map.total;

    return direction === "asc" ? val : -val;
  });

  const rows = sorted.map((c, index) => {
    const total =
      c.total_score;
    
    return (
    
      <tr key={c.id} className={(index+1) % 2 == 0 ? styles.evenRow : styles.oddRow}>
        <td>{c.ranking}</td>
        <td>{c.name}</td>
        <td>{c.crisis_management}</td>
        <td>{c.sustainability}</td>
        <td>{c.team_motivation}</td>
        <td>
          {total}
        </td>
      </tr>
    );
  });

  const Header = ({ label, field }) => (
    <th
      style={{ cursor: "pointer" }}
      onClick={() => sortData(field)}
    >
      <Group gap={4}>
        {label}
        {sortBy === field &&
          (direction === "asc" ? (
            <IconChevronUp size={14} />
          ) : (
            <IconChevronDown size={14} />
          ))}
      </Group>
    </th>
  );

  return (
    <Card radius="lg" p="lg" mt="md"  style={{  boxShadow: "0 10px 25px skyblue"}}>
      <Title order={2} mt="sm" mb="lg" c="green" align="center">
        🏆 Top Candidates Leaderboard
      </Title>

      <Table id={styles.leaderboard} withTableBorder highlightOnHover
      >

        <thead>
          <tr>
            <th className={styles.tableHeader}>Rank</th>
            <Header label="Name" field="name" className={styles.tableHeader} />
            <Header label="Crisis" field="crisis" className={styles.tableHeader} />
            <Header label="Sustainability" field="sustainability" className={styles.tableHeader} />
            <Header label="Motivation" field="motivation" className={styles.tableHeader} />
            <Header label="Total Score" field="total" className={styles.tableHeader} />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Card>
  );
}
