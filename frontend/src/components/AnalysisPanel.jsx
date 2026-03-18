import ATSScoreChart from "./ATSScoreChart";

const PillList = ({ title, items, tone = "sky" }) => (
  <div>
    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {(items || []).length ? (
        items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              tone === "emerald"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                : tone === "amber"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                  : "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200"
            }`}
          >
            {item}
          </span>
        ))
      ) : (
        <span className="text-sm text-slate-500">No data</span>
      )}
    </div>
  </div>
);

const BulletSection = ({ title, items }) => (
  <div>
    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {title}
    </h3>
    <ul className="space-y-2">
      {(items || []).length ? (
        items.map((item) => (
          <li
            key={item}
            className="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
          >
            {item}
          </li>
        ))
      ) : (
        <li className="text-sm text-slate-500">No data</li>
      )}
    </ul>
  </div>
);

const AnalysisPanel = ({ resume, onDownload }) => {
  if (!resume) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload a resume to view analysis.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900 md:grid-cols-2">
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
        <ATSScoreChart score={resume.atsScore || 0} />
        <button
          type="button"
          onClick={() => onDownload(resume._id)}
          className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          Download AI Feedback Report
        </button>
      </div>

      <div className="space-y-4">
        <PillList
          title="Detected Skills"
          items={resume.skills}
          tone="emerald"
        />
        <PillList
          title="Missing Skills"
          items={resume.missingSkills}
          tone="amber"
        />
      </div>

      <BulletSection title="Strengths" items={resume.strengths} />
      <BulletSection title="Weaknesses" items={resume.weaknesses} />

      <div className="md:col-span-2">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Suggestions
        </h3>
        <div className="space-y-2">
          {(resume.suggestions || []).length ? (
            resume.suggestions.map((item, index) => (
              <div
                key={`${item.category}-${index}`}
                className="rounded-xl bg-sky-50 px-4 py-3 dark:bg-slate-800"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                  {item.category}
                </p>
                <p className="text-sm">{item.message}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No suggestions available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnalysisPanel;
