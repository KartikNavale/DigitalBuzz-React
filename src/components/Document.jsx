import React, { useRef, useState } from "react";
import Card from "../components/Card";

export default function Document() {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (list) => {
    const newFiles = Array.from(list).filter(
      (f) => !files.some((x) => x.file.name === f.name)
    );
    newFiles.forEach((f) => {
      if (f.type.startsWith("image/")) {
        const r = new FileReader();
        r.onload = (e) =>
          setFiles((prev) =>
            prev.map((p) =>
              p.file.name === f.name ? { ...p, preview: e.target.result } : p
            )
          );
        r.readAsDataURL(f);
      }
    });
    setFiles((p) => [...p, ...newFiles.map((f) => ({ file: f }))]);
  };

  const remove = (name) =>
    setFiles((p) => p.filter((x) => x.file.name !== name));
  const clearAll = () => setFiles([]);

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!files.length) return alert("Please add at least one document!");
    alert(
      `Uploading ${files.length} file(s):\n` +
        files.map((f) => f.file.name).join("\n")
    );
  };

  return (
    <Card title="4. Multi-Document Upload in Forms">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Title
          </label>
          <input
            type="text"
            placeholder="Enter document title"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div
          onDragOver={(e) => (e.preventDefault(), setDrag(true))}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`p-4 flex items-center justify-between rounded border-2 border-dashed transition ${
            drag ? "bg-green-50 border-green-400" : "bg-white border-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            className="px-6 py-2 bg-green-400 text-white rounded-full hover:bg-green-500"
          >
            Browse
          </button>
          <span className="text-gray-500 text-sm">
            or drag & drop files here
          </span>
          <input
            type="file"
            ref={inputRef}
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* File*/}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f) => (
              <div
                key={f.file.name}
                className="flex items-center justify-between p-2 bg-white border rounded"
              >
                <div className="flex items-center gap-3">
                  {f.preview ? (
                    <img
                      src={f.preview}
                      alt=""
                      className="w-10 h-10 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded border bg-gray-50 text-gray-400">
                      📄
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{f.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(f.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(f.file.name)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-indigo-900 text-white text-sm rounded hover:bg-black"
              >
                Add Document
              </button>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
