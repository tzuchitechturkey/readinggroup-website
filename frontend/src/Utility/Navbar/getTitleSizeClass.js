// Get image container class based on item count
const getImageSizeClass = (itemCount) => {
  if (itemCount <= 2) {
    return "h-32";
  }
  if (itemCount <= 4) {
    return "h-24";
  }
  if (itemCount <= 6) {
    return "h-20";
  }
  return "h-16";
};

// Get title text size based on item count
const getTitleSizeClass = (itemCount) => {
  if (itemCount <= 2) {
    return "text-sm";
  }
  if (itemCount <= 4) {
    return "text-xs";
  }
  return "text-xs";
};

// Get item size class based on number of items
const getItemSizeClass = (itemCount) => {
  if (itemCount <= 2) {
    // 1-2 items: larger
    return "w-40 h-48";
  }
  if (itemCount <= 4) {
    // 3-4 items: medium
    return "w-32 h-40";
  }
  if (itemCount <= 6) {
    // 5-6 items: small-medium
    return "w-28 h-32";
  }
  // 7-8 items: normal
  return "w-24 h-28";
};
export { getTitleSizeClass, getImageSizeClass, getItemSizeClass };
