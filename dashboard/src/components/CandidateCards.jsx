import { 
  Card, Title, Text, Grid, Group, Badge, Button, Select, TextInput 
} from "@mantine/core";
import { useState, useMemo } from "react";
import styles from "../styles/CandidateCards.module.css";

const shareCandidate = (c) => {
  const body = `
Candidate Details

Name: ${c.name}
Email: ${c.email}
Experience: ${c.experience} years
Skills: ${c.skills}

Crisis Management Score: ${c.crisis_management}
Sustainability Score: ${c.sustainability}
Team Motivation Score: ${c.team_motivation}

Total Score: ${c.total_score}
Ranking: ${c.ranking}
`;

  window.location.href =
    `mailto:hr@email.com?subject=Candidate Profile - ${c.name}&body=${encodeURIComponent(body)}`;
};

export default function CandidateCards({ data }) {
  const [perPage, setPerPage] = useState(6);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("ranking");
  const [search, setSearch] = useState("");

  const processedData = useMemo(() => {
    let filtered = data.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "ranking") filtered.sort((a, b) => a.ranking - b.ranking);
    if (sortBy === "id") filtered.sort((a, b) => a.id - b.id);
    if (sortBy === "experience") filtered.sort((a, b) => b.experience - a.experience);

    return filtered;
  }, [data, sortBy, search]);

  const total = processedData.length;
  const start = page * perPage;
  const end = Math.min(start + perPage, total);

  const visible = processedData.slice(start, end);

  return (
    <>
      {/* Header controls */}
      <Card style={{ marginTop: "2rem", boxShadow: "0 10px 25px skyblue" }}>
      <Group justify="space-between" mb="sm" >
        <Title order={3}>Candidate Profiles</Title>

        <Group gap="xs">

          <TextInput
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(0);
            }}
            size="xs"
            className={styles.searchInput}
          />

          <Select
            data={[
              { value: "ranking", label: "Sort by Rank" },
              { value: "id", label: "Sort by ID" },
              { value: "experience", label: "Sort by Experience" },
            ]}
            value={sortBy}
            onChange={(v) => {
              setSortBy(v);
              setPage(0);
            }}
            size="xs"
            className={styles.rowsSelect}
          />

          <Select
            data={["6", "12", "24"]}
            value={String(perPage)}
            onChange={(v) => {
              setPerPage(Number(v));
              setPage(0);
            }}
            size="xs"
            className={styles.rowsSelect}
          />
        </Group>
      </Group>

      <Grid>
        {visible.map((c) => (
          <Grid.Col key={c.id} span={{ base: 12, sm: 6, md: 4 }}>

            <Card className={styles.card} shadow="sm" radius="lg">

              <Group justify="space-between" mb="xs">
                <Text fw={700}>{c.name}</Text>
                <Badge>Rank #{c.ranking}</Badge>
              </Group>

              <Text size="sm" className={styles.line}>📧 {c.email}</Text>
              <Text size="sm" className={styles.line}>Experience: {c.experience} yrs</Text>
              <Text size="sm" className={styles.line}>Skills: {c.skills}</Text>

              <div className={styles.scores}>
                <span>Crisis Management Score: <b>{c.crisis_management}</b></span>
                <span>Sustainability Score: <b>{c.sustainability}</b></span>
                <span>Team Motivation Score: <b>{c.team_motivation}</b></span>
              </div>

              <Group justify="space-between" mt="sm">
                <Text fw={600}>Total Score: {c.total_score}</Text>
                <Text fw={600}>ID: {c.id}</Text>
              </Group>

              <Button fullWidth mt="md" onClick={() => shareCandidate(c)}>
                Share Candidate
              </Button>

            </Card>

          </Grid.Col>
        ))}
      </Grid>

      {/* Pagination */}
      <Group justify="space-between" mt="md">
        <Text size="sm">
          Showing {start + 1}-{end} of {total}
        </Text>

        <Group gap="xs">
          <Button size="xs" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            Prev
          </Button>
          <Button size="xs" disabled={end >= total} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </Group>
      </Group>
      </Card>
    </>
  );
}
