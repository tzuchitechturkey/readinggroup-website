import axios from "./axios";

export async function GetTvPrograms(limit, offset, search) {
  return await axios.get(
    `/tv-programs/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateTvProgram(data) {
  return await axios.post(`/tv-programs/`, data);
}

export async function GetTvProgramById(id) {
  return await axios.get(`/tv-programs/${id}/`);
}

export async function EditTvProgramById(id, data) {
  return await axios.put(`/tv-programs/${id}/`, data);
}

export async function DeleteTvProgramById(id) {
  return await axios.delete(`/tv-programs/${id}/`);
}

export async function GetAllTvCategories() {
  return await axios.get(`/tvprogram-categories/`);
}

export async function GetTvCategories(limit, offset) {
  return await axios.get(
    `/tvprogram-categories/?limit=${limit}&offset=${offset}`
  );
}

export async function AddTvCategory(data) {
  return await axios.post(`/tvprogram-categories/`, data);
}

export async function EditTvCategoryById(id, data) {
  return await axios.put(`/tvprogram-categories/${id}/`, data);
}

export async function GetTvCategoryById(id) {
  return await axios.get(`/tvprogram-categories/${id}/`);
}

export async function DeleteTvCategory(id) {
  return await axios.delete(`/tvprogram-categories/${id}/`);
}
