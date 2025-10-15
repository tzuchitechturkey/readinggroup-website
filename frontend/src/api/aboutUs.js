import axios from "./axios";

export async function GetHistory(limit, offset, search = "") {
  return await axios.get(
    `/history/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateHistory(data) {
  return await axios.post(`/history/`, data);
}

export async function GetHistoryById(id) {
  return await axios.get(`/history/${id}`);
}

export async function EditHistoryById(id, data) {
  return await axios.put(`/history/${id}`, data);
}

export async function DeleteHistoryById(id) {
  return await axios.delete(`/history/${id}`);
}

export async function GetTeam(limit, offset, search) {
  return await axios.get(
    `/team/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateTeam(data) {
  return await axios.post(`/team/`, data);
}

export async function GetTeamById(id) {
  return await axios.get(`/team/${id}`);
}

export async function EditTeamById(id, data) {
  return await axios.put(`/team/${id}`, data);
}

export async function DeleteTeamById(id) {
  return await axios.delete(`/team/${id}`);
}
