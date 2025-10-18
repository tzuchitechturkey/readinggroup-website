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
