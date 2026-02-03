import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pagination from '../components/LandingPage/Pagination';
import AssessmentAPI from "./api/generateAssessmentApi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const QuestionsList = () => {
    const { questionSetId  } = useParams(); // assessment ID
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const questionsPerPage = 4;

    const getQuestionType = (q) => {
        if (Array.isArray(q.content?.options) && q.content.options.length > 0)
            return "MCQ";
        if (q.type === "coding" || q.content?.code)
            return "Coding";
        if (q.type === "audio" || q.content?.audio)
            return "Audio";
        if (q.type === "video" || q.content?.video)
            return "Video";

        return "General";
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(null);
                try {
                const data = await AssessmentAPI.getQuestionsByAssessmentId(questionSetId);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDownloadPDF = async () => {
        try {
            const title = 'Assessment Questions';

            // Build an offscreen DOM node containing the printable content
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '800px';
            container.style.padding = '24px';
            container.style.background = '#fff';
            container.style.color = '#111827';

            const header = document.createElement('div');
            header.innerHTML = `<h1 style="font-size:20px;margin-bottom:8px">${title}</h1><p>Total questions: ${questions.length}</p>`;
            container.appendChild(header);

                questions.forEach((q, idx) => {
                const prompt = q.content?.prompt_text || q.content?.prompt || q.content?.question || '';
                const qDiv = document.createElement('div');
                qDiv.style.marginBottom = '14px';
                qDiv.innerHTML = `<div><strong>Q${idx + 1}.</strong> ${prompt}</div>`;

                if (Array.isArray(q.content?.options) && q.content.options.length > 0) {
                    const ol = document.createElement('ol');
                    ol.style.margin = '6px 0 0 18px';
                    q.content.options.forEach(opt => {
                        const li = document.createElement('li');
                        li.textContent = opt;
                        ol.appendChild(li);
                    });
                    qDiv.appendChild(ol);

                    const correct = q.content?.answer || q.content?.correct || q.content?.correct_answer || q.content?.answer_key;
                    if (correct) {
                        const c = document.createElement('div');
                        c.innerHTML = `<strong>Correct:</strong> ${correct}`;
                        qDiv.appendChild(c);
                    }
                }

                container.appendChild(qDiv);
            });

            document.body.appendChild(container);

            // Render container to canvas and generate PDF
            const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > -0.1) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const filename = `Assessment-${questionSetId || 'questions'}.pdf`;
            pdf.save(filename);

            // cleanup
            document.body.removeChild(container);
        } catch (err) {
            console.error('PDF generation failed', err);
            alert('Failed to generate PDF.');
        }
    };

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div className="text-center text-red-500 py-6">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto mt-8 px-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
                <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight">
                    Questions List
                </h1>
                <div className="flex items-center gap-1">
                    <div onClick={handleDownloadPDF} role="button" tabIndex={0} className="cursor-pointer px-4 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold rounded-full shadow border border-indigo-200 text-sm">
                        Download PDF
                    </div>
                    <div className="px-4 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold rounded-full shadow border border-indigo-200 text-sm">
                        Total: {questions.length}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {currentQuestions.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                        No questions found for this assessment.
                    </div>
                ) : (
                    currentQuestions.map((q, index) => {
                    const questionNumber = startIndex + index + 1;
                    return (
                        <div key={q.question_id} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <div className="w-full text-sm">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-left border-b border-gray-200">
                                        <div className="px-5 py-2 font-semibold flex justify-between bg-[#6D28D91F]">
                                            <span>Question {questionNumber}</span>

                                            {/* Type Label */}
                                            <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 shadow">
                                                {getQuestionType(q)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hover:bg-gradient-to-r from-indigo-50 to-purple-50 transition-all duration-200">
                                        <div className="px-5 py-3 text-gray-700">
                                            <p className="font-semibold text-gray-900 mb-1 whitespace-pre-line">
                                                Q. {q.content?.prompt_text || q.content?.prompt || q.content?.question}
                                            </p>

                                            {/* MCQ options */}
                                            {q.content?.options && (
                                                <ul className="list-disc ml-5 space-y-0.5">
                                                    {q.content.options.map((opt, idx) => (
                                                        <li key={idx} className="text-gray-600">{opt}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {Array.isArray(q.content?.options) && q.content.options.length > 0 && (
                                                <div className="mt-3 inline-block px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200 shadow-sm">
                                                    Correct: {
                                                        q.content?.answer ||
                                                        q.content?.correct ||
                                                        q.content?.correct_answer ||
                                                        q.content?.answer_key
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    })
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default QuestionsList;
