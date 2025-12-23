// Build content item href based on type
const getContentHref = (item, categoryType) => {
  switch (categoryType) {
    case "content":
      return `/contents/content/${item.id}`;
    case "video":
      return `/videos/${item.id}`;
    case "post":
      return `/cards-photos/card/${item.id}`;
    case "event":
      // Use external link if available, otherwise use event detail page
      return item.external_link || `/events/${item.id}`;
    default:
      return "#";
  }
};

export default getContentHref;
