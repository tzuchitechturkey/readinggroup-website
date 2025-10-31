import axios from "./axios";

export async function GetStatistics() {
  return await axios.get(`/top-stats/`);
}
