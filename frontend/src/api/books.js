import axios from "./axios";

export async function GetBooks(limit = 10, offset = 0, search = "") {
  const params = new URLSearchParams();
  params.append("limit", limit);
  params.append("offset", offset);

  // Add search term
  if (search) params.append("search", search);

  return await axios.get(`/book/?${params.toString()}`);
}

export async function CreateBook(data) {
  return await axios.post(`/book/`, data);
}

export async function GetBookById(id) {
  return await axios.get(`/book/${id}/`);
}

export async function EditBookById(id, data) {
  return await axios.put(`/book/${id}/`, data);
}

export async function PatchBookById(id, data) {
  return await axios.patch(`/book/${id}/`, data);
}

export async function DeleteBookById(id) {
  return await axios.delete(`/book/${id}/`);
}

export async function GetBooksGroups(limit = 10, offset = 0, search = "") {
  return await axios.get(
    `/book-groups/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateBooksGroup(data) {
  return await axios.post(`/book-groups/`, data);
}

export async function GetBooksByGroupId(groupId) {
  return await axios.get(`/book/${groupId}/book-groups`);
}

export async function GetBooksGroupById(id) {
  return await axios.get(`/book-groups/${id}/`);
}

export async function EditBooksGroupById(id, data) {
  return await axios.put(`/book-groups/${id}/`, data);
}

export async function PatchBooksGroupById(id, data) {
  return await axios.patch(`/book-groups/${id}/`, data);
}

export async function DeleteBooksGroupById(id) {
  return await axios.delete(`/book-groups/${id}/`);
}
