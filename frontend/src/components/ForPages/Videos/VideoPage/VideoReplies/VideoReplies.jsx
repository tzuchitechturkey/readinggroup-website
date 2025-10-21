import React, { useState, useEffect, useRef } from "react";

import { ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { useTranslation } from "react-i18next";

function VideoReplies({ data, initiallyOpen = false }) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(Boolean(initiallyOpen));
  const [height, setHeight] = useState(0);
  const panelRef = useRef(null);
  const idRef = useRef(`replies-panel-${Math.random().toString(36).slice(2)}`);
  const panelId = idRef.current;

  const replies = Array.isArray(data?.replies) ? data.replies : [];
  const count =
    typeof data?.repliesCount === "number" ? data.repliesCount : replies.length;

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const next = open ? el.scrollHeight : 0;
    setHeight(next);
  }, [open, replies]);

  const toggle = () => setOpen((v) => !v);

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="mt-3 flex items-center gap-2 text-primary hover:scale-105 transition-all duration-200 text-sm"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <ChevronDown
          className={`size-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
        <span>
          {count} {t("Replies")}
        </span>
      </button>

      <div
        id={panelId}
        className="overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height }}
        ref={panelRef}
      >
        <ul className="mt-3 space-y-6">
          {replies.length === 0 ? (
            <li className="text-gray-500 text-sm py-2">
              {t("No replies", { defaultValue: "No replies" })}
            </li>
          ) : (
            replies.map((r) => (
              <li key={r.id || r._id} className="flex items-start gap-3">
                {r.avatar ? (
                  <img
                    src={r.avatar}
                    alt={r.writer || "avatar"}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-200" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium text-gray-900 text-sm">
                      {r.writer || t("User", { defaultValue: "User" })}
                    </span>
                    {r.timeAgo && (
                      <span className="text-gray-500">{r.timeAgo}</span>
                    )}
                    {r.edited && (
                      <span className="text-gray-400">
                        ({t("edited", { defaultValue: "edited" })})
                      </span>
                    )}
                  </div>
                  {r.text && (
                    <p className="mt-1 text-[15px] text-gray-800 leading-relaxed">
                      {r.text}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-5 text-gray-600">
                    {typeof r.likes === "number" && (
                      <span className="flex items-center gap-1 text-sm">
                        <ThumbsUp className="size-5" />
                        <span className="text-xs">{r.likes}</span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default VideoReplies;
