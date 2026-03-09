import axios from "./axios";

export async function GetVideos(limit, offset, search = "", filters = {}) {
  const params = {
    limit,
    offset,
    search,
    ...filters,
  };
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return await axios.get(`/videos/?${queryString}`);
}

export async function GetVideosByFilter(limit, offset, params = {}) {
  const queryParams = new URLSearchParams();

  queryParams.append("limit", limit);
  queryParams.append("offset", offset);

  if (params.search) queryParams.append("search", params.search);
  if (params.video_type) queryParams.append("video_type", params.video_type);
  // if (params.language) queryParams.append("language", params.language);
  if (params.category) {
    // Handle categories as array or single value
    // if (Array.isArray(params.category)) {
    //   params.category.forEach((catId) => queryParams.append("category", catId));
    // }
    // else {
    queryParams.append("category", params.category);
    // }
  }
  if (params.happened_at) queryParams.append("happened_at", params.happened_at);
  // if (params.is_featured) queryParams.append("is_featured", params.is_featured);
  // if (params.is_new) queryParams.append("is_new", params.is_new);
  if (params.is_weekly_moment !== undefined && params.is_weekly_moment !== null)
    queryParams.append("is_weekly_moment", params.is_weekly_moment);

  return await axios.get(`/videos/?${queryParams.toString()}`);
}

export async function CreateVideo(data) {
  return await axios.post(`/videos/`, data);
}

export async function FetchYouTubeInfo(data) {
  return await axios.post(`/videos/fetch-youtube-info/`, data);
}

export async function GetVideoById(id) {
  return await axios.get(`/videos/${id}/`);
}

export async function EditVideoById(id, data) {
  return await axios.put(`/videos/${id}/`, data);
}

export async function PatchVideoById(id, data) {
  return await axios.patch(`/videos/${id}/`, data);
}

export async function DeleteVideoById(id) {
  return await axios.delete(`/videos/${id}/`);
}

// /video-categories/
export async function GetVideoCategories(limit = 10, offset = 0, search = "") {
  return await axios.get(
    `/video-categories/?limit=${limit}&offset=${offset}&search=${search}`,
  );
}

export async function SortVideoCategories(data) {
  return await axios.post(`/video-categories/reorder/`, data);
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

// Get All Item By Category Id
export async function GetVideosByCategoryId(
  categoryId,
  limit = 10,
  offset = 0,
) {
  return await axios.get(
    `/video-categories/${categoryId}/videos/?limit=${limit}&offset=${offset}`,
  );
}

// // Top Rating
// export async function GetTopRatingVideos() {
//   return await axios.get(`/videos/top-rated/`);
// }

// // /top5-videos/
export async function GetTopViewedVideos(videoId) {
  return await axios.get(`/videos/${videoId}/top-views/`);
}

// // Top 5 videos by likes
// export async function GetTopLikedVideos() {
//   return await axios.get(`/videos/top-liked/?limit=5`);
// }

// // Random Published Videos
// export async function GetRandomPublishedVideos(limit, offset) {
//   return await axios.get(`/videos/published/?limit=${limit}&offset=${offset}`);
// }

// /videos/by_type_video/
export async function GetVideosByTypeVideo(type) {
  return await axios.get(`/videos/by_type_video/?type_video=${type}/`);
}
