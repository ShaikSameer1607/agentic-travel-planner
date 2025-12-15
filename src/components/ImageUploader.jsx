import { useState } from "react";

export default function ImageUploader({ setImage }) {
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass p-6 rounded-2xl backdrop-blur glow-blue">
      <h3 className="text-lg font-semibold mb-3 text-neonBlue">
        🖼️ Image Inspiration (Optional)
      </h3>
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neonPurple file:text-white hover:file:bg-neonBlue file:cursor-pointer"
        />
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs max-h-48 rounded-lg shadow-lg border-2 border-neonBlue"
            />
          </div>
        )}
        <p className="text-sm text-gray-400 text-center">
          Upload an image to set the mood and aesthetic for your trip
        </p>
      </div>
    </div>
  );
}
