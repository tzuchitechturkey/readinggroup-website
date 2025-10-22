import React from "react";

import LogoHome from "@/assets/logo.png";

function Loader({ message }) {
  return (
    <>
      <style>{`
            .logo-animated {
              display: block;
              margin: 0 auto 12px auto;
              width: 300px;
              height: 300px;
              object-fit: contain;
              border-radius: 50%;
              animation: logoColorAnim 5s infinite linear;
            }
            @keyframes logoColorAnim {
              0%   { filter: drop-shadow(0 0 0 var(--color-primary)) drop-shadow(0 0 0 var(--color-primary)) brightness(1.1) saturate(1.3); }
              20%  { filter: drop-shadow(0 0 24px var(--color-sidebarText)) drop-shadow(0 0 32px var(--color-sidebarText)) brightness(1.2) saturate(1.5); }
              45%  { filter: drop-shadow(0 0 36px var(--color-sidebarTextBg)) drop-shadow(0 0 48px var(--color-sidebarTextBg)) brightness(1.3) saturate(1.7); }
              75%  { filter: drop-shadow(0 0 24px var(--color-sidebarText)) drop-shadow(0 0 32px var(--color-sidebarText)) brightness(1.2) saturate(1.5); }
              100% { filter: drop-shadow(0 0 0 var(--color-primary)) drop-shadow(0 0 0 var(--color-primary)) brightness(1.1) saturate(1.3); }
            }
        .logo-glow {
          animation: logoGlow 1.8s ease-in-out infinite;
          filter: drop-shadow(0 0 0.7rem #fff) drop-shadow(0 0 1.2rem #fff8);
        }
        @keyframes logoGlow {
          0% {
                        @keyframes logoColorAnim {
                          0%   { filter: drop-shadow(0 0 0 #ED303C) drop-shadow(0 0 0 #ED303C) brightness(1.01) saturate(1.02); }
                          20%  { filter: drop-shadow(0 0 4px #3B8183) drop-shadow(0 0 6px #3B8183) brightness(1.03) saturate(1.05); }
                          45%  { filter: drop-shadow(0 0 7px #FAD089) drop-shadow(0 0 10px #FAD089) brightness(1.05) saturate(1.08); }
                          75%  { filter: drop-shadow(0 0 4px #FF9C5B) drop-shadow(0 0 6px #FF9C5B) brightness(1.03) saturate(1.05); }
                          100% { filter: drop-shadow(0 0 0 #ED303C) drop-shadow(0 0 0 #ED303C) brightness(1.01) saturate(1.02); }
                        @keyframes logoColorAnim {
                          0%   { filter: drop-shadow(0 0 0 #ED303C) drop-shadow(0 0 0 #ED303C) brightness(1.05) saturate(1.1); }
                          20%  { filter: drop-shadow(0 0 10px #3B8183) drop-shadow(0 0 14px #3B8183) brightness(1.1) saturate(1.2); }
                          45%  { filter: drop-shadow(0 0 16px #FAD089) drop-shadow(0 0 20px #FAD089) brightness(1.13) saturate(1.25); }
                          75%  { filter: drop-shadow(0 0 10px #FF9C5B) drop-shadow(0 0 14px #FF9C5B) brightness(1.1) saturate(1.2); }
                          100% { filter: drop-shadow(0 0 0 #ED303C) drop-shadow(0 0 0 #ED303C) brightness(1.05) saturate(1.1); }
            filter: drop-shadow(0 0 0.7rem #fff) drop-shadow(0 0 1.2rem #fff8);
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 2.5rem #fff) drop-shadow(0 0 3rem #fff8);
            opacity: 1;
          }
          100% {
            filter: drop-shadow(0 0 0.7rem #fff) drop-shadow(0 0 1.2rem #fff8);
            opacity: 1;
          }
        }
        @keyframes l5 {
          0%  {background-position: 50% -50px,-40px 50%, 50% calc(100% + 50px),calc(100% + 50px) 50%}
          20%,
          25% {background-position: 50% -50px,-50px 50%, 50% calc(100% + 50px),50% 50%}
          {/* Loader removed */}
          50% {background-position: 50% -50px,-50px 50%, 50% 50%              ,50% 50%}
          75%,
          75% {background-position: 50% -50px, 50%  50%, 50% 50%              ,50% 50%}
          95%,
          100%{background-position: 50%  50% , 50%  50%, 50% 50%              ,50% 50%}
        } 

        @keyframes rotate {
          100% { transform: rotate(360deg) }
        }
/**
 * Stop and go
 * @author jh3y
 */
@-webkit-keyframes stop-and-go {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  60% {
    -webkit-transform: rotate(1440deg);
    transform: rotate(1440deg);
  }
  100% {
    -webkit-transform: rotate(1080deg);
    transform: rotate(1080deg);
  }
}
@keyframes stop-and-go {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  60% {
    -webkit-transform: rotate(1440deg);
    transform: rotate(1440deg);
  }
  100% {
    -webkit-transform: rotate(1080deg);
    transform: rotate(1080deg);
  }
}
.stop-and-go:before {
  -webkit-animation: stop-and-go 1s infinite;
  animation: stop-and-go 1s infinite;
  border: 25px solid var(--primary, #009688);
  border-left-color: transparent;
  border-radius: 100%;
  border-right-color: transparent;
  content: '';
  height: 50px;
  width: 50px;
  display: block;
  margin: 0 auto;
}

        /* Notification Banner Styles */
        .noti-container {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 9999;
        }
        .noti {
          pointer-events: auto;
          will-change: transform, opacity, filter;
          transform-origin: top center;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 12px 24px rgba(0, 0, 0, 0.2),
            0 2px 6px rgba(0, 0, 0, 0.12);
          background: #000;
        }
        .noti-image {
          display: block;
          user-select: none;
        }
        .noti.enter {
          animation: noti-enter 520ms cubic-bezier(.2,.9,.2,1) forwards,
                     noti-settle 900ms 520ms ease-out forwards;
        }
        @keyframes noti-enter {
          0% {
            transform: translateY(-32px) scale(0.98) rotateX(6deg);
            opacity: 0;
            filter: blur(6px);
          }
          60% {
            transform: translateY(0px) scale(1.003) rotateX(0deg);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translateY(-4px) scale(1);
          }
        }
        @keyframes noti-settle {
          0%   { transform: translateY(-4px); }
          45%  { transform: translateY(2px); }
          80%  { transform: translateY(-1px); }
          100% { transform: translateY(0); }
        }
        .noti.leave {
          animation: noti-leave 360ms cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes noti-leave {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translateY(-24px) scale(0.985);
            opacity: 0;
            filter: blur(4px);
          }
        }
        @media (prefers-color-scheme: dark) {
          .noti {
            box-shadow:
              0 16px 32px rgba(0, 0, 0, 0.45),
              0 2px 10px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={LogoHome} alt="Logo" className="logo-animated" />
        <div className="loader" />

        {message && (
          <div
            style={{
              marginTop: "12px",
              padding: "8px 16px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 0 8px rgba(0,0,0,0.2)",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </>
  );
}

export default Loader;
