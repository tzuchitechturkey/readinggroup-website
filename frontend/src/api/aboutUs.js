import axios from "./axios";

export async function GetHistory(limit, offset, search = "") {
  return await axios.get(
    `/history/?limit=${limit}&offset=${offset}&search=${search}`,
  );
}

export async function CreateHistory(data) {
  return await axios.post(`/history/`, data);
}

export async function GetHistoryById(id) {
  return await axios.get(`/history/${id}/`);
}

export async function EditHistoryById(id, data) {
  return await axios.put(`/history/${id}/`, data);
}

export async function DeleteHistoryById(id) {
  return await axios.delete(`/history/${id}/`);
}

export async function GetTeam(limit, offset, search = "") {
  return await axios.get(
    `/our-team/?limit=${limit}&offset=${offset}&search=${search}`,
  );
}

export async function CreateTeam(data) {
  return await axios.post(`/our-team/`, data);
}

export async function GetTeamById(id) {
  return await axios.get(`/our-team/${id}/`);
}

export async function EditTeamById(id, data) {
  return await axios.put(`/our-team/${id}/`, data);
}

export async function DeleteTeamById(id) {
  return await axios.delete(`/our-team/${id}/`);
}

// /our-team-images/
export async function GetTeamImages(teamId) {
  return await axios.get(`/our-team/${teamId}/images/`);
}

// /our-team-images/
export async function AddImagesToTeam(teamId, data) {
  return await axios.post(`/our-team/${teamId}/images/`, data);
}

// /our-team-images/{id}/
export async function EditTeamImage(photoId, data) {
  return await axios.put(`/our-team-images/${photoId}/`, data);
}

// Delete Photo from collection /our-team-images/{id}/
export async function DeletePhotoFromTeam(photo_id) {
  return await axios.delete(`/our-team-images/${photo_id}/`);
}
