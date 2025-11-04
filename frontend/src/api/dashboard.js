import axios from "./axios";

export async function GetStatistics() {
  return await axios.get(`/top-stats/`);
}

// Reorder Sections
export async function ReorderSections(orderedSections) {
  return await axios.post(`/event-sections/reorder/`, { sections: orderedSections });
}
