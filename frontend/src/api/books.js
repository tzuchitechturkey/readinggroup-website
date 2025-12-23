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
    `/book-category/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreateBooksGroup(data) {
  return await axios.post(`/book-category/`, data);
}

export async function SortBooksGroups(data) {
  return await axios.post(`/book-category/reorder/`, data);
}

export async function GetBooksByGroupId(groupId, limit = 10, offset = 0) {
  return await axios.get(
    `/book-category/${groupId}/books/?limit=${limit}&offset=${offset}`
  );
}

export async function GetBooksGroupById(id) {
  return await axios.get(`/book-category/${id}/`);
}

export async function EditBooksGroupById(id, data) {
  return await axios.put(`/book-category/${id}/`, data);
}

export async function PatchBooksGroupById(id, data) {
  return await axios.patch(`/book-category/${id}/`, data);
}

export async function DeleteBooksGroupById(id) {
  return await axios.delete(`/book-category/${id}/`);
}
