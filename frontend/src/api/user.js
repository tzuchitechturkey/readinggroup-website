import axios from "./axios";

export async function GetUsers() {
  return await axios.get(`/accounts/admin/users/`);
}

export async function CreateUser(data) {
  return await axios.post(`/accounts/admin/users/`, data);
}

export async function GetUserById(id) {
  return await axios.get(`/accounts/admin/users/${id}/`);
}

export async function EditUserById(id, data) {
  return await axios.put(`/accounts/admin/users/${id}/`, data);
}

export async function PatchUserById(id, data) {
  return await axios.patch(`/accounts/admin/users/${id}/`, data);
}

export async function DeleteUserById(id) {
  return await axios.delete(`/accounts/admin/users/${id}/`);
}
