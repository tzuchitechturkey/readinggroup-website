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

// /other-latest-news/ GET
export async function GetOtherLatestNews(currentNewsId) {
  return await axios.get(`/latest-news/${currentNewsId}/random-others/`);
}

// Delete Photo from collection /latest-news-images/{photo_id}/
export async function DeletePhotoFromNews(photo_id) {
  return await axios.delete(`/latest-news-images/${photo_id}/`);
}

// DELETE /latest-news/{id}/images/delete/  body: { image_ids: [1,2,3] }
export async function DeleteImagesFromLatestNews(newsId, imageIds = []) {
  return await axios.delete(`/latest-news/${newsId}/images/delete/`, {
    data: { image_ids: imageIds },
  });
}
