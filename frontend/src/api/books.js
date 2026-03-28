import axios from "./axios";

export async function GetBook() {
  return await axios.get(`/book/`);
}

export async function CreateBook(data) {
  return await axios.post(`/book/`, data);
}

export async function GetBookById(id) {
  return await axios.get(`/book/${id}/`);
}

export async function EditBookById(id, data) {
  return await axios.put(`/book/${id}/`, data);
}

export async function PatchBookById(id, data) {
  return await axios.patch(`/book/${id}/`, data);
}

export async function DeleteBookById(id) {
  return await axios.delete(`/book/${id}/`);
}

// /book-reviews/
export async function GetBookReviews() {
  return await axios.get(`/book-reviews/`);
}

export async function AddBookReview(data) {
  return await axios.post(`/book-reviews/`, data);
}

export async function GetBookReviewById(id) {
  return await axios.get(`/book-reviews/${id}/`);
}

export async function EditBookReviewById(id, data) {
  return await axios.put(`/book-reviews/${id}/`, data);
}

export async function PatchBookReviewById(id, data) {
  return await axios.patch(`/book-reviews/${id}/`, data);
}

export async function DeleteBookReviewById(id) {
  return await axios.delete(`/book-reviews/${id}/`);
}
