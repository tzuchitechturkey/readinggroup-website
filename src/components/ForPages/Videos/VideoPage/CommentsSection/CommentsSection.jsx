import React, { useState, useRef, useEffect } from "react";

import Picker from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import VideoReplies from "@/components/ForPages/Videos/VideoPage/VideoReplies/VideoReplies";

function CommentsSection({ comments: incomingComments, selectedId }) {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // 🌟 الاستماع للنقر خارج المكون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiObject) => {
    setComment((prev) => prev + emojiObject.emoji);
  };
  // بيانات افتراضية
  const defaultComments = [
    {
      id: "c1",
      author: "Jenny Wilson",
      avatar: "../../../src/assets/Beared Guy02-min 1.png",
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 242,
      repliesCount: 15,
      replies: [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/50?img=1",
          author: "Ali Ahmed",
          timeAgo: "2h ago",
          edited: false,
          text: "أنا أعتقد أن الحل المناسب هو استخدام useEffect.",
          likes: 4,
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/50?img=2",
          author: "Sara Mohamed",
          timeAgo: "30m ago",
          edited: true,
          text: "تم تعديل ردي ليكون أوضح 🙂",
          likes: 2,
        },
        {
          id: 3,
          author: "Anonymous",
          timeAgo: "Just now",
          text: "شكراً على الطرح!",
        },
      ],
    },
    {
      id: "c2",
      author: "Jenny Wilson",
      avatar: "../../../src/assets/Beared Guy02-min 1.png",
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 242,
      repliesCount: 15,
      replies: [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/50?img=1",
          author: "Ali Ahmed",
          timeAgo: "2h ago",
          edited: false,
          text: "أنا أعتقد أن الحل المناسب هو استخدام useEffect.",
          likes: 4,
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/50?img=2",
          author: "Sara Mohamed",
          timeAgo: "30m ago",
          edited: true,
          text: "تم تعديل ردي ليكون أوضح 🙂",
          likes: 2,
        },
        {
          id: 3,
          author: "Anonymous",
          timeAgo: "Just now",
          text: "شكراً على الطرح!",
        },
      ],
    },
    {
      id: "c3",
      author: "Jenny Wilson",
      avatar: "../../../src/assets/Beared Guy02-min 1.png",
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 242,
      repliesCount: 15,
    },
  ];

  const comments = incomingComments || defaultComments;

  return (
    <div className="bg-white">
      {/* Start Comment Editor */}
      <div className="  mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex items-start gap-3 relative">
          <img
            src="../../../src/assets/Beared Guy02-min 1.png"
            alt="me"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full placeholder:text-xl border-b outline-none focus:border-blue-500 transition-colors py-2 text-xl text-text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex items-center justify-between mt-3 relative">
              {/* Start Emoju Button */}
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowPicker(!showPicker)}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <path d="M9 9h.01M15 9h.01" />
                </svg>
              </button>
              {/* End Emoju Button */}

              {/* Start Emoji Picker */}
              {showPicker && (
                <div ref={pickerRef} className="absolute top-10 left-0 z-50">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              {/* End Emojy Picker */}

              {/* Start Buttons */}
              <div className="flex items-center gap-3 ml-auto">
                <button className="text-sm text-gray-600 hover:text-gray-800">
                  {t("Cacel")}
                </button>
                <button className="text-sm bg-primary border-[1px] border-primary hover:bg-white hover:text-primary transition-all duration-200 text-white px-3 py-1.5 rounded">
                  {t("Comment")}
                </button>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>

      {/* Start Comments List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ul className="space-y-10">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`relative ${
                selectedId === c.id ? "ring-2 ring-sky-400 rounded" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={c.avatar}
                  alt={c.author}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 ">
                    {/* Start Writer Name */}
                    <span className="font-semibold text-xl text-gray-900">
                      {c.author}
                    </span>
                    {/* End Writer Name */}
                    {/* Start Date */}
                    <span className="text-gray-500">{c.timeAgo}</span>
                    {/* End Date */}
                    {/* Start Edited marker */}
                    {c.edited && (
                      <span className="text-gray-400 text-xs">
                        ({t("Edited")})
                      </span>
                    )}
                    {/* End Edited marker */}
                  </div>

                  {/* Start Comment Content */}
                  <p className="mt-1 text-lg text-gray-800 leading-relaxed">
                    {c.text}
                  </p>
                  {/* End Comment Content */}

                  {/* Start Actions */}
                  <div className="mt-3 flex items-center gap-6 text-gray-600">
                    <button className="flex items-center gap-2 hover:text-black">
                      <ThumbsUp className="size-5" />
                      <span className="text-xs">{c.likes}</span>
                    </button>

                    <button className="flex items-center  gap-2 hover:text-black">
                      <ThumbsDown className="size-5" />
                      <span className="text-xs">{c.dislikes}</span>
                    </button>
                    <button className="text-xs hover:text-black">
                      {t("Reply")}
                    </button>
                  </div>
                  {/* End Actions */}

                  {/* Start Replies */}
                  <VideoReplies data={c} />
                  {/* End Replies */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* End Comments List */}
    </div>
  );
}

export default CommentsSection;
