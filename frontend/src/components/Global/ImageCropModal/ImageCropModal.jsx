import React, { useState, useCallback } from "react";

import Cropper from "react-easy-crop";
import { X, Check, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

/**
 * ImageCropModal - Modal component for cropping images with 16:9 aspect ratio
 * @param {Object} props
 * @param {string} props.imageSrc - The source URL of the image to crop
 * @param {Function} props.onCropComplete - Callback when crop is completed, receives cropped image blob
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {boolean} props.isOpen - Whether the modal is open
 */
function ImageCropModal({ imageSrc, onCropComplete, onClose, isOpen }) {
  const { t, i18n } = useTranslation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation) => {
    setRotation(rotation);
  };

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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

    // Set canvas size to desired output size (1920x1080)
    const outputWidth = 1920;
    const outputHeight = 1080;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Calculate scale factors
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Apply rotation if needed
    if (rotation !== 0) {
      const rotRad = (rotation * Math.PI) / 180;
      ctx.translate(outputWidth / 2, outputHeight / 2);
      ctx.rotate(rotRad);
      ctx.translate(-outputWidth / 2, -outputHeight / 2);
    }

    // Draw the cropped image scaled to 1920x1080
    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div
        className="bg-white rounded-lg w-full max-w-4xl mx-4 pb-10 flex flex-col"
        style={{ maxHeight: "90vh" }}
        dir={i18n?.language === "ar" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("Crop Image")}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Info Banner */}
       

        {/* Cropper Area */}
        <div className="relative flex-1" style={{ minHeight: "400px" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
            onCropComplete={onCropCompleteHandler}
            showGrid={true}
            style={{
              containerStyle: {
                backgroundColor: "#f3f4f6",
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-gray-50 space-y-4">
          {/* Zoom Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("Zoom")}: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Rotation Control */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RotateCw className="h-4 w-4" />
              {t("Rotate 90°")}
            </button>
            <span className="text-sm text-gray-600">
              {t("Current rotation")}: {rotation}°
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleCropConfirm}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              {t("Apply Crop")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;
