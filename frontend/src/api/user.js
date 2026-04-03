import axios from "./axios";

export async function GetUsers(params = {}) {
  const { limit, offset, search } = params || {};
  return await axios.get(`/accounts/admin/users/`, {
    params: {
      ...(typeof limit === "number" ? { limit } : {}),
      ...(typeof offset === "number" ? { offset } : {}),
      ...(search ? { search } : {}),
    },
  });
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
  return await axios.delete(`/accounts/admin/users/${id}/delete/`);
}
