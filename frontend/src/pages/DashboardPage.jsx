import { useEffect, useState } from "react";

import AnalysisPanel from "../components/AnalysisPanel";
import ResumeHistory from "../components/ResumeHistory";
import ResumeUpload from "../components/ResumeUpload";
import api from "../services/api";

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/resumes");
      setResumes(data.data || []);
      if (!activeResume && data.data?.length) {
        setActiveResume(data.data[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resumes");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (file, targetRole) => {
    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (targetRole) {
        formData.append("targetRole", targetRole);
      }

      const { data } = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = data.data;
      setResumes((current) => [created, ...current]);
      setActiveResume(created);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadReport = async (resumeId) => {
    try {
      const response = await api.get(`/resumes/${resumeId}/report`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-report-${resumeId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (_err) {
      alert("Failed to download report.");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        <ResumeUpload onUpload={handleUpload} isUploading={isUploading} />
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}
        <AnalysisPanel
          resume={activeResume}
          onDownload={handleDownloadReport}
        />
      </div>
      <ResumeHistory
        resumes={resumes}
        activeId={activeResume?._id}
        onSelect={setActiveResume}
      />
    </div>
  );
};

export default DashboardPage;
