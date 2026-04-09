import axios from "./axios";

export async function GetEvents(limit, offset, params = {}) {
  const queryParams = new URLSearchParams();

  queryParams.append("limit", limit);
  queryParams.append("offset", offset);

  if (params.search) queryParams.append("search", params.search);
  // if (params.language) queryParams.append("language", params.language);
  if (params.start_event_date)
    queryParams.append("start_event_date", params.start_event_date);
  return await axios.get(`/event-communities/?${queryParams.toString()}`);
}
// /events/?limit=10&offset=0&status=published

export async function CreateEvent(data) {
  return await axios.post(`/event-communities/`, data);
}

export async function GetEventById(id) {
  return await axios.get(`/event-communities/${id}/`);
}

export async function EditEventById(id, data) {
  return await axios.put(`/event-communities/${id}/`, data);
}

export async function PatchEventById(id, data) {
  return await axios.patch(`/event-communities/${id}/`, data);
}

export async function DeleteEventById(id) {
  return await axios.delete(`/event-communities/${id}/`);
}

// Get All Item By cAteogir Id
export async function GetEventsByCategoryId(
  categoryId,
  limit = 10,
  offset = 0,
) {
  return await axios.get(
    `/event-categories/${categoryId}/events/?limit=${limit}&offset=${offset}`,
  );
}

// Categories
export async function GetEventCategories(limit, offset, search = "") {
  return await axios.get(
    `/event-categories/?limit=${limit}&offset=${offset}&search=${search}`,
  );
}

export async function SortEventCategories(data) {
  return await axios.post(`/event-categories/reorder/`, data);
}

export async function AddEventCategory(data) {
  return await axios.post(`/event-categories/`, data);
}

export async function EditEventCategoryById(id, data) {
  return await axios.put(`/event-categories/${id}/`, data);
}

export async function GetEventCategoryById(id) {
  return await axios.get(`/event-categories/${id}/`);
}

export async function DeleteEventCategory(id) {
  return await axios.delete(`/event-categories/${id}/`);
}

// /event-communities/event-months/
export async function GetEventMonths() {
  return await axios.get(`/event-communities/event-months/`);
}

// /event-community-images/
export async function UploadEventImage(data) {
  return await axios.post(`/event-community-images/`, data);
}

export async function DeleteEventImage(id) {
  return await axios.delete(`/event-community-images/${id}/`);
}

// Nested image endpoints under an event
export async function AddEventImage(eventId, data) {
  return await axios.post(`/event-communities/${eventId}/images/`, data);
}

export async function DeleteEventImageByEventId(eventId, imageId) {
  return await axios.delete(
    `/event-communities/${eventId}/images/${imageId}/delete/`,
  );
}
 