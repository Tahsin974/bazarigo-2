import moment from "moment/moment";
import { useEffect, useState } from "react";

export default function MessagesView({ messages, openMessageModal }) {
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "few seconds",
      ss: "%d seconds",
      m: "1 minute",
      mm: "%d minutes",
      h: "1 hour",
      hh: "%d hours",
      d: "1 day",
      dd: "%d days",
      M: "1 month",
      MM: "%d months",
      y: "1 year",
      yy: "%d years",
    },
  });
  const baseUrl = import.meta.env.VITE_BASEURL;
  const [limit, setLimit] = useState(10); // default large screen

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLimit(5); // small screen (sm)
      } else if (window.innerWidth < 920) {
        setLimit(10); // small screen (sm)
      } else {
        setLimit(20); // large screen
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const truncateMessage = (message) => {
    if (!message) return "";
    const words = message.split(" ");
    if (words.length <= limit) return message;
    return words.slice(0, limit).join(" ") + "...";
  };

  console.log(messages);

  return (
    <div>
      {" "}
      <div className="flex gap-4">
        {/* Users List */}
        {!messages.length ? (
          <>
            <div className="h-screen flex items-center justify-center w-full bg-white">
              <h3 className="text-2xl text-gray-400">You have no messages</h3>
            </div>
          </>
        ) : (
          <>
            <div className=" border rounded-lg overflow-y-auto max-h-[80vh] bg-white shadow-sm w-full">
              {messages.map((message) => (
                <div
                  key={message.user_id}
                  className="p-3 border-b cursor-pointer hover:bg-gray-100 transition "
                  onClick={() => openMessageModal(message)}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {message.img === null ||
                    message.img.includes("/uploads") ? (
                      <figure>
                        <img
                          className="w-10 h-10  rounded-full"
                          src={`${baseUrl}${message.img}`}
                          alt=""
                        />
                      </figure>
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                        {message.name?.charAt(0)}
                      </div>
                    )}

                    {/* Name + Message */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-gray-800">
                          {message.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {moment(message.last_message_time).fromNow()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm md:text-lg text-gray-600 flex justify-between ">
                          <span>{truncateMessage(message.last_message)}</span>
                        </p>
                        {message.unread_count > 0 && (
                          <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
