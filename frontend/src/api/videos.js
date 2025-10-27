import axios from "./axios";

export async function GetVideos(limit, offset, search) {
  return await axios.get(
    `/videos/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function GetVideosByFilter(limit, offset, params = {}) {
  const queryParams = new URLSearchParams();

  queryParams.append("limit", limit);
  queryParams.append("offset", offset);

  if (params.search) queryParams.append("search", params.search);
  if (params.video_type) queryParams.append("video_type", params.video_type);
  if (params.language) queryParams.append("language", params.language);
  if (params.category) queryParams.append("category", params.category);
  if (params.happened_at) queryParams.append("happened_at", params.happened_at);

  return await axios.get(`/videos/?${queryParams.toString()}`);
}

export async function CreateVideo(data) {
  return await axios.post(`/videos/`, data);
}

export async function GetVideoById(id) {
  return await axios.get(`/videos/${id}/`);
}

export async function EditVideoById(id, data) {
  return await axios.put(`/videos/${id}/`, data);
}

export async function DeleteVideoById(id) {
  return await axios.delete(`/videos/${id}/`);
}

// /video-categories/
export async function GetAllVideoCategories() {
  return await axios.get(`/video-categories/`);
}

export async function GetVideoCategories(limit = 10, offset = 0, search = "") {
  return await axios.get(
    `/video-categories/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

export async function AddVideoCategory(data) {
  return await axios.post(`/video-categories/`, data);
}

export async function EditVideoCategoryById(id, data) {
  return await axios.put(`/video-categories/${id}/`, data);
}

export async function GetVideoCategoryById(id) {
  return await axios.get(`/video-categories/${id}/`);
}

export async function DeleteVideoCategory(id) {
  return await axios.delete(`/video-categories/${id}/`);
}

// /top5-videos/
export async function GetTop5Videos() {
  return await axios.get(`/top5-videos/`);
}

// Top 5 videos by likes
export async function GetTopViewedVideos() {
  return await axios.get(`/top5-videos-by-likes/`);
}

// /top1-video/
export async function GetTop1Video() {
  return await axios.get(`/top1-video/`);
}

// /my-listed-videos/
export async function GetMyListedVideos(limit, offset, search) {
  return await axios.get(
    `/my-listed-videos/?limit=${limit}&offset=${offset}&search=${search}`
  );
}

// Like a video
export async function LikeVideo(data) {
  return await axios.post(`/likes/videos/`, data);
}

export async function UnlikeVideo(data) {
  return await axios.delete(`/likes/videos/`, data);
}

// Comments management for videos
export async function GetVideoComments(videoId, limit = 10, offset = 0) {
  return await axios.get(
    `/comments/?limit=${limit}&offset=${offset}&object_id=${videoId}&content_type=video`
  );
}

export async function CreateVideoComment(videoId, text) {
  const userId = localStorage.getItem("userId");
  return await axios.post(`/comments/`, {
    object_id: videoId,
    content_type: "video",
    text,
    user: userId,
  });
}

export async function DeleteVideoComment(commentId) {
  return await axios.delete(`/comments/${commentId}/`);
}

export async function EditVideoComment(commentId, text) {
  return await axios.patch(`/comments/${commentId}/`, { text });
}

// Replies management for video comments
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
