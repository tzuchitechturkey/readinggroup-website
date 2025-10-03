import { resolveAsset } from "@/utils/assetResolver";

const defaultPoster = resolveAsset("authback.jpg");
const topOne = resolveAsset("1-top5.jpg");
const topTwo = resolveAsset("2-top5.jpg");
const topThree = resolveAsset("3-top5.jpg");
const topFour = resolveAsset("4-top5.jpg");
const defaultAvatar = resolveAsset("Beared Guy02-min 1.png");

export const mockVideos = [
  {
    id: 1,
    title: "Tzu Chi Visits Syrian Lands",
    duration: "1h 28min",
    category: "Humanitarian",
    type: "Full Videos",
    subject: "Documentary",
    language: "Arabic",
    image: defaultPoster,
    views: "132,757",
    timeAgo: "22 hours ago",
    featured: true,
    isNew: true,
    number: "1",
    videoUrl: "https://www.youtube.com/watch?v=VzE-RyrBJTU",
  },
  {
    id: 2,
    title: "Weekly Reading Circle",
    duration: "45min",
    category: "Reading",
    type: "Unit Video",
    subject: "Literature",
    language: "Arabic",
    image: topOne,
    views: "8,234",
    timeAgo: "3 days ago",
    featured: false,
    isNew: false,
    number: "2",
    videoUrl: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: 3,
    title: "Environmental Workshop",
    duration: "1h 15min",
    category: "Learning",
    type: "Full Videos",
    subject: "Environment",
    language: "Chinese",
    image: topTwo,
    views: "15,642",
    timeAgo: "1 week ago",
    featured: true,
    isNew: true,
    number: "3",
    videoUrl: "https://www.youtube.com/watch?v=example3",
  },
  {
    id: 4,
    title: "Health Discussion",
    duration: "35min",
    category: "Health News",
    type: "Unit Video",
    subject: "Health",
    language: "Arabic",
    image: topThree,
    views: "12,891",
    timeAgo: "5 days ago",
    featured: false,
    isNew: false,
    number: "4",
    videoUrl: "https://www.youtube.com/watch?v=example4",
  },
  {
    id: 5,
    title: "Community Activity",
    duration: "50min",
    category: "Activity",
    type: "Full Videos",
    subject: "Community",
    language: "Arabic",
    image: topFour,
    views: "6,743",
    timeAgo: "2 weeks ago",
    featured: false,
    isNew: false,
    number: "5",
    videoUrl: "https://www.youtube.com/watch?v=example5",
  },
];

export const topCast = [
  {
    id: 1,
    name: "Volunteers Team",
    image: defaultAvatar,
  },
  {
    id: 2,
    name: "Syrian Families",
    image: defaultAvatar,
  },
  {
    id: 3,
    name: "Musa AL AHMED",
    image: defaultAvatar,
  },
  {
    id: 4,
    name: "ANAS DAAS",
    image: defaultAvatar,
  },
  {
    id: 5,
    name: "AYMEN KALIL",
    image: defaultAvatar,
  },
];
