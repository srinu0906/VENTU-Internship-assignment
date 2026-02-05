const BASE_URL = "http://localhost:5000";

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/leaderboard`);
  return JSON.parse(await res.text());
};

export const getCandidates = async () => {
  const res = await fetch(`${BASE_URL}/candidates`);
  return JSON.parse(await res.text());
};
