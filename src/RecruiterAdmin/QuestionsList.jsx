import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Pagination from "../components/LandingPage/Pagination";
import AssessmentAPI from "./api/generateAssessmentApi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const QuestionsList = () => {
  const { questionSetId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const questionsPerPage = 4;

  const getQuestionType = (q) => {
    if (Array.isArray(q.content?.options) && q.content.options.length > 0) return "MCQ";
    if (q.type === "coding" || q.content?.code) return "Coding";
    if (q.type === "audio" || q.content?.audio) return "Audio";
    if (q.type === "video" || q.content?.video) return "Video";
    return "General";
  };

  const getPrompt = (q) => q.content?.prompt_text || q.content?.prompt || q.content?.question || "";

  const getSkill = (q) =>
    q.skill ||
    q.content?.skill ||
    q.content?.topic ||
    (Array.isArray(q.skills) && q.skills[0]) ||
    "Skill";

  const getDifficulty = (q) =>
    q.difficulty || q.level || q.content?.difficulty || q.content?.level || "";

  const difficultyMeta = (difficultyRaw) => {
    const d = (difficultyRaw || "").toLowerCase();
    if (d.includes("high") || d.includes("hard")) {
      return { label: difficultyRaw || "High", cls: "bg-red-50 text-red-600 border-red-200" };
    }
    if (d.includes("medium") || d.includes("mid")) {
      return { label: difficultyRaw || "Medium", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    }
    if (d.includes("begin") || d.includes("easy") || d.includes("low")) {
      return { label: difficultyRaw || "Beginner", cls: "bg-green-50 text-green-700 border-green-200" };
    }
    return { label: difficultyRaw || "Level", cls: "bg-gray-50 text-gray-600 border-gray-200" };
  };

  const getTotalMarks = (q) =>
    q.total_marks ?? q.marks ?? q.content?.total_marks ?? q.content?.marks ?? q.content?.score ?? 5;

  const getCorrect = (q) =>
    q.content?.answer ||
    q.content?.correct ||
    q.content?.correct_answer ||
    q.content?.answer_key ||
    q.content?.expected_answer ||
    "";

  const resolveCorrectOptionIndex = (q) => {
    const options = q.content?.options;
    if (!Array.isArray(options) || options.length === 0) return -1;

    const correct = getCorrect(q);
    if (correct == null || correct === "") return -1;

    const asNum = Number(correct);
    if (!Number.isNaN(asNum)) {
      if (asNum >= 0 && asNum < options.length) return asNum;
      if (asNum >= 1 && asNum <= options.length) return asNum - 1;
    }

    if (typeof correct === "string") {
      const s = correct.trim().toUpperCase();
      if (s.length === 1) {
        const idx = s.charCodeAt(0) - "A".charCodeAt(0);
        if (idx >= 0 && idx < options.length) return idx;
      }

      const idxText = options.findIndex((o) => String(o).trim() === correct.trim());
      if (idxText !== -1) return idxText;
    }

    return -1;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await AssessmentAPI.getQuestionsByAssessmentId(questionSetId);
        console.log(data);

        const questionsArray = data?.questions ?? data ?? [];
        setQuestions(questionsArray);
        if (questionsArray.length === 0) setError("No questions found for this assessment.");
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError(err.message || "Failed to load questions");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [questionSetId]);

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPDF = async () => {
    try {
      const title = "Assessment Questions";

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "800px";
      container.style.padding = "24px";
      container.style.background = "#fff";
      container.style.color = "#111827";

      const header = document.createElement("div");
      header.innerHTML = `<h1 style="font-size:20px;margin-bottom:8px">${title}</h1><p>Total questions: ${questions.length}</p>`;
      container.appendChild(header);

      questions.forEach((q, idx) => {
        const prompt = getPrompt(q);
        const qDiv = document.createElement("div");
        qDiv.style.marginBottom = "14px";
        qDiv.innerHTML = `<div><strong>Q${idx + 1}.</strong> ${prompt}</div>`;

        if (Array.isArray(q.content?.options) && q.content.options.length > 0) {
          const ol = document.createElement("ol");
          ol.style.margin = "6px 0 0 18px";
          q.content.options.forEach((opt) => {
            const li = document.createElement("li");
            li.textContent = opt;
            ol.appendChild(li);
          });
          qDiv.appendChild(ol);

          const correct = getCorrect(q);
          if (correct) {
            const c = document.createElement("div");
            c.innerHTML = `<strong>Correct:</strong> ${correct}`;
            qDiv.appendChild(c);
          }
        }

        if (q.type === "audio" && q.content?.expected_keywords) {
          const keywordsDiv = document.createElement("div");
          keywordsDiv.style.margin = "8px 0 0 0";
          keywordsDiv.innerHTML = `<strong>Expected Keywords:</strong> ${q.content.expected_keywords.join(
            ", "
          )}`;
          qDiv.appendChild(keywordsDiv);
        }

        if ((q.type === "audio" || q.type === "video") && q.content?.expected_answer) {
          const answerDiv = document.createElement("div");
          answerDiv.style.margin = "6px 0 0 0";
          answerDiv.innerHTML = `<strong>Correct Answer:</strong> ${q.content.expected_answer}`;
          qDiv.appendChild(answerDiv);
        }

        if ((q.type === "audio" || q.type === "video") && q.content?.rubric) {
          const rubricDiv = document.createElement("div");
          rubricDiv.style.margin = "6px 0 0 0";
          rubricDiv.innerHTML = `<strong>Rubric:</strong> ${q.content.rubric}`;
          qDiv.appendChild(rubricDiv);
        }

        if (q.type === "coding" && q.content?.prompt) {
          const taskDiv = document.createElement("div");
          taskDiv.style.margin = "6px 0 0 0";
          taskDiv.innerHTML = `<strong>Task:</strong> ${q.content.prompt}`;
          qDiv.appendChild(taskDiv);
        }

        if (q.type === "coding" && q.content?.expected_answer) {
          const answerDiv = document.createElement("div");
          answerDiv.style.margin = "6px 0 0 0";
          answerDiv.innerHTML = `<strong>Correct Answer:</strong> ${q.content.expected_answer}`;
          qDiv.appendChild(answerDiv);
        }

        container.appendChild(qDiv);
      });

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > -0.1) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const filename = `Assessment-${questionSetId || "questions"}.pdf`;
      pdf.save(filename);

      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF.");
    }
  };

  const DownloadIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const letter = (i) => String.fromCharCode("A".charCodeAt(0) + i);

  const computed = useMemo(() => {
    return questions.map((q) => ({
      type: getQuestionType(q),
      prompt: getPrompt(q),
      skill: getSkill(q),
      difficulty: getDifficulty(q),
      totalMarks: getTotalMarks(q),
      correct: getCorrect(q),
      correctIdx: resolveCorrectOptionIndex(q),
    }));
  }, [questions]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-[#fafbff]">
        <div className="text-sm text-gray-600">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-6">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[18px] font-semibold text-[#1f2340]">Question List</h1>
            <span className="rounded-full bg-white border border-indigo-200 px-3 py-1 text-xs text-indigo-700 shadow-sm">
              Total Questions: {questions.length}
            </span>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <DownloadIcon />
            Download PDF
          </button>
        </div>

        <div className="space-y-4">
          {currentQuestions.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No questions found for this assessment.
            </div>
          ) : (
            currentQuestions.map((q, index) => {
              const questionNumber = startIndex + index + 1;

              const meta = computed[startIndex + index] || {};
              const type = meta.type || getQuestionType(q);
              const prompt = meta.prompt ?? getPrompt(q);
              const skill = meta.skill ?? getSkill(q);
              const diffMeta = difficultyMeta(meta.difficulty ?? getDifficulty(q));
              const marks = meta.totalMarks ?? getTotalMarks(q);
              const correct = meta.correct ?? getCorrect(q);
              const correctIdx = meta.correctIdx ?? resolveCorrectOptionIndex(q);

              const expectedKeywords =
                Array.isArray(q.content?.expected_keywords) && q.content.expected_keywords.length > 0
                  ? q.content.expected_keywords
                  : [];

              const rubric = q.content?.rubric || "";
              const expectedAnswer = q.content?.expected_answer || "";

              const isMCQ = Array.isArray(q.content?.options) && q.content.options.length > 0;

              return (
                <div
                  key={q.question_id || `${questionNumber}`}
                  className="rounded-2xl border border-indigo-200 bg-[#f6f5ff] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-indigo-200/60 bg-[#f3f1ff]">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-[#1f2340]">
                        Question {questionNumber}
                      </div>

                      {diffMeta.label && (
                        <span className={`text-[11px] px-2.5 py-1 rounded-full border ${diffMeta.cls}`}>
                          {diffMeta.label}
                        </span>
                      )}

                      {skill && (
                        <span className="text-[11px] px-2.5 py-1 rounded-full border border-indigo-200 bg-white text-indigo-700">
                          {skill}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {type}
                    </span>
                  </div>

                  <div className="bg-white px-4 sm:px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-[#1f2340]">
                        <span className="font-semibold">Q.</span>{" "}
                        <span className="font-medium">{prompt}</span>
                      </p>

                      <span className="shrink-0 rounded-full border border-indigo-200 bg-white px-3 py-1 text-[11px] text-indigo-700">
                        Total Marks: {marks}
                      </span>
                    </div>

                    {expectedKeywords.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-gray-500">Expected Keywords:</span>
                        {expectedKeywords.map((k, i) => (
                          <span
                            key={`${k}-${i}`}
                            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-700"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}

                    {isMCQ && (
                      <div className="mt-4 space-y-2">
                        {q.content.options.map((opt, i) => {
                          const isCorrect = i === correctIdx;
                          return (
                            <div
                              key={i}
                              className={[
                                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm",
                                isCorrect ? "border-green-200 bg-green-50" : "border-gray-200 bg-white",
                              ].join(" ")}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-xs text-gray-500 mt-[2px]">{letter(i)}.</span>
                                <span className={isCorrect ? "text-green-800" : "text-gray-700"}>
                                  {typeof opt === "string"
                                    ? opt.trim().replace(/^([a-zA-Z0-9]+)\s*[.)-]\s*/, "")
                                    : opt}
                                </span>
                              </div>

                              {isCorrect && (
                                <span className="text-green-600" title="Correct">
                                  <CheckIcon />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(isMCQ ? !!correct : !!expectedAnswer || !!correct) && (
                      <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 border border-green-100">
                        <div className="text-[11px] text-green-600">
                          <span className="font-semibold">Correct Answer:</span>{" "}
                          <span className="text-green-700">
                            {isMCQ ? String(correct || "") : String(expectedAnswer || correct || "")}
                          </span>
                        </div>
                      </div>
                    )}

                    {!!rubric && (
                      <div className="mt-3 rounded-lg bg-[#f2efff] px-3 py-2 border border-indigo-100">
                        <div className="text-[11px] text-indigo-700">
                          <span className="font-semibold">Evaluation Rubric:</span>{" "}
                          <span className="text-indigo-700/90">{rubric}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsList;