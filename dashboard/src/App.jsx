import { useEffect, useState } from "react";
import { Container } from "@mantine/core";
import { getLeaderboard, getCandidates } from "./api/DbService";

import Header from "./components/Header";
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import SkillHeatmap from "./components/SkillHeatmap";
import CandidateCards from "./components/CandidateCards";

import "./App.css";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      getLeaderboard().then(setLeaderboard);
      getCandidates().then(setCandidates);
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }


  return (
    <Container size="lg" mt="xl" style={{scrollMarginTop:"200px"}}>
      <Header onLogout={() => setLoggedIn(false)} />

      <div id="leaderboard">
        <Leaderboard data={leaderboard} />
      </div>

      <div id="cards">
        <CandidateCards data={candidates} />
      </div>

      <div id="heatmap">
        <SkillHeatmap data={candidates} />
      </div>


    </Container>
  );
}

export default App;
