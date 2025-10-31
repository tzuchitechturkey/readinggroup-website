import axios from "./axios";

export async function HomeData() {
  return await axios.get(`/top-liked-combined/`);
}
