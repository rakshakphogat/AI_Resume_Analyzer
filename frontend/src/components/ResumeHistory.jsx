const ResumeHistory = ({ resumes, activeId, onSelect }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
    <h2 className="mb-4 font-display text-lg font-bold">Resume History</h2>
    <div className="space-y-3">
      {resumes.length ? (
        resumes.map((resume) => (
          <button
            key={resume._id}
            type="button"
            onClick={() => onSelect(resume)}
            className={`w-full rounded-xl border px-4 py-3 text-left transition ${
              resume._id === activeId
                ? "border-sky-400 bg-sky-50 dark:border-sky-500 dark:bg-slate-800"
                : "border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 dark:border-slate-700 dark:hover:bg-slate-800"
            }`}
          >
            <p className="truncate text-sm font-bold">{resume.fileName}</p>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{new Date(resume.uploadedAt).toLocaleDateString()}</span>
              <span className="font-semibold">ATS: {resume.atsScore}</span>
            </div>
          </button>
        ))
      ) : (
        <p className="text-sm text-slate-500">No resume analyses yet.</p>
      )}
    </div>
  </section>
);

export default ResumeHistory;
