import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { uploadSingleImage, uploadMultipleImages } from "../services/uploadService";

const ImageUpload = ({
  onUploadSuccess,
  onUploadError,
  maxFiles = 1,
  multiple = false,
  token,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    if (files.length > maxFiles) {
      const error = `Maximum ${maxFiles} file(s) allowed`;
      toast.error(error);
      onUploadError?.(error);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let result;

      if (multiple && files.length > 1) {
        result = await uploadMultipleImages(files, token);
      } else {
        result = await uploadSingleImage(files[0], token);
      }

      if (result.success) {
        setUploadProgress(100);
        toast.success("Image uploaded successfully");
        onUploadSuccess?.(result);
      } else {
        toast.error(result.error || "Upload failed");
        onUploadError?.(result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed");
      onUploadError?.(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files;
      await handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-gray-600">Uploading... {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-700">
            Drop image or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Formats: JPEG, PNG, GIF, WebP (Max 50MB)
          </p>
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
  maxFiles: PropTypes.number,
  multiple: PropTypes.bool,
  token: PropTypes.string.isRequired,
};

export default ImageUpload;
