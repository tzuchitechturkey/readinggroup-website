// api/social.js - Social Media Links API

import axios from "./axios";

export async function GetWebSiteInfo() {
  return await axios.get(`/site-info/`);
}

export async function AddNavbar(data) {
  return await axios.post(`/navbar-logos/`, data);
}

export async function EditNavbar(logoId, data) {
  return await axios.put(`/navbar-logos/${logoId}`, data);
}

export async function AddSocialMedia(data) {
  return await axios.post(`/social-media/`, data);
}

export async function EditSocialMedia(id, data) {
  return await axios.put(`/social-media/${id}/`, data);
}

export async function PatchSocialMedia(id, data) {
  return await axios.patch(`/social-media/${id}/`, data);
}

export async function DeleteSocialMedia(id) {
  return await axios.delete(`/social-media/${id}/`);
}

export async function GlobalSearch(limit, offset, query) {
  return await axios.get(
    `/global-search/?limit=${limit}&offset=${offset}&q=${query}`
  );
}

export async function GetAllUsers(search) {
  return await axios.get(`/user/users/?search=${search}`);
}
