import axios from "./axios";

export async function GetPosts(limit, offset, search) {
  return await axios.get(
    `/posts/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function CreatePost(data) {
  return await axios.post(`/posts/`, data);
}

export async function GetPostById(id) {
  return await axios.get(`/posts/${id}`);
}

export async function EditPostById(id, data) {
  return await axios.put(`/posts/${id}`, data);
}

export async function DeletePostById(id) {
  return await axios.delete(`/posts/${id}`);
}
