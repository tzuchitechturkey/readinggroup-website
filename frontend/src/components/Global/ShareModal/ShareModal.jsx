import React, { useState } from "react";

import { X, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

const ShareModal = ({ isOpen, onClose, url, title }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareTitle
      )}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "Line",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.2 0-.395-.078-.544-.207l-2.078-1.781v.711c0 .345-.282.629-.631.629-.345 0-.627-.284-.627-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .39.078.543.207l2.077 1.781V8.757c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.122zm-5.741 0c0 .345-.282.629-.631.629-.345 0-.627-.284-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.122zM7.741 8.108v4.122c0 .345-.282.629-.631.629H4.724c-.345 0-.627-.284-.627-.629 0-.345.282-.629.627-.629h1.755V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      ),
      color: "bg-green-100 text-green-600 hover:bg-green-200",
      url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      ),
      color: "bg-green-100 text-green-600 hover:bg-green-200",
      url: `https://wa.me/?text=${encodeURIComponent(
        shareTitle + " " + shareUrl
      )}`,
    },
  ];

  const handleShareClick = (shareUrl) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {t("Share this article") || "Share this article"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-6">
          {t("If you like this article share it with your friends.") ||
            "If you like this article share it with your friends."}
        </p>

        {/* Share Options */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => handleShareClick(option.url)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 ${option.color} group`}
            >
              <div className="mb-2 transform group-hover:scale-110 transition-transform duration-200">
                {option.icon}
              </div>
              <span className="text-xs font-medium">{option.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link Section */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
              placeholder="https://example.com/article/social-share-modal"
            />
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-lg transition-all duration-200 ${
                copied
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={copied ? "Copied!" : "Copy link"}
            >
              <Copy size={16} />
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-xs mt-2 text-center animate-pulse">
              {t("Link copied to clipboard!") || "Link copied to clipboard!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
