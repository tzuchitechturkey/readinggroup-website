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
              20%  { filter: drop-shadow(0 0 24px var(--color-sidebarText)) drop-shadow(0 0 12px var(--color-primary)) brightness(1.2) saturate(1.5); }
              45%  { filter: drop-shadow(0 0 36px var(--color-sidebarTextBg)) drop-shadow(0 0 18px #214a9b) brightness(1.3) saturate(1.7); }
              75%  { filter: drop-shadow(0 0 24px var(--color-sidebarText)) drop-shadow(0 0 12px var(--color-primary)) brightness(1.2) saturate(1.5); }
              100% { filter: drop-shadow(0 0 0 var(--color-primary)) drop-shadow(0 0 0 var(--color-primary)) brightness(1.1) saturate(1.3); }
            }
        .logo-glow {
          animation: logoGlow 1.8s ease-in-out infinite;
          filter: drop-shadow(0 0 0.7rem #fff) drop-shadow(0 0 1.2rem #fff8);
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
