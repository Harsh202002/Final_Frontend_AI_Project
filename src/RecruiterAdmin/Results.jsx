
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Eye, Trash2, X } from 'lucide-react';
import Pagination from '../components/LandingPage/Pagination';
import ViewResults from './ViewResults';
import SpinLoader from '../components/SpinLoader';
import { baseUrl } from '../utils/ApiConstants';
import { pythonUrl } from '../utils/ApiConstants';
import { testApi } from './api/tests';

function Results() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewResults, setShowViewResults] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [videoType, setVideoType] = useState(null);
  const videoRef = useRef(null);
  const [playAttemptId, setPlayAttemptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attemptsError, setAttemptsError] = useState(null);
  const mountedRef = useRef(true);

  const rowsPerPage = 5;

  const computeAttemptScore = (attempt) => {
    try {
      const rd = attempt && attempt.results_data;
      if (Array.isArray(rd)) {
        return rd.reduce((sum, it) => sum + (Number(it && it.score) || 0), 0);
      } else if (rd && typeof rd === 'number') {
        return Number(rd) || 0;
      }
    } catch (e) {
      return 0;
    }
    return 0;
  };

  const formatDate = (val) => {
    if (!val) return 'N/A';
    try {
      const dt = new Date(val);
      if (!isNaN(dt.getTime())) return dt.toISOString().split('T')[0];
    } catch (e) {
      // fallthrough
    }
    try {
      // remove GMT part if present
      return String(val).split('GMT')[0].trim();
    } catch (e) {
      return String(val);
    }
  };

  const [jobs, setJobs] = useState([]);
  const [hrJDs, setHrJDs] = useState([]);
  const [hrRaw, setHrRaw] = useState(null);

  // Fetch recruiter-created JDs and log response on page load
  const fetchMyJDs = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${baseUrl}/jd/created-by/hr`, { headers });
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        console.log('[Results] /api/jd/created-by/hr response:', json);
        // store HR response for mapping
        const list = Array.isArray(json) ? json : (json.data || (json.data === undefined ? json : []));
        setHrJDs(Array.isArray(list) ? list : []);
        setHrRaw(json);
      } catch (e) {
        console.log('[Results] /api/jd/created-by/hr raw response:', text);
        // fallback: if endpoint returns plain array text
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) setHrJDs(parsed);
          setHrRaw(parsed);
        } catch (_) {
          setHrRaw(text);
        }
      }
    } catch (e) {
      console.error('[Results] failed to fetch recruiter JDs', e);
    }
  };

  const loadFinalized = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${pythonUrl}/v1/finalise/finalized-tests`);
      if (!res.ok) {
        const txt = await res.text().catch(() => 'Failed');
        throw new Error(txt || 'Failed loading finalized tests');
      }
      const data = await res.json();
      console.log("[Result] finalized-tests result:", data);

        // `data` is expected to be an array of tests from get_finalized_test
        const rawArr = Array.isArray(data) ? data : [];
        // Count occurrences per job_id (or question_set_id fallback)
        const counts = rawArr.reduce((acc, t) => {
          const key = t.job_id || t.question_set_id || '';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const counters = {};

        const mapped = rawArr.map((t, idx) => {
          const key = t.job_id || t.question_set_id || '';
          counters[key] = (counters[key] || 0) + 1;
          const groupCount = counts[key] || 0;
          const baseTitle = t.title || 'Untitled Test';
          const numberedTitle = groupCount > 1 ? `${baseTitle} - Test ${counters[key]}` : baseTitle;

          return {
            id: idx + 1,
            jobId: t.job_id ? `#${t.job_id}` : `#${(t.question_set_id || '').slice(0, 6)}`,
            jobTitle: numberedTitle,
            totalCandidates: t.candidate_id ? (String(t.candidate_id).split(',').filter(Boolean).length) : 0,
            testDate: formatDate(t.exam_date || t.createdAt),
            createdAt: formatDate(t.createdAt),
            raw: t
          };
        });
        console.log('[Results] mapped finalized jobs count:', mapped.length);
        console.log('[Results] mapped finalized jobs sample:', mapped.slice(0, 5));
        console.log('[Results] finalized counts:', counts);
        const sortedMapped = mapped.sort((a, b) => new Date(b.testDate) - new Date(a.testDate));
        if (mountedRef.current) setJobs(sortedMapped);
      } catch (e) {
        console.error('Failed loading finalized tests', e);
        setError((e && e.message) ? String(e.message) : 'Failed loading finalized tests');
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadFinalized();
    fetchMyJDs();
    return () => { mountedRef.current = false };
  }, []);

  const retryLoad = () => {
    setError(null);
    loadFinalized();
  };

  const displayedJobs = useMemo(() => {
    if (!hrJDs || hrJDs.length === 0) return jobs;
    return jobs.filter((j) => {
      try {
        const rawJobId = j.raw?.job_id || j.raw?.jobId || j.jobId || '';
        const normalized = String(rawJobId).replace(/^#/, '');
        return hrJDs.some((h) => String(h._id) === normalized || String(h._id) === String(j.raw?.job_id));
      } catch (e) {
        return false;
      }
    });
  }, [jobs, hrJDs]);

  const filteredJobs = displayedJobs.filter((job) =>
    (job.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / rowsPerPage));
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredJobs.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewResults = (job) => {
    // fetch attempts for this test and candidate details
    (async () => {
      if (!job || !job.raw || !job.raw.question_set_id) return;
      setAttemptsLoading(true);
      setAttemptsError(null);
      try {
        const qsid = encodeURIComponent(job.raw.question_set_id);
        const res = await fetch(`${pythonUrl}/v1/test/attempts/${qsid}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => 'Failed');
          console.error('Failed to load attempts', txt);
          setAttemptsError(txt || 'Failed to load attempts');
          setAttemptsLoading(false);
          return;
        }
        const attempts = await res.json();

        // Normalize response: backend may return an array, an object {attempts: [...]},
        // or a message when no data exists. Treat 'no data' as empty attempts.
        let attemptsArr = [];
        if (Array.isArray(attempts)) {
          attemptsArr = attempts;
        } else if (attempts && Array.isArray(attempts.attempts)) {
          attemptsArr = attempts.attempts;
        } else if (attempts && attempts.message) {
          // No data for this test — show empty attempts modal
          setSelectedJob({ ...job, attempts: [], rawAttempts: [] });
          setShowViewResults(true);
          setAttemptsLoading(false);
          return;
        }

        // enrich each attempt with candidate info from public candidate API
        const enriched = await Promise.all((attemptsArr || []).map(async (a) => {
          let candidate = null;
          if (a && a.candidate_id) {
            try {
              const r2 = await fetch(`${baseUrl}/candidate/public/${encodeURIComponent(a.cid)}`);
              if (r2.ok) {
                const cdata = await r2.json();
                // API may return { success: true, candidate: { ... } } or the candidate object directly
                candidate = (cdata && cdata.candidate) ? cdata.candidate : cdata;
              }
            } catch (e) {
              // ignore
            }
          }
          return { ...a, candidate };
        }));

        // debug logs: show what we received and enriched
        console.log('Results.jsx: raw attemptsArr=', attemptsArr);
        console.log('Results.jsx: enriched attempts=', enriched);

        // Aggregate by candidate_id: sum scores and cheating counts into a single row per candidate
        const aggMap = {};
        const computeAttemptScore = (attempt) => {
          try {
            const rd = attempt.results_data;
            if (Array.isArray(rd)) {
              return rd.reduce((sum, it) => sum + (Number(it && it.score) || 0), 0);
            } else if (rd && typeof rd === 'number') {
              return Number(rd) || 0;
            }
          } catch (e) {
            return 0;
          }
          return 0;
        };

        for (const a of enriched) {
          const cid = a.candidate_id || (a.candidate && (a.candidate.id || a.candidate.candidate_id)) || 'unknown';
          const key = String(cid);
          const score = computeAttemptScore(a);
          const ts = a.created_at ? new Date(String(a.created_at)) : null;
          if (!aggMap[key]) {
            aggMap[key] = {
              candidate_id: key,
              candidate: a.candidate || null,
              totalScore: score,
              tab_switches: Number(a.tab_switches) || 0,
              inactivities: Number(a.inactivities) || 0,
              face_not_visible: Number(a.face_not_visible) || 0,
              attempts_count: 1,
              created_at: ts,
              // keep a representative recording/audio URL and raw qa_data for viewing
              video_url: a.video_url || a.video || a.videoUrl || null,
              audio_url: a.audio_url || a.audio || a.audioUrl || null,
              qa_data: a.qa_data || a.qaData || null,
            };
          } else {
            aggMap[key].totalScore += score;
            aggMap[key].tab_switches += Number(a.tab_switches) || 0;
            aggMap[key].inactivities += Number(a.inactivities) || 0;
            aggMap[key].face_not_visible += Number(a.face_not_visible) || 0;
            aggMap[key].attempts_count += 1;
            // keep latest submitted time
            if (ts && (!aggMap[key].created_at || ts > aggMap[key].created_at)) aggMap[key].created_at = ts;
            // prefer populated candidate object
            if (!aggMap[key].candidate && a.candidate) aggMap[key].candidate = a.candidate;
            // prefer newer recording/audio if this attempt is newer
            const existingTs = aggMap[key].created_at;
            if (ts && (!existingTs || ts >= existingTs)) {
              aggMap[key].video_url = a.video_url || a.video || a.videoUrl || aggMap[key].video_url;
              aggMap[key].audio_url = a.audio_url || a.audio || a.audioUrl || aggMap[key].audio_url;
              aggMap[key].qa_data = a.qa_data || a.qaData || aggMap[key].qa_data;
            }
          }
        }

        const aggregated = Object.values(aggMap).map((v) => ({
          ...v,
          // format created_at back to ISO/string for display code
          created_at: v.created_at ? v.created_at.toISOString() : null,
        }));

        setSelectedJob({ ...job, attempts: aggregated, rawAttempts: enriched });
        setShowViewResults(true);
      } catch (e) {
        console.error('Error loading attempts', e);
        setAttemptsError((e && e.message) ? String(e.message) : 'Error loading attempts');
      } finally {
        setAttemptsLoading(false);
      }
    })();
  };

  // Try to resolve a relative or partial media path to a working absolute URL by probing common prefixes.
  const resolveMediaUrl = async (raw) => {
    if (!raw) return null;
    const s = String(raw).trim();
    if (!s) return null;
    // if already absolute, return as-is
    if (/^https?:\/\//i.test(s)) return s;

    const prefixes = [
      baseUrl.replace(/\/$/, ''),
      pythonUrl.replace(/\/$/, ''),
      window.location.origin.replace(/\/$/, ''),
      // also try removing '/api' if present in baseUrl
      baseUrl.replace(/\/api\/?$/, ''),
    ];

    for (const p of prefixes) {
      try {
        const candidate = `${p}${s.startsWith('/') ? '' : '/'}${s}`;
        // First try HEAD to avoid downloading full file
        const headResp = await fetch(candidate, { method: 'HEAD' });
        if (headResp && headResp.ok) return candidate;
        // fallback: try GET for servers that don't support HEAD but allow byte ranges
        const getResp = await fetch(candidate, { method: 'GET', headers: { Range: 'bytes=0-0' } });
        if (getResp && (getResp.ok || getResp.status === 206)) return candidate;
      } catch (e) {
        // ignore and try next prefix
      }
    }

    // last resort: return original raw as relative (browser may still resolve if served)
    return s;
  };

  // Lightweight endpoint-backed video player that queries the server for a full URL.
  const VideoPlayer = ({ attemptId }) => {
    const [url, setUrl] = useState(null);
    const [loadingUrl, setLoadingUrl] = useState(false);
    useEffect(() => {
      let mounted = true;
      if (!attemptId) {
        setUrl(null);
        return () => { mounted = false; };
      }
      setLoadingUrl(true);
      testApi.getVideoUrl(attemptId)
        .then((j) => {
          if (!mounted) return;
          const v = j && (j.video_url || j.videoUrl || j.url || (j.data && j.data.video_url));
          setUrl(v || null);
        })
        .catch((e) => {
          console.error('VideoPlayer getVideoUrl failed', e);
          if (mounted) setUrl(null);
        })
        .finally(() => { if (mounted) setLoadingUrl(false); });
      return () => { mounted = false; };
    }, [attemptId]);

    if (loadingUrl) return <div className="text-white p-4">Loading video...</div>;
    if (!url) return <div className="text-white p-4">No video available</div>;
    return (
      <video controls autoPlay muted playsInline style={{ maxWidth: '100%' }}>
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    );
  };

  const handleDelete = async (job) => {
    if (!job || !job.raw || !job.raw.question_set_id) return;
    const ok = window.confirm(`Delete test "${job.jobTitle}"? This cannot be undone.`);
    if (!ok) return;
    try {
      const qsid = encodeURIComponent(job.raw.question_set_id);
      const res = await fetch(`${pythonUrl}/v1/finalise/finalized-test/${qsid}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text();
        alert('Delete failed: ' + txt);
        return;
      }
      // remove from UI
      setJobs(prev => prev.filter(j => j.id !== job.id));
    } catch (e) {
      console.error('Delete failed', e);
      alert('Delete failed');
    }
  };

  const closeModal = () => {
    setShowViewResults(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className={`${(loading || attemptsLoading) ? 'filter blur-sm pointer-events-none' : ''} max-w-7xl mx-auto`}>

        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-6 mb-8">

          {/* <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
            <div className="bg-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Total Jobs</h2>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">{jobs.length}</p>
            </div>

            <div className="bg-green-100 rounded-2xl p-6 sm:p-8 shadow-sm flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Total Candidates</h2>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600">
                {jobs.reduce((sum, j) => sum + j.totalCandidates, 0)}
              </p>
            </div>
          </div> */}

          <div className="flex items-end">
            <div className="relative w-full sm:w-[280px]">
              <input
                type="text"
                placeholder="Search by Job Title"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Search size={20} />
              </button>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full min-w-[640px]">

              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">S.No</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Job Title</th>
                  {/* <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Total Candidate</th> */}
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Test Date</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Created At</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((job, index) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300">
                        {(indexOfFirstRow + index + 1)}.
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300">{job.jobTitle}</td>
                      {/* <td className="px-4 py-4 border-b border-gray-300">
                        <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1 bg-green-200 text-green-800 text-sm font-medium rounded-full">
                          {job.totalCandidates}
                        </span>
                      </td> */}
                      <td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300">
                        {job.testDate || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300">
                        {job.createdAt || 'N/A'}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-300">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewResults(job)}
                            className="p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition-colors"
                            aria-label="View job"
                          >
                            <Eye size={16} />
                          </button>
                          {/* <button
                            onClick={() => handleDelete(job)}
                            className="p-2 text-red-500 border border-red-500 rounded hover:bg-red-50 transition-colors"
                            aria-label="Delete job"
                          >
                            <Trash2 size={16} />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {/* {hrRaw && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">HR /api/jd/created-by/hr response</h4>
            <pre className="text-xs overflow-auto max-h-64">{typeof hrRaw === 'string' ? hrRaw : JSON.stringify(hrRaw, null, 2)}</pre>
          </div>
        )} */}
      </div>
      {/* Loading overlay for initial load */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/90 rounded-lg p-6 flex flex-col items-center gap-3">
            <SpinLoader />
            <div className="text-sm text-gray-700">Loading tests...</div>
          </div>
        </div>
      )}

      {/* Error fallback for initial load */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 p-4">
          <div className="max-w-lg w-full bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Failed to load tests</h3>
            <p className="text-sm text-gray-600 mb-4">{String(error)}</p>
            <div className="flex gap-2">
              <button onClick={retryLoad} className="px-3 py-2 bg-blue-600 text-white rounded">Retry</button>
              <button onClick={() => setError(null)} className="px-3 py-2 bg-gray-100 rounded">Dismiss</button>
            </div>
          </div>
        </div>
      )}


      {showViewResults && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b relative">
              <h3 className="text-lg font-semibold">Test: {selectedJob.jobTitle}</h3>
              <div className="flex items-center gap-2">
                <button onClick={closeModal} className="px-3 py-1 bg-gray-100 rounded">Close</button>
                <button onClick={closeModal} aria-label="Close" className="p-2 rounded bg-transparent hover:bg-gray-100">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-4">
              {attemptsLoading ? (
                <div className="flex items-center gap-3"><SpinLoader /> <span>Loading attempts...</span></div>
              ) : attemptsError ? (
                <div className="p-4 text-center text-sm text-red-600">
                  <div className="mb-3">{String(attemptsError)}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleViewResults(selectedJob)} className="px-3 py-2 bg-blue-600 text-white rounded">Retry</button>
                    <button onClick={() => setAttemptsError(null)} className="px-3 py-2 bg-gray-100 rounded">Dismiss</button>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">S.No</th>
                        <th className="p-2 text-left">Candidate</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Score</th>
                        <th className="p-2 text-left">Tab Switches</th>
                        <th className="p-2 text-left">Inactivities</th>
                        <th className="p-2 text-left">Face Not Visible</th>
                        <th className="p-2 text-left">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedJob.attempts || []).length === 0 ? (
                        <tr><td colSpan="8" className="p-4 text-center text-gray-500">No attempts found.</td></tr>
                      ) : (
                        selectedJob.attempts.map((a, i) => {
                          // Prefer aggregated totalScore (from aggregation step). Fallback to summing results_data if missing.
                          let score = '';
                          try {
                            if (a && Number.isFinite(a.totalScore)) {
                              score = a.totalScore.toFixed ? a.totalScore.toFixed(2) : String(a.totalScore);
                            } else {
                              const rd = a.results_data;
                              if (Array.isArray(rd)) {
                                const s = rd.reduce((sum, it) => sum + (Number(it && it.score) || 0), 0);
                                score = Number.isFinite(s) ? s.toFixed(2) : '';
                              } else if (rd && typeof rd === 'number') {
                                score = rd.toFixed ? rd.toFixed(2) : String(rd);
                              }
                            }
                          } catch (e) {
                            score = '';
                          }

                          const cand = a.candidate || {};
                          // debug per-row candidate object
                          console.log('Results.jsx: rendering attempt', { attempt: a, candidate: cand });
                          // prefer full name, then first+last, then email as fallback
                          const name = cand.name || `${cand.firstName || ''} ${cand.lastName || ''}`.trim() || cand.fullName || cand.username || a.candidate_id || 'N/A';
                          const email = cand.email || cand.emailAddress || cand.contact_email || cand.username || 'N/A';
                          const cid = a.candidate_id || a.candidate?.id || a.candidate_id || 'unknown';
                          let displayScore = score;

                          return (
                            <>
                              <tr key={a.candidate_id || i} className="border-b">
                                <td className="p-2">{i+1}.</td>
                                <td className="p-2">{name}</td>
                                <td className="p-2">{email}</td>
                                <td className="p-2">{displayScore}</td>
                                <td className="p-2">{a.tab_switches ?? 0}</td>
                                <td className="p-2">{a.inactivities ?? 0}</td>
                                <td className="p-2">{a.face_not_visible ?? 0}</td>
                                <td className="p-2 flex items-center gap-2">
                                          <span>{a.created_at ? String(a.created_at).split('T')[0] : 'N/A'}</span>
                                          {a.video_url && (
                                            <button
                                              onClick={() => {
                                                try {
                                                  const cid = a.candidate_id || a.candidate?.id || a.candidate?._id || a.candidate?.candidate_id || String(i);
                                                  setPlayAttemptId(cid || String(i));
                                                } catch (e) {
                                                  console.error('Play click failed', e);
                                                }
                                              }}
                                              className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                              Play Video
                                            </button>
                                          )}

                                </td>
                              </tr>

                            </>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Video overlay */}
      {videoSrc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            <button
              onClick={() => {
                try { if (videoSrc && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc); } catch(_){}
                setVideoSrc(null); setVideoError(null);
              }}
              className="absolute right-2 top-2 bg-white/90 text-black rounded px-2 py-1 z-50"
            >
              Close
            </button>
            {videoLoading ? (
              <div className="w-full h-64 flex items-center justify-center text-white">Loading video...</div>
            ) : videoError ? (
              <div className="w-full p-6 text-white">
                <div className="mb-3">Failed to load video: {videoError}</div>
                <div className="flex gap-2">
                  <a href={videoSrc} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white text-black rounded">Open in new tab</a>
                  <button onClick={() => { try { if (videoSrc && videoSrc.startsWith('blob:')) URL.revokeObjectURL(videoSrc); } catch(_){}; setVideoSrc(null); setVideoError(null); }} className="px-3 py-2 bg-gray-200 rounded">Close</button>
                </div>
              </div>
            ) : (
              <video key={videoSrc} controls autoPlay playsInline crossOrigin="anonymous" className="w-full h-full bg-black" src={videoSrc}>
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
      {playAttemptId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative p-4">
            <button
              onClick={() => setPlayAttemptId(null)}
              className="absolute right-2 top-2 bg-white/90 text-black rounded px-2 py-1 z-50"
            >
              Close
            </button>
            <div className="text-white mb-2">Playing attempt: {String(playAttemptId)}</div>
            <VideoPlayer attemptId={playAttemptId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;