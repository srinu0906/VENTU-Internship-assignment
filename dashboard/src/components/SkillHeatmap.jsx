import { Card, Title, Table, Select, Group, Button, Text } from "@mantine/core";
import { useState } from "react";
import styles from "../styles/SkillHeatmap.module.css";

const getColor = (score) => {
  if (score <= 2) return "#d6edf7";
  if (score <= 4) return "#bfe6f5";
  if (score <= 6) return "#7fd0ef";
  if (score <= 8) return "#3cb6e6";
  return "#0aaaff";
};

const Cell = ({ value }) => (
  <td
    className={styles.heatCell}
    style={{ backgroundColor: getColor(value) }}
  >
    {value}
  </td>
);

export default function SkillHeatmap({ data }) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const total = data.length;

  const start = page * rowsPerPage;
  const end = Math.min(start + rowsPerPage, total);

  const visibleRows = data.slice(start, end);

  const nextPage = () => {
    if (end < total) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  return (
    <Card shadow="md" radius="lg" p="lg" mt="xl" style={{  boxShadow: "0 10px 25px skyblue" , marginBottom: "2rem"}}>

      {/* Header row */}
      <Group justify="space-between" mb="sm">
        <Title order={3}>Skill Heatmap</Title>
        
        <Select
          data={["5", "10", "20", "40"]}
          value={String(rowsPerPage)}
          onChange={(v) => {
            setRowsPerPage(Number(v));
            setPage(0);
          }}
          size="xs"
          className={styles.rowsSelect}
        />
      </Group>

      <Table
        className={styles.heatTable}
        withTableBorder
        withColumnBorders
      >
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Crisis</th>
            <th>Sustainability</th>
            <th>Motivation</th>
          </tr>
        </thead>

        <tbody>
          {visibleRows.map((c) => (
            <tr key={c.id}>
              <td className={styles.nameCell}>
                {c.name}
              </td>
              <Cell value={c.crisis_management} />
              <Cell value={c.sustainability} />
              <Cell value={c.team_motivation} />
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Footer controls */}
      <Group justify="space-between" mt="sm">

        <Text size="sm">
          Showing {start + 1}-{end} of {total}
        </Text>

        <Group gap="xs">
          <Button size="xs" onClick={prevPage} disabled={page === 0}>
            Prev
          </Button>
          <Button size="xs" onClick={nextPage} disabled={end >= total}>
            Next
          </Button>
        </Group>

      </Group>
    </Card>
  );
}
