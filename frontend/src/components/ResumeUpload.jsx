import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

const ResumeUpload = ({ onUpload, isUploading }) => {
  const [dragging, setDragging] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const fileRef = useRef(null);

  const validateAndUpload = (file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!file || !validTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }
    onUpload(file, targetRole);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    validateAndUpload(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="rounded-2xl border border-dashed border-sky-400/60 bg-white/70 p-5 shadow-soft dark:border-sky-700/80 dark:bg-slate-900/70">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 p-8 text-center transition ${
          dragging
            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
            : "border-transparent bg-sky-50 dark:bg-slate-800"
        }`}
      >
        <UploadCloud className="mx-auto mb-3 text-sky-500" size={38} />
        <h2 className="font-display text-xl font-bold">
          Drag and drop your resume
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          PDF or DOCX up to 5MB
        </p>

        <input
          ref={fileRef}
          hidden
          type="file"
          accept=".pdf,.docx"
          onChange={(event) => validateAndUpload(event.target.files?.[0])}
        />

        <div className="mx-auto mt-4 max-w-md">
          <label className="mb-1 block text-left text-sm font-semibold">
            Target Job Role (optional)
          </label>
          <input
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="e.g. Full Stack Developer"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-900"
          />
        </div>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileRef.current?.click()}
          className="mt-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-70"
        >
          {isUploading ? "Analyzing..." : "Choose File"}
        </button>
      </div>
    </section>
  );
};

export default ResumeUpload;
