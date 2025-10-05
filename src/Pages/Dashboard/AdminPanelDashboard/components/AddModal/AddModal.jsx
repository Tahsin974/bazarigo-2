import React, { useState } from "react";

function AddModal({ title = "Add", fields = [], onClose, onSave }) {
  const [form, setForm] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.default || "" }), {})
  );

  const handleSave = () => {
    const missing = fields.filter((f) => f.required && !form[f.key]);
    if (missing.length)
      return alert(`Please fill ${missing.map((m) => m.label).join(", ")}`);
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded shadow overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">{title}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1 rounded border">
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-[#FF0055] text-white"
            >
              Save
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm">{f.label}</label>
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={form[f.key]}
                onChange={(e) =>
                  setForm((s) => ({ ...s, [f.key]: e.target.value }))
                }
                placeholder={f.placeholder || ""}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddModal;
