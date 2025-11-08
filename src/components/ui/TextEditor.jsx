import JoditEditor from "jodit-react";
import "jodit/es2021/jodit.min.css";
import { useMemo, useRef } from "react";

export default function TextEditor({ value, onChange }) {
  const editor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      height: 300,
      toolbarSticky: false,
      toolbarAdaptive: false,
      hidePoweredByJodit: true,

      statusbar: false,
      editorCssClass:
        "w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white",
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",

        "|",
        "align",
        "undo",
        "redo",
      ],

      disablePlugins: [
        "video",
        "image",
        "file",
        "Speech Recognize",
        "print",
        "table",
        "link",
      ],
      // 👇 Change "lists" (plural) to "list" (singular)
      extraPlugins: ["list"],
    }),
    []
  );
  return (
    <div>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndeX={1}
        onChange={onChange}
      />
      <div>
        <h2>Content Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
}
