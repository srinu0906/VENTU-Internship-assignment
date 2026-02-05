import { Group, Button, Text } from "@mantine/core";
import styles from "../styles/Header.module.css";

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

export default function Header({ onLogout }) {
  return (
    <div className={styles.header}>

      <Text fw={800} size="xl" c="blue">
        Recycling Manager Selection Dashboard
      </Text>

      <Group gap="sm">

        <Button
          className={styles.navBtn}
          onClick={() => scrollTo("leaderboard")}
        >
          Leaderboard
        </Button>

        <Button
          className={styles.navBtn}
          onClick={() => scrollTo("cards")}
        >
          Candidates
        </Button>

        <Button
          className={styles.navBtn}
          onClick={() => scrollTo("heatmap")}
        >
          Skill Heatmap
        </Button>

        {/* Logout */}
        <Button
          className={styles.logoutBtn}
          onClick={onLogout}
        >
          Logout
        </Button>

      </Group>

    </div>
  );
}
