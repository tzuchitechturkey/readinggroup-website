import axios from "./axios";

export async function GetAuthors(limit = 10, offset = 0, search = "") {
  const params = new URLSearchParams();
  params.append("limit", limit);
  params.append("offset", offset);

  // Add search term
  if (search) params.append("search", search);

  return await axios.get(`/authors/?${params.toString()}`);
}

export async function CreateAuthor(data) {
  return await axios.post(`/authors/`, data);
}

export async function GetAuthorById(id) {
  return await axios.get(`/authors/${id}/`);
}

export async function EditAuthorById(id, data) {
  return await axios.put(`/authors/${id}/`, data);
}

export async function PatchAuthorById(id, data) {
  return await axios.patch(`/authors/${id}/`, data);
}

export async function DeleteAuthorById(id) {
  return await axios.delete(`/authors/${id}/`);
}
