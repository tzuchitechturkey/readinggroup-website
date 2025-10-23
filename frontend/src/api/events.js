import axios from "./axios";

export async function GetEvents(limit, offset, search) {
  return await axios.get(
    `/events/?limit=${limit}&offset=${offset}&search=${search}`
  );
}
export async function GetEventsbyFilter(limit, offset, filter) {
  return await axios.get(
    `/events/?limit=${limit}&offset=${offset}&filter=${filter}`
  );
}

export async function CreateEvent(data) {
  return await axios.post(`/events/`, data);
}

export async function GetEventById(id) {
  return await axios.get(`/events/${id}/`);
}

export async function EditEventById(id, data) {
  return await axios.put(`/events/${id}/`, data);
}

export async function DeleteEventById(id) {
  return await axios.delete(`/events/${id}/`);
}

// Categories
export async function GetEventCategories(limit, offset, search = "") {
  return await axios.get(
    `/event-categories/?limit=${limit}&offset=${offset}&search=${search}`
  );
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

// Sections
export async function GetEventSections(limit, offset, search = "") {
  return await axios.get(
    `/event-sections/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function AddEventSection(data) {
  return await axios.post(`/event-sections/`, data);
}

export async function EditEventSectionById(id, data) {
  return await axios.put(`/event-sections/${id}/`, data);
}

export async function GetEventSectionById(id) {
  return await axios.get(`/event-sections/${id}/`);
}

export async function DeleteEventSection(id) {
  return await axios.delete(`/event-sections/${id}/`);
}
