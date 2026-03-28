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

// /history-event-images/
export async function GetHistoryImages(historyId) {
  return await axios.get(`/history-event-images/?history_event=${historyId}`);
}

export async function AddHistoryImage(historyId, data) {
  return await axios.post(`/history-events/${historyId}/images/`, data);
}

export async function DeleteHistoryImageById(id) {
  return await axios.delete(`/history-event-images/${id}/`);
}
