import axios from "./axios";

export async function GetPosts(limit, offset = 0, filters = {}) {
  // Build query string from filters
  const params = new URLSearchParams();
  // Add pagination
  params.append("limit", limit);
  params.append("offset", offset);
  console.log(params, "sssssssssss");

  // Add search term
  if (filters.search) params.append("search", filters.search);

  // Add filter parameters
  if (filters.published_at) params.append("published_at", filters.published_at);
  if (filters.writer) params.append("writer", filters.writer);
  if (filters.category) params.append("category", filters.category);
  if (filters.post_type) params.append("post_type", filters.post_type);
  if (filters.language) params.append("language", filters.language);
  console.log(params.toString());
  return await axios.get(`/posts/?${params.toString()}`);
}

export async function CreatePost(data) {
  return await axios.post(`/posts/`, data);
}

export async function GetPostById(id) {
  return await axios.get(`/posts/${id}/`);
}

export async function EditPostById(id, data) {
  return await axios.put(`/posts/${id}/`, data);
}

export async function DeletePostById(id) {
  return await axios.delete(`/posts/${id}/`);
}

export async function GetAllUsers(search) {
  return await axios.get(`/user/users/?search=${search}`);
}

export async function GetPostCategories(limit, offset, search = "") {
  return await axios.get(
    `/post-categories/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function AddPostCategory(data) {
  return await axios.post(`/post-categories/`, data);
}

export async function EditPostCategoryById(id, data) {
  return await axios.put(`/post-categories/${id}/`, data);
}

export async function GetPostCategoryById(id) {
  return await axios.get(`/post-categories/${id}/`);
}

export async function DeletePostCategory(id) {
  return await axios.delete(`/post-categories/${id}/`);
}
