import { CheckCircle, UploadCloud } from "lucide-react";

export const FileUploadField = ({
  PRIMARY_COLOR,
  label,
  name,
  fileObject,
  onChange,
  required = true,
  error,
  acceptedFormats = ".jpg, .jpeg, .png",
}) => {
  const fileName = fileObject ? fileObject.name : "";
  const isUploaded = !!fileObject;

  const handleFileChange = (e) => {
    // Only pass the first file object back to the main component's state
    const file = e.target.files[0] || null;
    onChange({ target: { name, value: file, type: "file" } });
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className="relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition duration-150 ease-in-out"
        style={{
          borderColor: isUploaded ? "#10B981" : PRIMARY_COLOR,
          borderWidth: 2,
          backgroundColor: isUploaded ? "#D1FAE5" : "#FEEFEF",
        }}
      >
        <input
          type="file"
          id={name}
          name={name}
          accept={acceptedFormats}
          onChange={handleFileChange}
          required={required}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center text-center">
          {isUploaded ? (
            <p className="text-sm font-medium text-green-700 truncate w-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Upload Successful:{" "}
              <span className="ml-1 font-mono text-xs">{fileName}</span>
            </p>
          ) : (
            <>
              <UploadCloud
                className="w-8 h-8 mb-1"
                style={{ color: PRIMARY_COLOR }}
              />
              <p className="text-sm text-gray-600">
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
