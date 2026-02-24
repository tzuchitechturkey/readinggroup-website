/**
 * Constants used in CreateOrEditPost component
 */

export const POST_TYPE_OPTIONS = [
  { value: "card", label: "Card" },
  { value: "photo", label: "Photo" },
];

export const FORM_DATA_INITIAL_STATE = {
  title: "",
  subtitle: "",
  excerpt: "",
  body: "",
  writer: "",
  writer_avatar: "",
  category: "",
  status: "",
  read_time: "",
  tags: "",
  language: "",
  post_type: "",
  image: null,
  image_url: "",
  metadata: "",
  country: "",
  camera_name: "",
};
