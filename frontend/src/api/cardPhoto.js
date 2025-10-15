import axios from "./axios";

export async function GetMediaCards(limit, offset, search, ordering) {
  return await axios.get(
    `/media-cards/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`
  );
}

export async function CreateMediaCard(data) {
  return await axios.post(`/media-cards/`, data);
}

export async function GetMediaCardById(id) {
  return await axios.get(`/media-cards/${id}`);
}

export async function EditMediaCardById(id, data) {
  return await axios.put(`/media-cards/${id}`, data);
}

export async function DeleteMediaCardById(id) {
  return await axios.delete(`/media-cards/${id}`);
}
