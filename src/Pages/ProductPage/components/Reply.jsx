import { useState } from "react";

export default function Reply({ questionId, onAnswer }) {
  const [answer, setAnswer] = useState("");

  const submitAnswer = () => {
    if (answer.trim() === "") return;
    onAnswer(
      questionId,
      answer,
      new Date().toLocaleString("en-CA", {
        timeZone: "Asia/Dhaka",
        hour12: false,
      })
    );
    setAnswer("");
  };
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-3">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer..."
        className="flex-1 border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition-all"
      />
      <button
        onClick={submitAnswer}
        className="bg-[#00C853] hover:bg-[#00B34A] text-white px-5 py-3 rounded-lg shadow-md  transition-all font-semibold"
      >
        Reply
      </button>
    </div>
  );
}
