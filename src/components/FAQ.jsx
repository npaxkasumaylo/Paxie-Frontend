export default function FAQ({ onSelect, disabled }) {
  const Question = [
    { question: "What is N-PAX?" },
    { question: "What services does N-PAX offer?" },
    { question: "Who can use N-PAX?" },
    { question: "What is N-PAX's history" },
    { question: "Who are the founders of N-PAX" },
  ];

  return (
    <div className=" bg-white p-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          FAQs
        </p>
      </div>

      {/* Compact scroll area so it doesn't take over the chat window */}
      <div className="max-h-[140px] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-2">
          {Question.map((item, index) => (
            <button
              key={index}
              disabled={disabled}
              onClick={() => onSelect?.(item.question)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                disabled
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}