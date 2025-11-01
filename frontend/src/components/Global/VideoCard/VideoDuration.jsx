import React, { useState, useEffect, useRef } from "react";

import { Loader2 } from "lucide-react";

import { extractYouTubeVideoId } from "@/Utility/Global/getYouTubeDuration";

/**
 * Component to display YouTube video duration in VideoCard
 * Uses hidden iframe to extract duration via YouTube Player API (no API key needed)
 */
function VideoDuration({ videoUrl }) {
  const [duration, setDuration] = useState("--:--");
  const [loading, setLoading] = useState(true);
  const playerRef = useRef(null);

  useEffect(() => {
    const videoId = extractYouTubeVideoId(videoUrl);

    if (!videoId) {
      setDuration("N/A");
      setLoading(false);
      return;
    }

    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      return new Promise((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
      });
    };

    const initPlayer = async () => {
      try {
        await loadYouTubeAPI();

        // Create a unique ID for this iframe
        const iframeId = `yt-player-${videoId}-${Date.now()}`;

        // Create container
        const container = document.createElement("div");
        container.id = iframeId;
        container.style.display = "none";
        document.body.appendChild(container);

        playerRef.current = new window.YT.Player(iframeId, {
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
          },
          events: {
            onReady: (event) => {
              const durationSeconds = event.target.getDuration();
              if (durationSeconds && durationSeconds > 0) {
                const hours = Math.floor(durationSeconds / 3600);
                const minutes = Math.floor((durationSeconds % 3600) / 60);
                const seconds = Math.floor(durationSeconds % 60);

                let formatted = "";
                if (hours > 0) {
                  formatted = `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                } else {
                  formatted = `${minutes}:${String(seconds).padStart(2, "0")}`;
                }

                setDuration(formatted);
              } else {
                setDuration("N/A");
              }
              setLoading(false);

              // Cleanup
              event.target.destroy();
              if (container.parentNode) {
                container.parentNode.removeChild(container);
              }
            },
            onError: () => {
              setDuration("N/A");
              setLoading(false);
              if (container.parentNode) {
                container.parentNode.removeChild(container);
              }
            },
          },
        });
      } catch (error) {
        console.error("Error loading YouTube player:", error);
        setDuration("N/A");
        setLoading(false);
      }
    };

    initPlayer();

    // Cleanup function
    // eslint-disable-next-line consistent-return
    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]);

  if (loading) {
    return <Loader2 className="inline h-3 w-3 animate-spin" />;
  }

  return duration;
}

export default VideoDuration;
