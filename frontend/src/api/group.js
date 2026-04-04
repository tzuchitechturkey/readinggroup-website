import axios from "./axios";

export async function GetGroups() {
  return await axios.get(`/accounts/groups/`);
}

export async function CreateGroup(data) {
  return await axios.post(`/accounts/groups/`, data);
}

export async function GetGroupById(id) {
  return await axios.get(`/accounts/groups/${id}/`);
}

export async function EditGroupById(id, data) {
  return await axios.put(`/accounts/groups/${id}/`, data);
}

export async function PatchGroupById(id, data) {
  return await axios.patch(`/accounts/groups/${id}/`, data);
}

export async function DeleteGroupById(id) {
  return await axios.delete(`/accounts/groups/${id}/`);
}
