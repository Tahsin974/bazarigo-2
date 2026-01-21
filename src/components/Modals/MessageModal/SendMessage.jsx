import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import { Check, CheckCheck, Plus, SendHorizontal } from "lucide-react";
import Loading from "../../Loading/Loading";

export default function SendMessage({
  isMessageOpen,
  senderId,
  senderRole,
  receiverId,
  receiverRole,
  user,
}) {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file); // single image state
  };

  const handleChange = (e) => {
    setContent(e.target.value);

    // auto resize
    textareaRef.current.style.height = "auto"; // reset height
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  // ------------------------
  // Fetch conversation
  // ------------------------
  const { data: messages, isLoading } = useQuery({
    queryKey: ["conversation", senderId, receiverId, isMessageOpen],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/conversation/${senderId}/${receiverId}`,
      );
      return res.data.messages;
    },
    enabled: isMessageOpen,
    refetchInterval: 2000, // প্রতি ২ সেকেন্ডে refresh
  });

  // ------------------------
  // Send message
  // ------------------------
  // const mutation = useMutation({
  //   mutationFn: () =>
  //     axiosPublic.post("/send", {
  //       sender_id: senderId,
  //       sender_role: senderRole,
  //       receiver_id: receiverId,
  //       receiver_role: receiverRole,
  //       content,
  //     }),
  //   onSuccess: () => {
  //     setContent("");
  //     queryClient.invalidateQueries(["conversation", senderId, receiverId]);
  //   },
  // });
  const mutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("sender_id", senderId);
      formData.append("sender_role", senderRole);
      formData.append("receiver_id", receiverId);
      formData.append("receiver_role", receiverRole);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      return axiosPublic.post("/send", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setContent("");
      setImage(null);
      queryClient.invalidateQueries(["conversation", senderId, receiverId]);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  const handleSend = () => {
    if (!image && !content.trim()) return;
    mutation.mutate();
  };

  return (
    <>
      <div className="flex flex-col w-full mx-auto p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
        {/* Messages Area */}
        <div className="flex-1 h-64 overflow-y-auto flex flex-col gap-4 pr-2">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-center gap-3 p-4 border-b border-gray-200">
                <img
                  src={`${baseUrl}${user?.img || user.store_img}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold">
                  {user?.name || user.store_name}
                </h2>
              </div>

              {/* Messages */}
              {messages?.map((msg) => {
                const isSender = msg.sender_id === senderId;
                const isSeen = msg.read_status;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-3 w-full ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar */}
                    {!isSender && (
                      <img
                        src={`${baseUrl}${msg.sender_image}`}
                        alt="avatar"
                        className="w-9 h-9 rounded-full shadow-sm object-cover"
                      />
                    )}

                    {/* Message Bubble */}
                    <div className="flex flex-col max-w-[70%] relative">
                      {/* Name */}
                      <span
                        className={`text-xs mb-1 ${
                          isSender
                            ? "text-right text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {senderId ? msg.sender_name : msg.receiver_name}
                      </span>

                      {/* Bubble */}
                      <div
                        className={`rounded-2xl shadow-sm text-sm leading-relaxed flex flex-col  p-3 ${
                          isSender
                            ? "bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.image_url && (
                          <img
                            src={`${baseUrl}${msg.image_url}`}
                            alt="sent"
                            className="max-w-[200px] rounded-lg mb-1"
                          />
                        )}
                        {msg.content && (
                          <span className="text-base font-semibold">
                            {msg.content}
                          </span>
                        )}
                        {isSender && (
                          <span className="text-[10px]  self-end text-white">
                            {isSeen ? (
                              <CheckCheck size={18} />
                            ) : (
                              <Check size={18} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSender && (
                      <img
                        src={`${baseUrl}${msg.sender_image}`}
                        alt="avatar"
                        className="w-9 h-9 rounded-full shadow-sm object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Input Box */}
        <div className="flex flex-col gap-2 mt-3">
          {/* Image Preview */}
          {image && (
            <div className="mb-2">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex gap-2 items-center">
            {/* Image Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 ml-1 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 active:bg-gray-200 transition duration-150 flex-shrink-0"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-transparent 
              shadow-sm transition-all duration-200"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={mutation.isLoading}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white shadow disabled:bg-gray-400 transition-all duration-200"
            >
              {mutation.isLoading ? "…" : <SendHorizontal size={20} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {mutation.isError && (
          <p className="text-red-500 text-sm mt-2">
            Error sending message. Try again!
          </p>
        )}
      </div>
    </>
  );
}
