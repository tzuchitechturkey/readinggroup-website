import axios from "./axios";

export async function GetAttachments(limit, offset, search = "") {
  return await axios.get(
    `/content-attachments/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateAttachments(data) {
  return await axios.post(`/content-attachments/`, data);
}

export async function GetAttachmentById(id) {
  return await axios.get(`/content-attachments/${id}/`);
}

export async function EditAttachmentById(id, data) {
  return await axios.put(`/content-attachments/${id}/`, data);
}

export async function PatchAttachmentById(id, data) {
  return await axios.patch(`/content-attachments/${id}/`, data);
}

export async function DeleteAttachmentById(id) {
  return await axios.delete(`/content-attachments/${id}/`);
}
