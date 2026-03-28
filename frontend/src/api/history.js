import axios from "./axios";

export async function GetHistory(limit, offset, search = "") {
  return await axios.get(
    `/history-events/?limit=${limit}&offset=${offset}&search=${search}`,
  );
}

export async function CreateHistory(data) {
  return await axios.post(`/history-events/`, data);
}

export async function GetHistoryById(id) {
  return await axios.get(`/history-events/${id}/`);
}

export async function EditHistoryById(id, data) {
  return await axios.put(`/history-events/${id}/`, data);
}

export async function DeleteHistoryById(id) {
  return await axios.delete(`/history-events/${id}/`);
}
