// api/social.js - Social Media Links API

import axios from "./axios";

export async function GetSocialLinks(limit, offset) {
  return await axios.get(`/social-media/?limit=${limit}&offset=${offset}`);
}

export async function CreateSocialLink(data) {
  return await axios.post(`/social-media/`, data);
}

export async function EditSocialLink(id, data) {
  return await axios.put(`/social-media/${id}/`, data);
}

export async function PatchEventById(id, data) {
  return await axios.patch(`/social-media/${id}/`, data);
}

export async function DeleteSocialLink(id) {
  return await axios.delete(`/social-media/${id}/`);
}
