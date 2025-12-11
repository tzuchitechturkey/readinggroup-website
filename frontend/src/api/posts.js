import axios from "./axios";

export async function GetPosts(limit, offset = 0, status, filters = {}) {
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
  if (filters.post_type) params.append("post_type", filters.post_type);
  if (filters.language) params.append("language", filters.language);
  if (
    filters.is_weekly_moment !== undefined &&
    filters.is_weekly_moment !== null
  )
    params.append("is_weekly_moment", filters.is_weekly_moment);

  return await axios.get(`/posts/?status=${status}&${params.toString()}`);
}

export async function CreatePost(data) {
  return await axios.post(`/posts/`, data);
}

export async function GetPostById(id) {
  return await axios.get(`/posts/${id}/`);
}

export async function EditPostById(id, data) {
  return await axios.put(`/posts/${id}/`, data);
}

export async function PatchPostById(id, data) {
  return await axios.patch(`/posts/${id}/`, data);
}

export async function DeletePostById(id) {
  return await axios.delete(`/posts/${id}/`);
}

// Categories
export async function GetPostCategories(limit, offset, search = "") {
  return await axios.get(
    `/post-categories/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function SortPostCategories(data) {
  return await axios.post(`/post-categories/reorder/`, data);
}

export async function AddPostCategory(data) {
  return await axios.post(`/post-categories/`, data);
}

export async function EditPostCategoryById(id, data) {
  return await axios.put(`/post-categories/${id}/`, data);
}

export async function GetPostCategoryById(id) {
  return await axios.get(`/post-categories/${id}/`);
}

export async function DeletePostCategory(id) {
  return await axios.delete(`/post-categories/${id}/`);
}

// Get All Item By cAteogir Id
export async function GetItemsByCategoryId(categoryId, limit, offset) {
  return await axios.get(
    `/post-categories/${categoryId}/posts/?limit=${limit}&offset=${offset}`
  );
}

// Comments management for posts
export async function GetPostComments(limit = 10, offset = 0, postId) {
  return await axios.get(
    `/comments/?limit=${limit}&offset=${offset}&object_id=${postId}&content_type=post`
  );
}

export async function CreatePostComment(postId, text) {
  const userId = localStorage.getItem("userId");
  return await axios.post(`/comments/`, {
    object_id: postId,
    content_type: "post",
    text,
    user: userId,
  });
}

export async function DeletePostComment(commentId) {
  return await axios.delete(`/comments/${commentId}/`);
}

export async function EditPostComment(commentId, text) {
  return await axios.patch(`/comments/${commentId}/`, { text });
}

// Replies management for post comments
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
export async function TopCommentedPosts() {
  return await axios.get(`/posts/top-commented/?limit=5`);
}

// it Gieves to data card_photo And reading
export async function TopLikedPosts() {
  return await axios.get(`/posts/top-liked/`);
}

export async function TopViewedPosts() {
  return await axios.get(`/posts/top-viewed/?limit=5`);
}

// Rating
export async function RatingPosts(postId, rating) {
  return await axios.post(`/posts/${postId}/rating/`, rating);
}

// Weekly Moment Posts
export async function WeeklyMomentPosts(type, limit = 5, offset = 0) {
  return await axios.get(
    `/posts/weekly-moments/?post_type=${type}&limit=${limit}&offset=${offset}`
  );
}

// not used
// export async function WeeklyReadingPosts() {
//   return await axios.get(`/posts/top-viewed/?limit=5`);
// }
