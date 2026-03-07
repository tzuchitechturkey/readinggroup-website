import axios from "./axios";

// /collections/?limit=10&offset=0&search=
export async function GetCollections(
  limit,
  offset,
  search = "",
  ordering = "",
) {
  return await axios.get(
    `/photo-collection/?limit=${limit}&offset=${offset}&search=${search}&ordering=${ordering}`,
  );
}
// /collections/ data = {title, description, image , happedned_at}
export async function CreateCollection(data) {
  return await axios.post(`/photo-collection/`, data);
}

// /collections/{id}/
export async function GetCollectionById(id) {
  return await axios.get(`/photo-collection/${id}/`);
}

// /collections/{id}/
export async function EditCollectionById(id, data) {
  return await axios.put(`/photo-collection/${id}/`, data);
}

// /collections/{id}/
export async function DeleteCollectionById(id) {
  return await axios.delete(`/photo-collection/${id}/`);
}

// /collections/{id}/photos/ data = images.length = 28 we dont need pagination in this endpoints
export async function GetPhotosByCollectionId(id, data) {
  return await axios.get(`/photo-collection/${id}/photos/`, data);
}

// /collections/{id}/photos/ data = {images: []}
export async function AddPhotoToCollection(id, data) {
  return await axios.post(`/photo-collection/${id}/photos/`, data);
}

// Edit Photo in collection /collections/{id}/photos/{photo_id}/ data = {image}
export async function EditPhotoInCollection(collection_id, photo_id, data) {
  return await axios.put(
    `/photo-collection/${collection_id}/photos/${photo_id}/`,
    data,
  );
}

// Delete Photo from collection /photos/{photo_id}/
export async function DeletePhotoFromCollection(photo_id) {
  return await axios.delete(`/photos/${photo_id}/`);
}

// get ALl Images
export async function GetAllImages() {
  return await axios.get(`/photo-collection/images/`);
}

// /photo-collection/last-4-photos/
export async function GetLast4Photos() {
  return await axios.get(`/photo-collection/last-4-photos/`);
}
