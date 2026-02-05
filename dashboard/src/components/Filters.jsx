import { TextInput, Group, Slider, Card, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export default function Filters({
  search,
  setSearch,
  minTotal,
  setMinTotal,
  minSkill,
  setMinSkill,
}) {
  return (
    <Card shadow="sm" radius="lg" p="md" mt="xl">
      <Group grow align="end">
        <TextInput
          label="Search candidate"
          placeholder="Type name..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <Text size="sm">Min Total Score</Text>
          <Slider
            min={0}
            max={30}
            value={minTotal}
            onChange={setMinTotal}
          />
        </div>

        <div>
          <Text size="sm">Min Skill Score</Text>
          <Slider
            min={0}
            max={10}
            value={minSkill}
            onChange={setMinSkill}
          />
        </div>
      </Group>
    </Card>
  );
}
