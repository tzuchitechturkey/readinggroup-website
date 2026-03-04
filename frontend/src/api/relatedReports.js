import axios from "./axios";

// /related-reports/?limit=10&offset=0&search=
export async function GetRelatedReports(
  limit,
  offset,
  search = "",
  ordering = "",
) {
  return await axios.get(
    `/related-reports/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`,
  );
}
// /related-reports/ data = {title, description, ,happend_at, images external_link}
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

// /related-reports/category/
export async function GetRelatedReportCategories(
  limit,
  offset,
  search = "",
  ordering = "",
) {
  return await axios.get(
    `/related-reports/category/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`,
  );
}

// /related-reports/category/
export async function CreateRelatedReportCategoryById(data) {
  return await axios.post(`/related-reports/category/`, data);
}

// /related-reports/category/{id}/
export async function EditRelatedReportCategoryById(id, data) {
  return await axios.put(`/related-reports/category/${id}/`, data);
}

// /related-reports/category/{id}/
export async function DeleteRelatedReportCategoryById(id) {
  return await axios.delete(`/related-reports/category/${id}/`);
}

// /related-reports/category/{id}/reports/
export async function GetRelatedReportsByCategoryId(
  categoryId,
  limit,
  offset,
  search = "",
  ordering = "",
) {
  return await axios.get(
    `/related-reports/category/${categoryId}/reports/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`,
  );
}
