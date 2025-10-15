import axios from "./axios";

export async function GetReadings(limit, offset, search) {
  return await axios.get(
    `/readings/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateReading(data) {
  return await axios.post(`/readings/`, data);
}

export async function GetReadingById(id) {
  return await axios.get(`/readings/${id}`);
}

export async function EditReadingById(id, data) {
  return await axios.put(`/readings/${id}`, data);
}

export async function DeleteReadingById(id) {
  return await axios.delete(`/readings/${id}`);
}
