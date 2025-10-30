import React from "react";

import { useTranslation } from "react-i18next";

import LanguageDropdown from "@/components/Global/LanguageDropdown/LanguageDropdown";

import logoSm from "../../../../assets/logo.png";
// Import images
import googlePlayImg from "../../../../assets/googel-play.webp";
import appStoreImg from "../../../../assets/apple-store.png";
import authenticatorImg from "../../../../assets/authenticator-1.webp";
import qrFakeImg from "../../../../assets/qr_fake.png";
import enterTotpImg from "../../../../assets/enter-tottp-code.png";

const TOTPSetup = () => {
  const { t } = useTranslation();
  document.title = t("Setup Authenticator") + " | Charity Portal";

  const QR_URL =
    "otpauth://totp/TestApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=TestApp";

  // Add custom styles for animations
  const CUSTOM_STYLES = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .animate-pulse-gentle {
      animation: pulse 2s infinite;
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  }
}

@keyframes numberBounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
}    .animate-slide-left {
      animation: slideInLeft 0.6s ease-out;
    }
    
    .animate-slide-right {
      animation: slideInRight 0.6s ease-out;
    }
    
    /* Hover effects */
    .step-card:hover h4 span {
      transform: scale(1.15) rotate(3deg) !important;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.7) !important;
    }
    
    /* Interactive number badges */
    .step-card h4 span:hover {
      animation-play-state: paused;
      transform: scale(1.2) rotate(-2deg) !important;
    }
  `;

  const steps = [
    {
      step: 1,
      title: t("Download the App"),
      description: (
        <>
          {t(
            "Download the Google Authenticator app from the following links on your mobile device:"
          )}
          <div className="flex gap-4 items-center justify-center mt-6">
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img
                src={googlePlayImg}
                alt="Google Play"
                className="h-9"
              />
            </a>
            <a
              href="https://apps.apple.com/app/google-authenticator/id388497605"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img
                src={appStoreImg}
                alt="App Store"
                className="h-9"
              />
            </a>
          </div>
        </>
      ),
    },
    {
      step: 2,
      title: t("Open the App"),
      description: (
        <div>
          {t("Open Google Authenticator App")}

          <div>
            <img
              src={authenticatorImg}
              alt="Authenticator App"
              style={{ width: "120px", height: "120px", margin: "20px" }}
            />
          </div>
          <span> {t("and tap on the")}</span>
          <i
            className="fas fa-plus"
            style={{
              fontSize: "1.2em",
              backgroundColor: "#e0e0e0",
              padding: "4px 8px",
              borderRadius: "6px",
              margin: "0 5px",
              verticalAlign: "middle",
            }}
          />
          <span>{t("icon to add a new account.")}</span>
        </div>
      ),
    },
    {
      step: 3,
      title: t("Scan the QR Code"),
      description: (
        <div style={{ textAlign: "center" }}>
          <p>{t("Read the Qr code that appears on the previous page.")}</p>
          <img
            src={qrFakeImg}
            alt="QR Code"
            style={{ width: "200px", height: "200px", margin: "10px auto" }}
          />
          <p className="text-muted" style={{ fontSize: "0.9em" }}>
            {t("Note: This Is Fake for Demo Purposes Only")}
          </p>
        </div>
      ),
      qrCode: true,
    },
    {
      step: 4,
      title: t("Enter the Code"),
      description: (
        <div>
          <p>
            {t(
              "After scanning, a 6-digit code will appear in the app. Enter this code on the login page to verify."
            )}
          </p>
          <div className="flex items-center justify-center">
            <img
              src={enterTotpImg}
              alt="Enter TOTP Code"
              className="w-72 h-48 mx-auto my-4"
            />
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: t("Done!"),
      description: t(
        "Your account is now protected with two-factor authentication. You’ll need the code each time you log in."
      ),
    },
  ];

  // Helper function to get step-specific colors
  const getStepColor = (stepNum) => {
    const colors = {
      1: {
        primary: "#4F46E5", // Indigo
        secondary: "#7C3AED", // Violet
        light: "#EEF2FF",
        dark: "#312E81",
        shadow: "rgba(79, 70, 229, 0.4)",
      },
      2: {
        primary: "#059669", // Emerald
        secondary: "#0D9488", // Teal
        light: "#ECFDF5",
        dark: "#064E3B",
        shadow: "rgba(5, 150, 105, 0.4)",
      },
      3: {
        primary: "#DC2626", // Red
        secondary: "#EA580C", // Orange
        light: "#FEF2F2",
        dark: "#7F1D1D",
        shadow: "rgba(220, 38, 38, 0.4)",
      },
      4: {
        primary: "#7C2D12", // Amber
        secondary: "#A16207", // Yellow
        light: "#FFFBEB",
        dark: "#451A03",
        shadow: "rgba(124, 45, 18, 0.4)",
      },
      5: {
        primary: "#15803D", // Green
        secondary: "#16A34A", // Light Green
        light: "#F0FDF4",
        dark: "#14532D",
        shadow: "rgba(21, 128, 61, 0.4)",
      },
    };
    return colors[stepNum] || colors[1];
  };

  // Helper function to get step-specific icons
  const getStepIcon = (stepNum) => {
    const icons = {
      1: "fa-download",
      2: "fa-mobile-alt",
      3: "fa-qrcode",
      4: "fa-keyboard",
      5: "fa-shield-alt",
    };
    return icons[stepNum] || "fa-circle";
  };

  return (
    <React.Fragment>
      {/* Add custom styles */}
      <style>{CUSTOM_STYLES}</style>

      <div
        className="min-h-screen flex items-center animate-fade-in-up relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Background Decorations */}
        <div
          className="absolute animate-pulse-gentle"
          style={{
            top: "10%",
            left: "5%",
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "50%",
            animation: "pulse 3s infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "70%",
            right: "8%",
            width: "150px",
            height: "150px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "50%",
            animation: "pulse 4s infinite reverse",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "30%",
            right: "15%",
            width: "80px",
            height: "80px",
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "50%",
            animation: "pulse 2.5s infinite",
          }}
        />

        <div className="container mx-auto px-4 relative">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div
              className="inline-flex items-center justify-center mb-8 w-32 h-32 rounded-full"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <img
                src={logoSm}
                alt="Charity Portal Logo"
                className="w-18 h-16"
                style={{
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
            <h1
              className="text-white font-bold mb-6 text-4xl"
            >
              <i
                className="fas fa-shield-alt mr-3"
                style={{ color: "#ffd700" }}
              />
              {t("Secure Your Account with Two-Factor Authentication")}
            </h1>
            <p
              className="text-white/75 text-xl mb-8 max-w-2xl mx-auto"
            >
              {t(
                "Follow these simple steps to enable extra protection for your login."
              )}
            </p>
            <div
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-full text-lg"
              style={{ letterSpacing: "0.5px" }}
            >
              <i className="fas fa-lock mr-2" />
              {t("Enhanced Security")}
            </div>
          </div>

          {/* Steps Cards */}
          <div className="grid lg:grid-cols-2 gap-6 mb-20">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`h-full border-0 shadow-2xl relative overflow-hidden ${
                  index % 2 === 0
                    ? "animate-slide-left"
                    : "animate-slide-right"
                } rounded-3xl bg-white/95 backdrop-blur-lg transition-all duration-300 hover:-translate-y-3 hover:shadow-3xl`}
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  animationDelay: `${index * 0.15}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="p-6 relative">
                    {/* Enhanced Step Number Badge with Animation */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Large Step Number Display */}
                      <div
                        className="flex items-center relative"
                        style={{ zIndex: 10 }}
                      >
                        <div
                          className="flex items-center justify-center text-white font-bold relative w-18 h-18 rounded-2xl transition-all duration-300 hover:rotate-0 hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${
                              getStepColor(step.step).primary
                            } 0%, ${getStepColor(step.step).secondary} 100%)`,
                            fontSize: "1.8rem",
                            boxShadow: `0 15px 40px ${
                              getStepColor(step.step).shadow
                            }`,
                            transform: "rotate(-5deg)",
                            border: "3px solid rgba(255, 255, 255, 0.2)",
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          <span>
                            {step.step}
                          </span>
                          {/* Decorative Ring */}
                      
                        </div>

                        {/* Step Label */}
                        <div className="ml-4">
                          {/* Progress Dots */}
                          <div className="flex mt-2">
                            {[1, 2, 3, 4, 5].map((dot) => (
                              <div
                                key={dot}
                                className="mr-1 w-2 h-2 rounded-full transition-all duration-300"
                                style={{
                                  background:
                                    dot <= step.step
                                      ? getStepColor(step.step).primary
                                      : "rgba(0,0,0,0.1)",
                                  boxShadow:
                                    dot <= step.step
                                      ? `0 2px 8px ${
                                          getStepColor(step.step).shadow
                                        }`
                                      : "none",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Step Status Icon */}
                      <div>
                        {step.step === 5 ? (
                          <i
                            className="fas fa-check-circle text-green-500 animate-pulse-gentle text-3xl"
                            style={{
                              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                            }}
                          />
                        ) : step.step === 3 ? (
                          <i
                            className="fas fa-qrcode text-3xl"
                            style={{
                              color: getStepColor(step.step).primary,
                              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                            }}
                          />
                        ) : (
                          <i
                            className={`fas ${getStepIcon(step.step)} text-3xl`}
                            style={{
                              color: getStepColor(step.step).primary,
                              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-6">
                      <h4
                        className="font-bold mb-6 mt-2 flex items-center text-2xl"
                        style={{ color: "#2d3748" }}
                      >
                        {step.title}
                      </h4>
                      <div className="text-gray-600 leading-relaxed">
                        {step.description}
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div
            className="border-0 shadow-2xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-lg"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="p-12 text-center">
              <div className="max-w-4xl mx-auto">
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center mb-8 w-20 h-20 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
                    boxShadow: "0 15px 35px rgba(25, 84, 123, 0.3)",
                  }}
                >
                  <i
                    className="fas fa-shield-alt text-white text-3xl"
                  />
                </div>

                {/* Title */}
                <h3 className="font-bold mb-8 text-3xl text-gray-800">
                  {t("Why use Google Authenticator?")}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-600 text-xl mb-8 leading-relaxed"
                >
                  {t(
                    "Google Authenticator provides an additional layer of security by generating time-based one-time passwords (TOTP) on your mobile device. This ensures that even if someone knows your password, they can't access your account without the unique verification code generated by the app."
                  )}
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-8 mb-8">
                  <div className="text-center">
                    <i
                      className="fas fa-mobile-alt mb-6 w-18 h-18 rounded-full flex items-center justify-center text-4xl mx-auto"
                      style={{
                        color: "#667eea",
                        background: "rgba(102, 126, 234, 0.1)",
                      }}
                    />
                    <h6 className="font-bold text-gray-800 text-lg mb-2">
                      {t("Mobile Security")}
                    </h6>
                    <p className="text-gray-600 text-sm">
                      {t("Works offline on your device")}
                    </p>
                  </div>
                  <div className="text-center">
                    <i
                      className="fas fa-clock mb-6 w-18 h-18 rounded-full flex items-center justify-center text-4xl mx-auto"
                      style={{
                        color: "#764ba2",
                        background: "rgba(118, 75, 162, 0.1)",
                      }}
                    />
                    <h6 className="font-bold text-gray-800 text-lg mb-2">
                      {t("Time-Based")}
                    </h6>
                    <p className="text-gray-600 text-sm">
                      {t("Codes refresh every 30 seconds")}
                    </p>
                  </div>
                  <div className="text-center">
                    <i
                      className="fas fa-lock mb-6 w-18 h-18 rounded-full flex items-center justify-center text-4xl mx-auto"
                      style={{
                        color: "#48bb78",
                        background: "rgba(72, 187, 120, 0.1)",
                      }}
                    />
                    <h6 className="font-bold text-gray-800 text-lg mb-2">
                      {t("Highly Secure")}
                    </h6>
                    <p className="text-gray-600 text-sm">
                      {t("Industry standard protection")}
                    </p>
                  </div>
                </div>

                {/* Language Dropdown */}
                <div className="flex justify-center mt-8">
                  <div
                    className="p-6 rounded-2xl mb-32"
                    style={{
                      background: "rgba(102, 126, 234, 0.1)",
                      minWidth: "180px",
                    }}
                  >
                    <LanguageDropdown iconColor="#999EAD" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-white/75 mb-0 text-base">
              {t("ZeroWait - Crafted with love")} ❤️ {t("by TzuChi Turkiye")}
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TOTPSetup;
