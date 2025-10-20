import axios from "./axios";

export async function GetVideos(limit, offset, search) {
  return await axios.get(
    `/videos/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateVideo(data) {
  return await axios.post(`/videos/`, data);
}

export async function GetVideoById(id) {
  return await axios.get(`/videos/${id}/`);
}

export async function EditVideoById(id, data) {
  return await axios.put(`/videos/${id}/`, data);
}

export async function DeleteVideoById(id) {
  return await axios.delete(`/videos/${id}/`);
}

export async function GetAllVideoCategories() {
  return await axios.get(`/video-categories/`);
}

export async function GetVideoCategories(limit, offset, search = "") {
  return await axios.get(
    `/video-categories/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function AddVideoCategory(data) {
  return await axios.post(`/video-categories/`, data);
}

export async function EditVideoCategoryById(id, data) {
  return await axios.put(`/video-categories/${id}/`, data);
}

export async function GetVideoCategoryById(id) {
  return await axios.get(`/video-categories/${id}/`);
}

export async function DeleteVideoCategory(id) {
  return await axios.delete(`/video-categories/${id}/`);
}
