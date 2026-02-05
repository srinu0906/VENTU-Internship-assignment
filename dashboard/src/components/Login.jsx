import { Card, TextInput, Button, Title, Text } from "@mantine/core";
import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card} shadow="md">

        <Title order={2} mb="md">Recycling Manager Selection Dashboard Login</Title>

        <TextInput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />

        <TextInput
          mt="sm"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        {error && <Text c="red" size="sm" mt="sm">{error}</Text>}

        <Button fullWidth mt="md" onClick={handleLogin}>
          Login
        </Button>

        <Text size="xs" mt="sm" c="dimmed">
          Demo → admin / 1234
        </Text>

      </Card>
    </div>
  );
}
