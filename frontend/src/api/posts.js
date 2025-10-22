import axios from "./axios";

export async function GetPosts(limit, offset, search) {
  return await axios.get(
    `/posts/?limit=${limit}&offset=${offset}&search=${search}`
  );
}
export async function GetPostsbyFilter(limit, offset, filter) {
  return await axios.get(
    `/posts/?limit=${limit}&offset=${offset}&filter=${filter}`
  );
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
