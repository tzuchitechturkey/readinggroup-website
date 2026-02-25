import axios from "./axios";

export async function GetLearn(limit, offset = 0, filters = {}) {
  // Build query string from filters
  const params = new URLSearchParams();
  // Add pagination
  params.append("limit", limit);
  params.append("offset", offset);

  // Add search term
  if (filters.search) params.append("search", filters.search);

  // Add filter parameters
  if (filters.created_at) params.append("created_at", filters.created_at);
  if (filters.category) params.append("category", filters.category);
  if (filters.learn_type) params.append("learn_type", filters.learn_type);

  return await axios.get(`/learn/?${params.toString()}`);
}

export async function CreateLearn(data) {
  return await axios.post(`/learn/`, data);
}

export async function GetLearnById(id) {
  return await axios.get(`/learn/${id}/`);
}

export async function EditLearnById(id, data) {
  return await axios.put(`/learn/${id}/`, data);
}

export async function PatchLearnById(id, data) {
  return await axios.patch(`/learn/${id}/`, data);
}

export async function DeleteLearnById(id) {
  return await axios.delete(`/learn/${id}/`);
}

// Categories
export async function GetLearnCategories(limit = 20, offset = 0, search = "") {
  return await axios.get(
    `/learn-categories/?limit=${limit}&offset=${offset}&search=${search}`,
  );
}

export async function SortLearnCategories(data) {
  return await axios.post(`/learn-categories/reorder/`, data);
}

export async function AddLearnCategory(data) {
  return await axios.post(`/learn-categories/`, data);
}

export async function EditLearnCategoryById(id, data) {
  return await axios.put(`/learn-categories/${id}/`, data);
}

export async function GetLearnCategoryById(id) {
  return await axios.get(`/learn-categories/${id}/`);
}

export async function DeleteLearnCategory(id) {
  return await axios.delete(`/learn-categories/${id}/`);
}

// Get All Item By Category Id
export async function GetLearnsByCategoryId(
  categoryId,
  limit = 10,
  offset = 0,
  params = {},
) {
  return await axios.get(
    `/learn-categories/${categoryId}/learns/?limit=${limit}&offset=${offset}`,
    { params },
  );
}

export async function GetLearnCategoriesByType(type) {
  return await axios.get(`/learn-categories/by-type/?type=${type}`);
}
