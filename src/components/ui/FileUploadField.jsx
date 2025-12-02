import { UploadCloud } from "lucide-react";

export const FileUploadField = ({
  PRIMARY_COLOR,
  label,
  required = true,

  acceptedFormats = ".jpg, .jpeg, .png",
  image,
  setImage,
}) => {
  const baseUrl = import.meta.env.VITE_BASEURL;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full mb-4 ">
      <label className="block text-sm font-medium text-gray-700 mb-1 ">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-xl ${
          image ? "p-2" : "p-4"
        } cursor-pointer transition duration-150 ease-in-out`}
        style={{
          borderColor: image ? "#10B981" : PRIMARY_COLOR,
          borderWidth: 2,
          backgroundColor: image ? "#D1FAE5" : "#FEEFEF",
        }}
      >
        <input
          type="file"
          id={name}
          name={name}
          accept={acceptedFormats}
          onChange={handleImageUpload}
          required={required}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center text-center ">
          {image ? (
            image.includes("/uploads") ? (
              <img src={`${baseUrl}${image}`} alt="image" />
            ) : (
              <img src={image} alt="image" />
            )
          ) : (
            <>
              <UploadCloud
                className="w-8 h-8 mb-1"
                style={{ color: PRIMARY_COLOR }}
              />
              <p
                onClick={() => {
                  document.getElementById("image-upload").click();
                }}
                className="text-sm text-gray-600"
              >
                <span
                  className="font-semibold"
                  style={{ color: PRIMARY_COLOR }}
                >
                  Click Here
                </span>{" "}
                or Drag and Drop File
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                (JPG, PNG | Required for NID)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
