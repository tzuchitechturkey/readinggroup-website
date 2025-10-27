import React, { useState, useRef, useEffect } from "react";

import Picker from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import { ThumbsUp, Loader } from "lucide-react";
import { toast } from "react-toastify";

import PostVideoReplies from "@/components/ForPages/Videos/VideoPage/VideoReplies/VideoReplies";
import {
  GetPostComments,
  CreatePostComment,
  DeletePostComment,
  EditPostComment,
  LikeComment,
  UnlikeComment,
} from "@/api/posts";

function PostCommentsSection({ postId }) {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const commentsPerPage = 5;

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

  // Load comments
  useEffect(() => {
    if (postId) {
      loadComments(0);
    }
  }, [postId]);

  const loadComments = async (page = 0) => {
    setIsLoadingComments(true);
    try {
      const res = await GetPostComments(
        postId,
        commentsPerPage,
        page * commentsPerPage
      );
      if (page === 0) {
        setComments(res.data?.results || []);
      } else {
        setComments((prev) => [...prev, ...(res.data?.results || [])]);
      }
      setTotalComments(res.data?.count || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load comments:", error);
      toast.error(t("Failed to load comments"));
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setComment((prev) => prev + emojiObject.emoji);
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.error(t("Comment cannot be empty"));
      return;
    }

    setIsSubmittingComment(true);
    try {
      await CreatePostComment(postId, comment.trim());
      setComment("");
      setShowPicker(false);
      toast.success(t("Comment added successfully"));
      // Reload comments
      loadComments(0);
    } catch (error) {
      console.error("Failed to create comment:", error);
      toast.error(t("Failed to add comment"));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await DeletePostComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success(t("Comment deleted successfully"));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error(t("Failed to delete comment"));
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    try {
      if (isLiked) {
        await UnlikeComment(commentId);
      } else {
        await LikeComment(commentId);
      }

      // Update local state
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              is_liked: !c.is_liked,
              likes_count: isLiked ? c.likes_count - 1 : c.likes_count + 1,
            };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Failed to like comment:", error);
      toast.error(t("Failed to update like"));
    }
  };

  const loadMoreComments = () => {
    loadComments(currentPage + 1);
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
              placeholder={t("Add a comment...")}
              className="w-full placeholder:text-sm border-b outline-none focus:border-blue-500 transition-colors py-1 text-sm text-text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
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
                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmittingComment || !comment.trim()}
                  className="text-xs bg-primary border-[1px] border-primary hover:bg-white hover:text-primary transition-all duration-200 text-white px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {isSubmittingComment && <Loader className="w-3 h-3 animate-spin" />}
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
        {isLoadingComments && currentPage === 0 ? (
          <div className="flex justify-center py-10">
            <Loader className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : comments.length > 0 ? (
          <ul className="space-y-7">
            {comments.map((c) => (
              <li key={c.id} className="relative py-6">
                <div className="flex items-start gap-2">
                  <img
                    src={c.avatar || "/Beared Guy02-min 1.png"}
                    alt={c.user}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {/* Start Writer Name */}
                      <span className="font-semibold text-sm text-gray-900">
                        {c.user}
                      </span>
                      {/* End Writer Name */}
                      {/* Start Date */}
                      <span className="text-gray-400 text-xs">{c.created_at}</span>
                      {/* End Date */}
                    </div>

                    {/* Start Comment Content */}
                    <p className="mt-1 text-sm text-gray-800 leading-snug">{c.text}</p>
                    {/* End Comment Content */}

                    {/* Start Actions */}
                    <div className="mt-2 flex items-center gap-4 text-gray-600 text-xs">
                      <button
                        className={`flex items-center gap-1 ${
                          c.is_liked
                            ? "bg-primary text-white rounded px-2 py-0.5"
                            : "hover:text-black"
                        }`}
                        onClick={() => handleLikeComment(c.id, c.is_liked)}
                      >
                        <ThumbsUp
                          className="w-4 h-4"
                          {...(c.is_liked
                            ? { fill: "currentColor", stroke: "none" }
                            : {})}
                        />
                        <span className={`text-xs ${c.is_liked ? "text-white" : ""}`}>
                          {c.likes_count || 0}
                        </span>
                      </button>

                      <button
                        className="text-xs hover:text-black"
                        onClick={() => {
                          // TODO: Implement reply functionality
                        }}
                      >
                        {t("Reply")}
                      </button>

                      <button
                        className="text-xs hover:text-red-500"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        {t("Delete")}
                      </button>
                    </div>
                    {/* End Actions */}

                    {/* Start Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <PostVideoReplies
                        replies={c.replies}
                        commentId={c.id}
                      />
                    )}
                    {/* End Replies */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {t("No comments yet")}
          </div>
        )}

        {/* Load More Button */}
        {comments.length < totalComments && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadMoreComments}
              disabled={isLoadingComments}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingComments && <Loader className="w-4 h-4 animate-spin" />}
              {t("Load More Comments")}
            </button>
          </div>
        )}
      </div>
      {/* End Comments List */}
    </div>
  );
}

export default PostCommentsSection;
