import { UploadCloud, X } from "lucide-react";

export default function UploadImages({ handleImageUpload, children }) {
  return (
    <div>
      <div>
        <div
          className="mt-1 flex justify-center xl:px-6 lg:px-6  px-4 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-theme-pink/10 transition duration-150 border-[#FF0055]"
          onClick={() => {
            document.getElementById("image-upload").click();
          }}
        >
          <div className="space-y-1 text-center">
            <UploadCloud
              className={`mx-auto h-12 w-12 text-gray-500 
              `}
            />
            <div className="flex text-sm text-[#FF0055]">
              <p className="pl-1">Click or drag to upload images</p>
            </div>
            <p className="text-xs text-gray-500]">
              PNG, JPG (Max 1MB per image)
            </p>
          </div>
        </div>
        <input
          id="image-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
      </div>
      {children}
    </div>
  );
}
