// Test component to verify file upload functionality
import React, { useState } from 'react';

const FileUploadTest = () => {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previews, setPreviews] = useState({});

  const handleFileSelect = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      // Update selected files
      setSelectedFiles(prev => ({
        ...prev,
        [name]: file
      }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [name]: previewUrl
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', 'Test Card');
    formData.append('description', 'Test Description');
    
    if (selectedFiles.image) {
      formData.append('image', selectedFiles.image);
    }
    if (selectedFiles.cover) {
      formData.append('cover', selectedFiles.cover);
    }

    // Log FormData contents
    console.warn('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.warn(`${key}:`, value);
    }

    alert('تم الرفع بنجاح! تحقق من Console للتفاصيل');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">اختبار رفع الملفات</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">صورة رئيسية</label>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="w-full p-2 border rounded"
          />
          {previews.image && (
            <img
              src={previews.image}
              alt="Preview"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">صورة الغلاف</label>
          <input
            type="file"
            name="cover"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="w-full p-2 border rounded"
          />
          {previews.cover && (
            <img
              src={previews.cover}
              alt="Preview"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          اختبار الرفع
        </button>
      </form>
    </div>
  );
};

export default FileUploadTest;