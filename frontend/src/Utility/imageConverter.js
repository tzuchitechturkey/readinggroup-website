import heic2any from "heic2any";

/**
 * تحويل صورة HEIC/HEIF إلى JPEG
 * @param {File} file - ملف الصورة
 * @returns {Promise<File>} - الملف المحول أو الملف الأصلي إذا لم يكن HEIC
 */
export const convertHeicToJpeg = async (file) => {
  if (!file) return null;

  // التحقق من نوع الملف
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  // إذا لم يكن HEIC، أرجع الملف كما هو
  if (!isHeic) {
    return file;
  }

  try {
    // تحويل HEIC إلى JPEG
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    // إنشاء ملف جديد من Blob المحول
    const convertedFile = new File(
      [convertedBlob],
      file.name.replace(/\.(heic|heif)$/i, ".jpg"),
      { type: "image/jpeg" }
    );

    return convertedFile;
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error);
    throw error;
  }
};

/**
 * معالجة صورة مع تحويل HEIC تلقائياً وإنشاء URL للمعاينة
 * @param {File} file - ملف الصورة
 * @returns {Promise<{file: File, url: string}>} - الملف المحول وURL للمعاينة
 */
export const processImageFile = async (file) => {
  if (!file) return null;

  try {
    // تحويل HEIC إذا لزم الأمر
    const processedFile = await convertHeicToJpeg(file);

    // إنشاء URL للمعاينة
    const url = URL.createObjectURL(processedFile);

    return {
      file: processedFile,
      url,
    };
  } catch (error) {
    console.error("Error processing image file:", error);
    throw error;
  }
};

/**
 * التحقق من نوع الملف إذا كان HEIC
 * @param {File} file - ملف الصورة
 * @returns {boolean} - true إذا كان HEIC
 */
export const isHeicFile = (file) => {
  if (!file) return false;

  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
};
