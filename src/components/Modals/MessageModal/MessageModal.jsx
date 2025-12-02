import { motion } from "framer-motion";
import { X } from "lucide-react";
import SendMessage from "./SendMessage";
import { useQueryClient } from "@tanstack/react-query";
export default function MessageModal({ onClose, senderId, senderRole, user }) {
  const queryClient = useQueryClient();

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
        >
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
            <h2 className="text-xl font-semibold">Send Message </h2>
            <button
              onClick={() => {
                queryClient.invalidateQueries([
                  "conversation",
                  senderId,
                  user.user_id,
                ]);
                onClose();
              }}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </header>

          <main className="p-6">
            <SendMessage
              senderId={senderId}
              senderRole={senderRole}
              receiverId={user.user_id}
              receiverRole={user.role}
              user={user}
            />
          </main>
        </motion.div>
      </div>
    </div>
  );
}
