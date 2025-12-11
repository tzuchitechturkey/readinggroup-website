import axios from "./axios";

export async function GetEvents(limit, offset, status, params = {}) {
  const queryParams = new URLSearchParams();

  queryParams.append("limit", limit);
  queryParams.append("offset", offset);
  queryParams.append("status", status);

  if (params.search) queryParams.append("search", params.search);
  if (params.ordering) queryParams.append("ordering", params.ordering);
  if (params.section) queryParams.append("section", params.section);
  if (params.report_type) queryParams.append("report_type", params.report_type);
  if (params.category) queryParams.append("category", params.category);
  if (params.country) queryParams.append("country", params.country);
  if (params.writer) queryParams.append("writer", params.writer);
  if (params.language) queryParams.append("language", params.language);
  if (params.happened_at) queryParams.append("happened_at", params.happened_at);
  if (params.is_weekly_moment !== undefined)
    queryParams.append("is_weekly_moment", params.is_weekly_moment);
  return await axios.get(`/events/?${queryParams.toString()}`);
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

export async function PatchEventById(id, data) {
  return await axios.patch(`/events/${id}/`, data);
}

export async function DeleteEventById(id) {
  return await axios.delete(`/events/${id}/`);
}
// Get All Item By cAteogir Id
export async function GetItemsByCategoryId(categoryId, limit, offset) {
  return await axios.get(
    `/event-categories/${categoryId}/events/?limit=${limit}&offset=${offset}`
  );
}
// /top5-videos/
export async function GetTop5Event() {
  return await axios.get(`/events/top-viewed/?limit=5`);
}

export async function GetTopSections() {
  return await axios.get(`/event-sections/top-with-events/`);
}

export async function GetTop5BySections() {
  return await axios.get(
    `/event-sections/top-with-top-liked/?limit=3&events_limit=5`
  );
}

// Categories
export async function GetEventCategories(limit, offset, search = "") {
  return await axios.get(
    `/event-categories/?limit=${limit}&offset=${offset}&search=${search}`
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
export async function GetTopEventsViewed() {
  return await axios.get(`/events/top-viewed/`);
}
export async function GetTopEventsLastPosted() {
  return await axios.get(`/events/last-posted/`);
}
export async function GetTopEventsCommented() {
  return await axios.get(`/events/top-commented/`);
}

// Gettags
export async function GetEventTags() {
  return await axios.get(`/events/tags/`);
}
