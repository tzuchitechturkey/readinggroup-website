import axios from "./axios";

export async function GetContents(limit, offset = 0, status, filters = {}) {
  // Build query string from filters
  const params = new URLSearchParams();
  // Add pagination
  params.append("limit", limit);
  params.append("offset", offset);

  // Add search term
  if (filters.search) params.append("search", filters.search);

  // Add filter parameters
  if (filters.created_at) params.append("created_at", filters.created_at);
  if (filters.writer) params.append("writer", filters.writer);
  if (filters.category) params.append("category", filters.category);
  if (filters.language) params.append("language", filters.language);
  return await axios.get(`/contents/?status=${status}&${params.toString()}`);
}

export async function CreateContent(data) {
  return await axios.post(`/contents/`, data);
}

export async function GetContentById(id) {
  return await axios.get(`/contents/${id}/`);
}

export async function EditContentById(id, data) {
  return await axios.put(`/contents/${id}/`, data);
}

export async function PatchContentById(id, data) {
  return await axios.patch(`/contents/${id}/`, data);
}

export async function DeleteContentById(id) {
  return await axios.delete(`/contents/${id}/`);
}

export async function GetContentCategories(limit, offset, search = "") {
  return await axios.get(
    `/content-categories/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

// Category
export async function AddContentCategory(data) {
  return await axios.post(`/content-categories/`, data);
}

export async function EditContentCategoryById(id, data) {
  return await axios.put(`/content-categories/${id}/`, data);
}

export async function GetContentCategoryById(id) {
  return await axios.get(`/content-categories/${id}/`);
}

export async function DeleteContentCategory(id) {
  return await axios.delete(`/content-categories/${id}/`);
}

// Comments management for posts
export async function GetContentComments(limit = 10, offset = 0, postId) {
  return await axios.get(
    `/comments/?limit=${limit}&offset=${offset}&object_id=${postId}&content_type=content`
  );
}

export async function CreateContentComment(postId, text) {
  const userId = localStorage.getItem("userId");
  return await axios.post(`/comments/`, {
    object_id: postId,
    content_type: "content",
    text,
    user: userId,
  });
}

export async function DeleteContentComment(commentId) {
  return await axios.delete(`/comments/${commentId}/`);
}

export async function EditContentComment(commentId, text) {
  return await axios.patch(`/comments/${commentId}/`, { text });
}

// Replies management for content comments
export async function GetCommentReplies(commentId) {
  return await axios.get(`/replies/?comment=${commentId}`);
}

export async function CreateCommentReply(commentId, text) {
  const userId = localStorage.getItem("userId");
  return await axios.post(`/replies/`, {
    comment: commentId,
    text,
    user: userId,
  });
}

export async function DeleteCommentReply(replyId) {
  return await axios.delete(`/replies/${replyId}/`);
}

export async function EditCommentReply(replyId, text) {
  return await axios.patch(`/replies/${replyId}/`, { text });
}

// Likes for comments
export async function LikeComment(commentId) {
  return await axios.post(`/comments/${commentId}/like/`);
}

export async function UnlikeComment(commentId) {
  return await axios.delete(`/comments/${commentId}/like/`);
}

// Likes for replies
export async function LikeReply(replyId) {
  return await axios.post(`/replies/${replyId}/like/`);
}

export async function UnlikeReply(replyId) {
  return await axios.delete(`/replies/${replyId}/like/`);
}

// TOP
export async function TopCommentedContents() {
  return await axios.get(`/content/top-commented/?limit=5`);
}

// it Gieves to data card_photo And reading
export async function TopLikedContents() {
  return await axios.get(`/contents/top-liked/`);
}

export async function TopViewedContents() {
  return await axios.get(`/contents/top-viewed/`);
}

// Rating
export async function RatingContent(contentId, rating) {
  return await axios.post(`/contents/${contentId}/rating/`, rating);
}
