import axios from "./axios";

// /related-reports/?limit=10&offset=0&search=
export async function GetRelatedReports(limit, offset, search = "") {
  return await axios.get(
    `/related-reports/?limit=${limit}&offset=${offset}&search=${search}`,
  );
}

// /related-reports/ data = {title, description, video_url, duration, etc}
export async function CreateRelatedReport(data) {
  return await axios.post(`/related-reports/`, data);
}

// /related-reports/{id}/
export async function GetRelatedReportById(id) {
  return await axios.get(`/related-reports/${id}/`);
}

// /related-reports/{id}/
export async function EditRelatedReportById(id, data) {
  return await axios.put(`/related-reports/${id}/`, data);
}

// /related-reports/{id}/
export async function DeleteRelatedReportById(id) {
  return await axios.delete(`/related-reports/${id}/`);
}

// Fetch YouTube information from URL
export async function FetchYouTubeInfo(data) {
  return await axios.post(`/related-reports/fetch-youtube-info/`, data);
}

// /related-reports/category/
export async function GetRelatedReportCategories(
  limit,
  offset,
  search = "",
  ordering = "",
) {
  return await axios.get(
    `/related-reports-categories/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`,
  );
}

// /related-reports-categories/
export async function CreateRelatedReportCategoryById(data) {
  return await axios.post(`/related-reports-categories/`, data);
}

// /related-reports-categories/{id}/
export async function EditRelatedReportCategoryById(id, data) {
  return await axios.put(`/related-reports-categories/${id}/`, data);
}

// /related-reports-categories/{id}/
export async function DeleteRelatedReportCategoryById(id) {
  return await axios.delete(`/related-reports-categories/${id}/`);
}

// /related-reports-categories/{id}/reports/
export async function GetRelatedReportsByCategoryId(
  categoryId,
  limit,
  offset,
  search = "",
  ordering = "",
) {
  return await axios.get(
    `/related-reports-categories/${categoryId}/reports/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`,
  );
}

// /related-reports/fetch-youtube-info/
export async function FetchYouTubeInfoByUrl(video_url) {
  return await axios.post(`/related-reports/fetch-youtube-info/`, {
    video_url,
  });
}
