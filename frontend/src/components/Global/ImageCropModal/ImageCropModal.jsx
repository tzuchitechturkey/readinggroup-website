import React, { useState, useCallback } from "react";

import Cropper from "react-easy-crop";
import { X, Check, RotateCw, Wand2, Plus, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

/**
 * ImageCropModal - Reusable modal component for cropping images
 * @param {Object} props
 * @param {string} props.imageSrc - The source URL of the image to crop
 * @param {Function} props.onCropComplete - Callback when crop is completed, receives cropped image blob
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {number} [props.aspect=16/9] - Cropper aspect ratio (e.g., 3/1)
 * @param {number} [props.outputWidth=1920] - Output canvas width in pixels
 * @param {number} [props.outputHeight=1080] - Output canvas height in pixels
 * @param {string} [props.title] - Optional title for the modal header
 * @param {boolean} [props.enableRotate=false] - Show rotate control
 */
function ImageCropModal({
  imageSrc,
  onCropComplete,
  onClose,
  isOpen,
  aspect = 16 / 9,
  outputWidth = 1920,
  outputHeight = 1080,
  title,
  enableRotate = false,
}) {
  const { t, i18n } = useTranslation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // Keep media size if later we want smarter auto-zoom; currently unused after initial set
  const [, setMediaSize] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation) => {
    setRotation(rotation);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onMediaLoaded = useCallback((ms) => {
    setMediaSize(ms);
    // Try to auto fit initially
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleAutoCrop = () => {
    // Simple auto-fit: center and minimal zoom
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  // no reset button – keep controls minimal per request

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to desired output size
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Apply rotation if needed
    if (rotation !== 0) {
      const rotRad = (rotation * Math.PI) / 180;
      ctx.translate(outputWidth / 2, outputHeight / 2);
      ctx.rotate(rotRad);
      ctx.translate(-outputWidth / 2, -outputHeight / 2);
    }

    // Draw the cropped region scaled to target output
    const scaleX = outputWidth / pixelCrop.width;
    const scaleY = outputHeight / pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY
    );

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b bg-white/90">
          <h2 className="text-lg font-semibold text-gray-800">
            {t("Crop your logo image")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition"
            aria-label={t("Close")}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative bg-gray-50 flex items-center justify-center min-h-[420px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={3 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
            onMediaLoaded={onMediaLoaded}
            showGrid={true}
            style={{ containerStyle: { borderRadius: 8 } }}
          />
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 bg-gray-50 border-t space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
              className="p-2 rounded-full bg-white border hover:bg-gray-100"
              aria-label={t("Zoom out")}
            >
              <Minus className="h-4 w-4 text-blue-600" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-48 accent-blue-600"
              aria-label={t("Zoom slider")}
            />
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="p-2 rounded-full bg-white border hover:bg-gray-100"
              aria-label={t("Zoom in")}
            >
              <Plus className="h-4 w-4 text-blue-600" />
            </button>
            <button
              onClick={handleAutoCrop}
              className="ml-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-sm"
            >
              <Wand2 className="h-4 w-4" /> {t("Auto Crop")}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500">
            {t("Aspect")}:{" "}
            <span className="font-semibold text-gray-700">3:1</span> |{" "}
            {t("Output")}:{" "}
            <span className="font-semibold text-gray-700">1920×640 px</span>
          </p>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="outline" onClick={onClose} className="rounded-lg">
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleCropConfirm}
              className="rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-1" /> {t("Apply Crop")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;
