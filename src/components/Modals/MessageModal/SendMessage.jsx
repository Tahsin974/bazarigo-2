import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import { Check, CheckCheck, SendHorizontal } from "lucide-react";
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

  const textareaRef = useRef(null);

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
        `/conversation/${senderId}/${receiverId}`
      );
      return res.data.messages;
    },
    enabled: isMessageOpen,
    refetchInterval: 2000, // প্রতি ২ সেকেন্ডে refresh
  });
  console.log(user);

  // ------------------------
  // Send message
  // ------------------------
  const mutation = useMutation({
    mutationFn: () =>
      axiosPublic.post("/send", {
        sender_id: senderId,
        sender_role: senderRole,
        receiver_id: receiverId,
        receiver_role: receiverRole,
        content,
      }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries(["conversation", senderId, receiverId]);
    },
  });

  const handleSend = () => {
    if (!content.trim()) return;
    mutation.mutate();
  };

  return (
    <div className="flex flex-col w-full mx-auto p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
      {/* Messages Area */}
      <div className="flex-1 h-64 overflow-y-auto flex flex-col gap-4 pr-2">
        {isLoading ? (
          <Loading />
        ) : (
          <>
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

            {messages?.map((msg) => {
              const isSender = msg.sender_id === senderId;
              const isSeen = msg.read_status; // backend theke read_status

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-3 w-full ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar (Receiver side) */}
                  {!isSender && (
                    <img
                      alt="User avatar"
                      className="w-9 h-9 rounded-full shadow-sm object-cover"
                      src={`${baseUrl}${msg.sender_image}`}
                    />
                  )}

                  {/* Message bubble */}
                  <div className="flex flex-col max-w-[70%] relative">
                    {/* Name */}
                    <span
                      className={`text-xs mb-1 ${
                        isSender ? "text-right text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {senderId ? msg.sender_name : msg.receiver_name}
                    </span>

                    {/* Bubble */}
                    <div
                      className={` rounded-2xl shadow-sm text-sm leading-relaxed flex gap-1.5 px-4 py-2 ${
                        isSender
                          ? "bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-end gap-2">
                        <span>{msg.content}</span>
                        <span>
                          {isSender && (
                            <span
                              className={`text-[10px] mt-1 self-end text-white
                              `}
                            >
                              {isSeen ? (
                                <CheckCheck size={20} />
                              ) : (
                                <Check size={20} />
                              )}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Seen/Unseen tick for sender */}
                  </div>

                  {/* Avatar (Sender side) */}
                  {isSender && (
                    <img
                      alt="User avatar"
                      className="w-9 h-9 rounded-full shadow-sm object-cover"
                      src={`${baseUrl}${msg.sender_image}`}
                    />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Input Box */}
      <div className="flex gap-3 mt-3 items-end">
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
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white shadow 
      disabled:bg-gray-400 transition-all duration-200"
        >
          {mutation.isLoading ? "…" : <SendHorizontal size={20} />}
        </button>
      </div>

      {/* Error */}
      {mutation.isError && (
        <p className="text-red-500 text-sm mt-2">
          Error sending message. Try again!
        </p>
      )}
    </div>
  );
}
