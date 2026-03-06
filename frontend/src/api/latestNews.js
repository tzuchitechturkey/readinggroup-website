import axios from "./axios";

// /latest-news/?limit=10&offset=0&search=
export async function GetLatestNews(limit, offset, search = "", ordering = "") {
  return await axios.get(
    `/latest-news/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`,
  );
}
// /latest-news/ data = {title, description, ,happend_at, images}
export async function CreateLatestNews(data) {
  return await axios.post(`/latest-news/`, data);
}

// /latest-news/{id}/
export async function GetLatestNewsById(id) {
  return await axios.get(`/latest-news/${id}/`);
}

// /latest-news/{id}/
export async function EditLatestNewsById(id, data) {
  return await axios.put(`/latest-news/${id}/`, data);
}

// /latest-news/{id}/
export async function DeleteLatestNewsById(id) {
  return await axios.delete(`/latest-news/${id}/`);
}

// /latest-news/{id}/images/
export async function AddImagesToLatestNews(newsId, data) {
  return await axios.post(`/latest-news/${newsId}/images/`, data);
}
