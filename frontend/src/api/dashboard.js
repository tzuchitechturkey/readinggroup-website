import axios from "./axios";

export async function GetStatistics() {
  return await axios.get(`/top-stats/`);
}

// Reorder Sections
export async function ReorderSections(orderedSections) {
  const queryParams = orderedSections.map(
    (section) => `${section.sectionName}=${section.order}`
  );

  const queryString = queryParams.join(",");

  // نرسل الطلب مع كل الأقسام
  return await axios.get(`/top-stats/?order=${queryString}`);
}
