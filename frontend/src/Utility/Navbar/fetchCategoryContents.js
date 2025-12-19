import { GetContentsByCategoryId } from "@/api/contents";
import { GetPostsByCategoryId } from "@/api/posts";
import { GetVideosByCategoryId } from "@/api/videos";
import { GetEventsByCategoryId } from "@/api/events";

// Fetch category contents dynamically
const fetchCategoryContents = async (
  categoryContents,
  loadingContents,
  setLoadingContents,
  setCategoryContents,
  categoryId,
  categoryType
) => {
  const cacheKey = `${categoryType}-${categoryId}`;

  // If already loaded, don't fetch again
  if (categoryContents[cacheKey]) return;

  // If currently loading, don't fetch again
  if (loadingContents[cacheKey]) return;

  setLoadingContents((prev) => ({ ...prev, [cacheKey]: true }));

  try {
    let response;
    const limit = 8;
    const offset = 0;

    switch (categoryType) {
      case "content":
        response = await GetContentsByCategoryId(categoryId, limit, offset);
        break;
      case "video":
        response = await GetVideosByCategoryId(categoryId, limit, offset);
        break;
      case "post":
        response = await GetPostsByCategoryId(categoryId, limit, offset);
        break;
      case "event":
        response = await GetEventsByCategoryId(categoryId, limit, offset);
        break;
      default:
        return;
    }

    setCategoryContents((prev) => ({
      ...prev,
      [cacheKey]: response?.data?.results || [],
    }));
  } catch (error) {
    console.error(
      `Error fetching ${categoryType} for category ${categoryId}:`,
      error
    );
  } finally {
    setLoadingContents((prev) => ({ ...prev, [cacheKey]: false }));
  }
};

export default fetchCategoryContents;
