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
      writer: "Jenny Wilson",
      avatar: "/Beared Guy02-min 1.png",
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 242,
      repliesCount: 15,
      replies: [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/50?img=1",
          writer: "Ali Ahmed",
          timeAgo: "2h ago",
          edited: false,
          text: "أنا أعتقد أن الحل المناسب هو استخدام useEffect.",
          likes: 4,
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/50?img=2",
          writer: "Sara Mohamed",
          timeAgo: "30m ago",
          edited: true,
          text: "تم تعديل ردي ليكون أوضح 🙂",
          likes: 2,
        },
        {
          id: 3,
          writer: "Anonymous",
          timeAgo: "Just now",
          text: "شكراً على الطرح!",
        },
      ],
    },
    {
      id: "c2",
      writer: "Jenny Wilson",
      avatar: "/Beared Guy02-min 1.png",
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 242,
      repliesCount: 15,
      replies: [
        {
          id: 1,
          avatar: "https://i.pravatar.cc/50?img=1",
          writer: "Ali Ahmed",
          timeAgo: "2h ago",
          edited: false,
          text: "أنا أعتقد أن الحل المناسب هو استخدام useEffect.",
          likes: 4,
        },
        {
          id: 2,
          avatar: "https://i.pravatar.cc/50?img=2",
          writer: "Sara Mohamed",
          timeAgo: "30m ago",
          edited: true,
          text: "تم تعديل ردي ليكون أوضح 🙂",
          likes: 2,
        },
        {
          id: 3,
          writer: "Anonymous",
          timeAgo: "Just now",
          text: "شكراً على الطرح!",
        },
      ],
    },
    {
      id: "c3",
      writer: "Jenny Wilson",
      avatar: "/Beared Guy02-min 1.png",
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 242,
      repliesCount: 15,
    },
  ];

  const comments = incomingComments || defaultComments;
  // keep a local, mutable copy so we can update likes UI without mutating props
  const [localComments, setLocalComments] = useState(() =>
    comments.map((c) => ({ ...c, liked: false, disliked: false }))
  );

  // sync when incomingComments changes
  useEffect(() => {
    setLocalComments(
      comments.map((c) => ({ ...c, liked: false, disliked: false }))
    );
  }, [incomingComments]);

  const handleLike = (id) => {
    setLocalComments((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nowLiked = !item.liked;
        const currentLikes = Number(item.likes || 0);
        const newLikes = nowLiked
          ? currentLikes + 1
          : Math.max(0, currentLikes - 1);
        // If implementing mutual exclusivity with dislike later, handle here.
        return { ...item, liked: nowLiked, likes: newLikes };
      })
    );
  };

  // reply UI state
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const toggleReply = (id) => {
    if (replyOpenId === id) {
      setReplyOpenId(null);
      setReplyText("");
    } else {
      setReplyOpenId(id);
      setReplyText("");
    }
  };

  const handleReplySubmit = (id) => {
    if (!replyText.trim()) return;
    setLocalComments((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newReply = {
          id: `r-${Date.now()}`,
          avatar: "https://i.pravatar.cc/50?img=12",
          writer: "You",
          timeAgo: "Just now",
          edited: false,
          text: replyText.trim(),
          likes: 0,
        };
        const replies = Array.isArray(item.replies)
          ? [...item.replies, newReply]
          : [newReply];
        return { ...item, replies };
      })
    );
    setReplyOpenId(null);
    setReplyText("");
  };

  return (
    <div className="bg-white">
      {/* Start Comment Editor */}
      <div className="w-full px-4 sm:px-6 lg:px-12 py-6">
        <div className="flex items-start gap-3 relative">
          <img
            src="/Beared Guy02-min 1.png"
            alt="me"
            className="w-7 h-7 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full placeholder:text-sm border-b outline-none focus:border-blue-500 transition-colors py-1 text-sm text-text"
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
                  className="w-4 h-4"
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
              <div className="flex items-center gap-2 ml-auto">
                <button className="text-xs bg-primary border-[1px] border-primary hover:bg-white hover:text-primary transition-all duration-200 text-white px-2 py-1 rounded">
                  {t("Comment")}
                </button>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>

      {/* Start Comments List */}
      <div className="w-full px-4 sm:px-6 lg:px-12 pb-10">
        <ul className="space-y-7">
          {localComments.map((c) => (
            <li
              key={c.id}
              className={`relative py-6 ${
                selectedId === c.id ? "ring-2 ring-sky-400 rounded" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <img
                  src={c.avatar}
                  alt={c.writer}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 ">
                    {/* Start Writer Name */}
                    <span className="font-semibold text-sm text-gray-900">
                      {c.writer}
                    </span>
                    {/* End Writer Name */}
                    {/* Start Date */}
                    <span className="text-gray-400 text-xs">{c.timeAgo}</span>
                    {/* End Date */}
                    {/* Start Edited marker */}
                    {c.edited && (
                      <span className="text-gray-400 text-2xs">
                        ({t("Edited")})
                      </span>
                    )}
                    {/* End Edited marker */}
                  </div>

                  {/* Start Comment Content */}
                  <p className="mt-1 text-sm text-gray-800 leading-snug">
                    {c.text}
                  </p>
                  {/* End Comment Content */}

                  {/* Start Actions */}
                  <div className="mt-2 flex items-center gap-4 text-gray-600 text-xs">
                    <button
                      className={`flex items-center gap-1 ${
                        c.liked
                          ? "bg-primary text-white rounded px-2 py-0.5"
                          : "hover:text-black"
                      }`}
                      onClick={() => handleLike(c.id)}
                      aria-pressed={c.liked}
                    >
                      {/* show filled icon by setting fill=currentColor and stroke=none when liked */}
                      <ThumbsUp
                        className="w-4 h-4"
                        {...(c.liked
                          ? { fill: "currentColor", stroke: "none" }
                          : {})}
                      />
                      <span
                        className={`text-xs ${c.liked ? "text-white" : ""}`}
                      >
                        {c.likes}
                      </span>
                    </button>

                    <button
                      className="text-xs hover:text-black"
                      onClick={() => toggleReply(c.id)}
                    >
                      {t("Reply")}
                    </button>
                  </div>
                  {/* End Actions */}

                  {/* Start Replies */}
                  <VideoReplies data={c} />
                  {/* End Replies */}
                  {/* Reply input area */}
                  {replyOpenId === c.id && (
                    <div className="mt-2 flex items-start gap-2">
                      <img
                        src="/Beared Guy02-min 1.png"
                        alt="me"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={t("Write a reply...")}
                          className="w-full placeholder:text-sm border-b outline-none focus:border-blue-500 transition-colors py-1 text-sm text-text"
                        />
                        <div className="mt-1 flex gap-2">
                          <button
                            className="text-xs bg-primary text-white px-2 py-0.5 rounded"
                            onClick={() => handleReplySubmit(c.id)}
                          >
                            {t("Send")}
                          </button>
                          <button
                            className="text-xs text-gray-500 px-2 py-0.5 rounded"
                            onClick={() => toggleReply(c.id)}
                          >
                            {t("Cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
