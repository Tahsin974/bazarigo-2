import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function TextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (!editorRef.current || quillInstance.current) return;

    quillInstance.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Start typing...",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ font: [] }, { size: [] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["clean"],
        ],
      },
    });

    quillInstance.current.on("text-change", () => {
      onChange(quillInstance.current.root.innerHTML);
    });
  }, [onChange]);

  // set initial value
  useEffect(() => {
    if (!quillInstance.current) return;

    const editor = quillInstance.current;
    if (value !== editor.root.innerHTML) {
      // Save current selection
      const range = editor.getSelection();

      // Only update innerHTML if value really changed externally
      editor.root.innerHTML = value || "";

      // Restore cursor
      if (range) editor.setSelection(range);
    }
  }, [value]);

  return (
    <div
      className="border border-gray-300 rounded-lg shadow-sm
      focus-within:border-[#FF0055] focus-within:ring-2 focus-within:ring-[#FF0055]"
    >
      <div ref={editorRef} style={{ height: 300, background: "white" }} />
    </div>
  );
}
