import axios from "./axios";

export async function GetEvents(limit, offset, params = {}) {
  const queryParams = new URLSearchParams();

  queryParams.append("limit", limit);
  queryParams.append("offset", offset);

  if (params.search) queryParams.append("search", params.search);
  // if (params.language) queryParams.append("language", params.language);
  if (params.start_event_date) queryParams.append("start_event_date", params.start_event_date);
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

export async function GetTopSections() {
  return await axios.get(`/event-sections/top-with-events/`);
}

export async function GetTop5BySections() {
  return await axios.get(
    `/event-sections/top-with-top-liked/?limit=3&events_limit=5`,
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

// Sections
export async function GetEventSections(limit, offset, search = "") {
  return await axios.get(
    `/event-sections/?limit=${limit}&offset=${offset}&search=${search}`,
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

// /top5-events-sections/
export async function GetTop5EventsBySectionId(sectionId) {
  return await axios.get(`event-sections/${sectionId}/events/`);
}

// Like Event
export async function LikeEvent(data) {
  return await axios.post(`/likes/events/`, data);
}

export async function UnlikeEvent(data) {
  return await axios.delete(`/likes/events/`, { data });
}

// Comment a Event
export async function GetCommentEvent(data) {
  return await axios.get(`/comments/events/`, data);
}

export async function CommentEvent(data) {
  return await axios.post(`/comments/events/`, data);
}

export async function EditCommentEvent(data) {
  return await axios.put(`/comments/events/`, data);
}

export async function DeleteCommentEvent(data) {
  return await axios.delete(`/comments/events/`, data);
}

// top
export async function GetTopEventsLiked() {
  return await axios.get(`/events/top-liked/`);
}

export async function GetTopEventsLastPosted() {
  return await axios.get(`/events/last-posted/`);
}
export async function GetTopEventsCommented() {
  return await axios.get(`/events/top-commented/`);
}

export async function GetTop5ViewedEvent() {
  return await axios.get(`/events/top-viewed/?limit=5`);
}

// Gettags
export async function GetEventTags() {
  return await axios.get(`/events/tags/`);
}
// Random Published Videos
export async function GetRandomPublishedEvents(limit, offset) {
  return await axios.get(`/events/?limit=10&offset=0&status=published`);
}
