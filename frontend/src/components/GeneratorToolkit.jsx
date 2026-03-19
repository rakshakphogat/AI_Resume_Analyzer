import { useMemo, useState } from "react";

import api from "../services/api";

const tabList = [
  { key: "cover", label: "Cover Letter" },
  { key: "interview", label: "Interview Questions" },
  { key: "projects", label: "Missing Projects" },
  { key: "bullets", label: "Bullet Rewriter" },
];

const selectClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-900";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-900";

const textareaClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-300 focus:ring dark:border-slate-600 dark:bg-slate-900";

const GeneratorToolkit = ({ resume }) => {
  const [activeTab, setActiveTab] = useState("cover");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [coverForm, setCoverForm] = useState({
    tone: "professional",
    length: "medium",
    targetRole: "",
    jobDescription: "",
  });
  const [coverResult, setCoverResult] = useState("");

  const [interviewForm, setInterviewForm] = useState({ role: "", count: 8 });
  const [interviewResult, setInterviewResult] = useState({ technical: [], behavioral: [] });

  const [projectForm, setProjectForm] = useState({ targetRole: "", count: 4 });
  const [projectResult, setProjectResult] = useState([]);

  const [bulletForm, setBulletForm] = useState({ targetRole: "", bulletsText: "" });
  const [bulletResult, setBulletResult] = useState([]);

  const disabled = !resume?._id;

  const parsedBullets = useMemo(
    () =>
      bulletForm.bulletsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [bulletForm.bulletsText]
  );

  const makeRequest = async (requestFn) => {
    setError("");
    setLoading(true);
    try {
      await requestFn();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCover = async () => {
    await makeRequest(async () => {
      const { data } = await api.post(`/resumes/${resume._id}/cover-letter`, {
        tone: coverForm.tone,
        length: coverForm.length,
        targetRole: coverForm.targetRole || resume.targetRole || "",
        jobDescription: coverForm.jobDescription,
      });
      setCoverResult(data.data.coverLetter || "");
    });
  };

  const handleGenerateInterview = async () => {
    await makeRequest(async () => {
      const { data } = await api.post(`/resumes/${resume._id}/interview-questions`, {
        role: interviewForm.role || resume.targetRole || "",
        count: Number(interviewForm.count) || 8,
      });
      setInterviewResult({
        technical: data.data.technical || [],
        behavioral: data.data.behavioral || [],
      });
    });
  };

  const handleGenerateProjects = async () => {
    await makeRequest(async () => {
      const { data } = await api.post(`/resumes/${resume._id}/missing-projects`, {
        targetRole: projectForm.targetRole || resume.targetRole || "",
        missingSkills: resume.missingSkills || [],
        count: Number(projectForm.count) || 4,
      });
      setProjectResult(data.data.projects || []);
    });
  };

  const handleRewriteBullets = async () => {
    if (!parsedBullets.length) {
      setError("Please add at least one bullet point.");
      return;
    }

    await makeRequest(async () => {
      const { data } = await api.post(`/resumes/${resume._id}/rewrite-bullets`, {
        targetRole: bulletForm.targetRole || resume.targetRole || "",
        bullets: parsedBullets,
      });
      setBulletResult(data.data.rewrittenBullets || []);
    });
  };

  const renderCover = () => (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Tone</label>
          <select
            className={selectClass}
            value={coverForm.tone}
            onChange={(event) => setCoverForm((curr) => ({ ...curr, tone: event.target.value }))}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="assertive">Assertive</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Length</label>
          <select
            className={selectClass}
            value={coverForm.length}
            onChange={(event) => setCoverForm((curr) => ({ ...curr, length: event.target.value }))}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Target Role</label>
          <input
            className={inputClass}
            value={coverForm.targetRole}
            onChange={(event) => setCoverForm((curr) => ({ ...curr, targetRole: event.target.value }))}
            placeholder={resume?.targetRole || "Backend Developer"}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Job Description</label>
        <textarea
          className={textareaClass}
          rows={5}
          value={coverForm.jobDescription}
          onChange={(event) => setCoverForm((curr) => ({ ...curr, jobDescription: event.target.value }))}
          placeholder="Paste the job description here for tailored writing"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerateCover}
        disabled={disabled || loading}
        className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {!!coverResult && (
        <textarea className={textareaClass} rows={12} value={coverResult} readOnly />
      )}
    </div>
  );

  const renderInterview = () => (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Role</label>
          <input
            className={inputClass}
            value={interviewForm.role}
            onChange={(event) => setInterviewForm((curr) => ({ ...curr, role: event.target.value }))}
            placeholder={resume?.targetRole || "Full Stack Developer"}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Question Count</label>
          <input
            type="number"
            min={4}
            max={20}
            className={inputClass}
            value={interviewForm.count}
            onChange={(event) => setInterviewForm((curr) => ({ ...curr, count: event.target.value }))}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerateInterview}
        disabled={disabled || loading}
        className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Interview Questions"}
      </button>

      {!!interviewResult.technical.length && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <h4 className="mb-2 text-sm font-bold">Technical</h4>
            <ul className="space-y-2 text-sm">
              {interviewResult.technical.map((q, i) => (
                <li key={`t-${i}`}>{q}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <h4 className="mb-2 text-sm font-bold">Behavioral</h4>
            <ul className="space-y-2 text-sm">
              {interviewResult.behavioral.map((q, i) => (
                <li key={`b-${i}`}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Target Role</label>
          <input
            className={inputClass}
            value={projectForm.targetRole}
            onChange={(event) => setProjectForm((curr) => ({ ...curr, targetRole: event.target.value }))}
            placeholder={resume?.targetRole || "Frontend Developer"}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Project Count</label>
          <input
            type="number"
            min={2}
            max={8}
            className={inputClass}
            value={projectForm.count}
            onChange={(event) => setProjectForm((curr) => ({ ...curr, count: event.target.value }))}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerateProjects}
        disabled={disabled || loading}
        className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Missing Projects"}
      </button>

      {!!projectResult.length && (
        <div className="space-y-2">
          {projectResult.map((project, i) => (
            <div key={`${project.title}-${i}`} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm font-bold">{project.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{project.summary}</p>
              <p className="mt-2 text-xs text-slate-500">Complexity: {project.complexity}</p>
              <p className="mt-1 text-xs text-slate-500">
                Skills: {(project.skillsCovered || []).join(", ") || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBullets = () => (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Target Role</label>
        <input
          className={inputClass}
          value={bulletForm.targetRole}
          onChange={(event) => setBulletForm((curr) => ({ ...curr, targetRole: event.target.value }))}
          placeholder={resume?.targetRole || "Software Engineer"}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Experience Bullets (one per line)</label>
        <textarea
          className={textareaClass}
          rows={6}
          value={bulletForm.bulletsText}
          onChange={(event) => setBulletForm((curr) => ({ ...curr, bulletsText: event.target.value }))}
          placeholder="Built APIs for dashboard&#10;Improved load speed&#10;Collaborated with designers"
        />
      </div>

      <button
        type="button"
        onClick={handleRewriteBullets}
        disabled={disabled || loading}
        className="rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "Rewriting..." : "Rewrite into STAR Bullets"}
      </button>

      {!!bulletResult.length && (
        <div className="space-y-2">
          {bulletResult.map((item, i) => (
            <div key={`rb-${i}`} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs font-bold uppercase text-slate-500">Original</p>
              <p className="text-sm">{item.original}</p>
              <p className="mt-2 text-xs font-bold uppercase text-slate-500">STAR Rewrite</p>
              <p className="text-sm">{item.rewritten}</p>
              <p className="mt-2 text-xs text-slate-500">Hint: {item.metricsHint}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <h2 className="font-display text-lg font-extrabold">AI Career Toolkit</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Generate role-specific career assets from your selected resume.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              activeTab === tab.key
                ? "bg-sky-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {disabled && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300">
          Upload or select a resume first to use these tools.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-4">
        {activeTab === "cover" && renderCover()}
        {activeTab === "interview" && renderInterview()}
        {activeTab === "projects" && renderProjects()}
        {activeTab === "bullets" && renderBullets()}
      </div>
    </section>
  );
};

export default GeneratorToolkit;
