import React, { useMemo } from "react";

import { IoMdNotifications } from "react-icons/io";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Note: removed TypeScript type annotations to keep this file plain JSX.
 * If you prefer TypeScript, rename the file to .tsx and add types in the project config.
 */

/**
 * Helpers
 */
function getInitials(text) {
  if (!text) return "N";
  const parts = text.trim().split(/\s+/);
  const first = parts[0] && parts[0][0] ? parts[0][0] : "";
  const last = parts[1] && parts[1][0] ? parts[1][0] : "";
  return (first + last || first || "N").toUpperCase();
}

function UnreadDot({ active }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        active ? "bg-blue-500" : "bg-gray-300 dark:bg-neutral-700"
      }`}
      aria-hidden="true"
    />
  );
}

function Avatar({ src, title }) {
  if (src) {
    return (
      <img
        src={src}
        alt="Sender avatar"
        className="h-8 w-8 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
      aria-hidden="true"
      title="No avatar"
    >
      {getInitials(title)}
    </div>
  );
}

function NotificationItem({ n }) {
  const isUnread = Boolean(n.unread);

  return (
    <DropdownMenuItem
      className={`gap-3 px-3 py-3 focus:bg-gray-50 dark:focus:bg-neutral-800 ${
        isUnread ? "bg-gray-100 dark:bg-neutral-900 rounded-md" : ""
      }`}
    >
      <div className="mt-1 flex shrink-0">
        <UnreadDot active={isUnread} />
      </div>

      <div className="flex w-full items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {n.title}
          </p>
          <p className="mt-1 text-xs text-gray-500">{n.date}</p>
        </div>

        <Avatar src={n.avatar} title={n.title} />
      </div>
    </DropdownMenuItem>
  );
}

/**
 * Default demo data (optional)
 */
const demoNotifications = [
  {
    id: 1,
    title: "Your password has been successfully",
    date: "Jul 23, 2021 at 09:15 AM",
    avatar: null,
    unread: false,
  },
  {
    id: 2,
    title: "Thank you for booking a meeting with us.",
    date: "Jul 14, 2021 at 5:31 PM",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop",
    unread: false,
  },
  {
    id: 3,
    title: "Great news! We are launching our  Living.",
    date: "Jul 13, 2021 at 1:43 PM",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&auto=format&fit=crop",
    unread: true,
  },
  {
    id: 4,
    title: "New comment on your post",
    date: "Jun 30, 2021 at 11:02 AM",
    avatar: null,
    unread: false,
  },
];

/**
 * Component
 */
export default function Notifications({
  items = demoNotifications,
  onViewAll,
}) {
  const { t } = useTranslation();
  const unreadCount = useMemo(
    () => items.filter((n) => n.unread).length,
    [items]
  );

  return (
    <div className="mt-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-full p-1.5 text-primary outline-none ring-offset-0 hover:bg-gray-100 dark:text-[#00874a] dark:hover:bg-neutral-800"
            aria-label={
              unreadCount > 0
                ? t("Notifications", { count: unreadCount }) +
                  `, ` +
                  t("{{count}} unread", { count: unreadCount })
                : t("Notifications")
            }
          >
            <IoMdNotifications className="text-2xl" />
            {unreadCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] font-semibold leading-none text-white"
                style={{ backgroundColor: "#ef4444" }} // uses tailwind's red-500 tone; inline to avoid custom classes leak
                aria-label={t("{{count}} unread", { count: unreadCount })}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[360px] p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-base font-semibold">{t("Notifications")}</h3>
          </div>

          <div className="border-t" />

          {/* List */}
          <div className="py-1">
            {items.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                {t("No notifications")}
              </div>
            ) : (
              items.map((n) => <NotificationItem key={n.id} n={n} />)
            )}
          </div>

          <div className="border-t px-2 py-2">
            <button
              type="button"
              onClick={onViewAll}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
            >
              {t("View all notifications")}
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
