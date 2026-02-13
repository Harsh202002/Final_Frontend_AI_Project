// import React, {
//   useEffect,
//   useRef,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import { pythonUrl } from "../../utils/ApiConstants";
 
// const WebCamRecorder = forwardRef(
//   (
//     {
//       questions = [],
//       candidateId,
//       questionSetId,
//       onComplete = () => {},
//       showMultipleFaces = false,
//       sharedStream = null,
//       autoStart = true,
//       previewOnly = false,
//       allowUpload = true,
//       isSharedStreamOnly = false, // If true, never create new stream - only use shared
//     },
//     ref
//   ) => {
//     const videoRef = useRef(null);
//     const streamRef = useRef(null);
//     const createdStreamRef = useRef(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
 
//     const [interviewStarted, setInterviewStarted] = useState(false);
//     const [interviewEnded, setInterviewEnded] = useState(false);
//     const [currentAnswer, setCurrentAnswer] = useState("");
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const qaListRef = useRef([]);
//     const [status, setStatus] = useState("Idle");
//     const [uploading, setUploading] = useState(false);

//     // Component identifier for logging
//     const componentId = `[${previewOnly ? 'MODAL' : 'PERSISTENT'}]`;

//     // Initialize qa list with question metadata so indices exist and ids are preserved
//     useEffect(() => {
//       try {
//         qaListRef.current = (questions || []).map((q) => ({
//           question_id: q.question_id || q.id || q._id || null,
//           question: (q.prompt_text || q.question) || '',
//           answer: '',
//         }));
//       } catch (e) { console.warn('qaList init failed', e); }
//     }, [questions]);
 
//     const prompt =
//       (questions[currentIndex]?.prompt_text || questions[currentIndex]?.question) ||
//       "Please answer this question.";

//     // ---------------------------------------------------------
//     // Initialize Camera + MediaRecorder (ONCE on mount - never re-run)
//     // ---------------------------------------------------------
//     useEffect(() => {
//       let isMounted = true;
//       const maxRetries = 3;
      
//       const initRecorder = async () => {
//         if (!isMounted) return;
        
//         try {
//           console.log(componentId, '🔧 Init: Preparing stream (NOT creating MediaRecorder yet)');
          
//           // Step 1: Try shared stream first
//           let stream = null;
//           if (sharedStream) {
//             const tracks = sharedStream.getVideoTracks();
//             const hasLiveTrack = tracks.some(t => t && t.readyState === 'live');
            
//             if (hasLiveTrack) {
//               console.log(componentId, '✅ Init: Shared stream has live video track, using it');
//               stream = sharedStream;
//             } else {
//               console.log(componentId, '⚠️ Init: Shared stream has no live tracks (state: ended), will get fresh stream');
//             }
//           } else {
//             console.log(componentId, '⚠️ Init: No sharedStream available yet, will get fresh stream');
//           }
          
//           // Step 2: If shared stream invalid, get fresh stream
//           if (!stream) {
//             console.log(componentId, '📍 Init: Requesting fresh stream via getUserMedia...');
//             let lastError;
//             for (let attempt = 0; attempt < maxRetries; attempt++) {
//               try {
//                 console.log(componentId, `  Attempt ${attempt + 1}/${maxRetries}...`);
//                 stream = await navigator.mediaDevices.getUserMedia({
//                   video: true,
//                   audio: true,
//                 });
//                 createdStreamRef.current = true;
//                 console.log(componentId, '✅ Init: Fresh stream obtained');
//                 break;
//               } catch (e) {
//                 lastError = e;
//                 console.warn(componentId, `  ❌ Attempt ${attempt + 1}/${maxRetries} failed:`, e.name, e.message);
//                 if (attempt < maxRetries - 1) {
//                   await new Promise(r => setTimeout(r, 500));
//                 }
//               }
//             }
//             if (!stream) {
//               const errMsg = lastError?.name || 'Unknown error';
//               const errDetail = lastError?.message || 'Could not access camera';
//               throw new Error(`Cannot obtain camera stream (${errMsg}): ${errDetail}`);
//             }
//           }
          
//           if (!isMounted) return;
//           streamRef.current = stream;
//           console.log(componentId, '✅ Init: Stream stored in streamRef');
          
//           // Step 3: Validate stream has required tracks and enable them
//           const videoTracks = stream.getVideoTracks();
//           const audioTracks = stream.getAudioTracks();
          
//           console.log(componentId, '📊 Init: Stream validation:', {
//             videoTracks: videoTracks.length,
//             audioTracks: audioTracks.length,
//             videoStates: videoTracks.map(t => `${t.kind}:${t.readyState}`)
//           });
          
//           if (videoTracks.length === 0) {
//             throw new Error('Stream has no video tracks');
//           }
          
//           // Enable all tracks - critical for stream to work
//           videoTracks.forEach(t => { if (t) t.enabled = true; });
//           audioTracks.forEach(t => { if (t) t.enabled = true; });
          
//           if (!isMounted) return;
          
//           // Attach to preview if needed (but don't create MediaRecorder yet)
//           if (videoRef.current && !previewOnly) {
//             try { videoRef.current.srcObject = stream; } catch (e) {}
//           }
          
//           // Handle preview-only mode
//           if (previewOnly) {
//             if (videoRef.current) {
//               try { videoRef.current.srcObject = stream; } catch (e) {}
//             }
//             setStatus('Preview');
//             return;
//           }
          
//           setStatus("Ready to record");
//           console.log(componentId, '✅ Init: Complete - stream ready, MediaRecorder will be created at startInterview()');
          
//         } catch (err) {
//           console.error(componentId, "❌ Init failed:", err.message);
//           console.error(componentId, "  Full error:", err);
//           setStatus("Init failed: " + err.message);
//           // Don't set mediaRecorderRef to undefined - let startInterview try to recover
//         }
//       };
 
//       initRecorder();
 
//       // Cleanup: only stop stream if WE created it (not shared)
//       // For shared streams, never stop them - parent will manage lifecycle
//       return () => {
//         isMounted = false;
//         // NEVER stop the MediaRecorder in cleanup - it needs to continue recording
//         // The recorder is only stopped explicitly via uploadRecording() or endInterview()
        
//         // Only stop audio/video TRACKS if we created the stream ourselves
//         if (createdStreamRef.current && streamRef.current) {
//           try { 
//             streamRef.current.getTracks().forEach((t) => t.stop()); 
//           } catch (e) {}
//         }
//       };
//     }, []);  // Empty dependency - init runs ONCE on component mount only

//     // ---------------------------------------------------------
//     // Stream Monitoring Effect - Just ensure streamRef is populated
//     // ---------------------------------------------------------
//     useEffect(() => {
//       if (sharedStream && !streamRef.current) {
//         streamRef.current = sharedStream;
//         console.log(componentId, '📍 Stream effect: Set streamRef to sharedStream');
//       }
//     }, [sharedStream]);

//     // ---------------------------------------------------------
//     // Start Recording - Create recorder fresh, then start immediately
//     // ---------------------------------------------------------
//     const startInterview = async () => {
//       console.log(componentId, '📍 startInterview() called');
      
//       // Guard against calling twice
//       if (interviewStarted) {
//         console.log(componentId, '⚠️ Recording already started, ignoring');
//         return;
//       }
      
//       try {
//         // Step 1: Get the best available stream
//         let recordingStream = streamRef.current || sharedStream || window.__candidateCameraStream;
        
//         console.log(componentId, '📍 Looking for stream to record with...');
//         console.log(componentId, '  - streamRef.current:', !!streamRef.current);
//         console.log(componentId, '  - sharedStream:', !!sharedStream);
//         console.log(componentId, '  - window.__candidateCameraStream:', !!window.__candidateCameraStream);
        
//         // Step 2: Validate stream quality - strict check
//         let isStreamValid = false;
//         if (recordingStream) {
//           const videoTracks = recordingStream.getVideoTracks();
//           const videoStates = videoTracks.map(t => t?.readyState);
//           console.log(componentId, '  - Checking stream validity. Video states:', videoStates);
          
//           // Accept "live" or "live-or-pending" - don't accept "ended"
//           isStreamValid = videoTracks.length > 0 && videoTracks.some(t => t && (t.readyState === 'live'));
          
//           if (!isStreamValid) {
//             console.warn(componentId, '⚠️ Current stream invalid (no live tracks), will get fresh stream');
//           }
//         }
        
//         // Step 3: If no valid stream, request fresh one with retries
//         if (!recordingStream || !isStreamValid) {
//           console.log(componentId, '📍 Requesting fresh stream via getUserMedia...');
//           let lastError;
//           for (let attempt = 0; attempt < 3; attempt++) {
//             try {
//               console.log(componentId, `  Attempt ${attempt + 1}/3...`);
//               recordingStream = await navigator.mediaDevices.getUserMedia({
//                 video: { facingMode: 'user' },
//                 audio: true,
//               });
//               createdStreamRef.current = true;
//               streamRef.current = recordingStream;
//               console.log(componentId, '✅ Fresh stream obtained');
//               break;
//             } catch (e) {
//               lastError = e;
//               console.warn(componentId, `  ❌ Attempt ${attempt + 1}/3 failed:`, e.name, e.message);
//               if (attempt < 2) {
//                 await new Promise(r => setTimeout(r, 300));
//               }
//             }
//           }
          
//           if (!recordingStream) {
//             console.error(componentId, '❌ Failed to get stream after retries');
//             alert(`Camera access failed: ${lastError?.message || 'Unknown error'}\n\nPlease check:\n- Browser camera permissions\n- No other app using camera\n- Camera is enabled`);
//             return;
//           }
//         }
        
//         // Step 4: Final validation before creating recorder
//         console.log(componentId, '📊 Final stream validation...');
//         const videoTracks = recordingStream.getVideoTracks();
//         const audioTracks = recordingStream.getAudioTracks();
        
//         console.log(componentId, '  - Video tracks:', videoTracks.length, videoTracks.map(t => `${t.readyState}`).join(', '));
//         console.log(componentId, '  - Audio tracks:', audioTracks.length, audioTracks.map(t => `${t.readyState}`).join(', '));
        
//         if (videoTracks.length === 0) {
//           console.error(componentId, '❌ No video tracks in stream');
//           alert("Stream has no video tracks. Please check camera access.");
//           return;
//         }
        
//         // Check if ANY video track is alive
//         const hasLiveVideoTrack = videoTracks.some(t => t && t.readyState === 'live');
//         if (!hasLiveVideoTrack) {
//           console.error(componentId, '❌ No LIVE video tracks - all tracks are:', videoTracks.map(t => t.readyState));
//           console.log(componentId, '🔄 Trying to request fresh stream since shared stream is dead...');
          
//           try {
//             recordingStream = await navigator.mediaDevices.getUserMedia({
//               video: { facingMode: 'user' },
//               audio: true,
//             });
//             createdStreamRef.current = true;
//             streamRef.current = recordingStream;
//             console.log(componentId, '✅ Fresh stream obtained after retry');
//           } catch (err) {
//             console.error(componentId, '❌ Emergency fresh stream request failed:', err.message);
//             alert(`Cannot access camera: ${err.message}`);
//             return;
//           }
//         }
        
//         // Re-check after potential refresh
//         const finalVideoTracks = recordingStream.getVideoTracks();
//         const finalAudioTracks = recordingStream.getAudioTracks();
        
//         // Force enable all tracks
//         console.log(componentId, '🔄 Enabling all tracks...');
//         finalVideoTracks.forEach((t, i) => {
//           if (t) {
//             t.enabled = true;
//             console.log(componentId, `  ✓ Video track ${i}: enabled (${t.readyState})`);
//           }
//         });
//         finalAudioTracks.forEach((t, i) => {
//           if (t) {
//             t.enabled = true;
//             console.log(componentId, `  ✓ Audio track ${i}: enabled (${t.readyState})`);
//           }
//         });
        
//         // Step 5: Find best supported MIME type
//         let mimeType = 'video/webm;codecs=vp8,opus';
//         const supportedTypes = [
//           'video/webm;codecs=vp8,opus',
//           'video/webm;codecs=vp9,opus',
//           'video/webm',
//           'video/mp4',
//         ];
//         for (const type of supportedTypes) {
//           if (MediaRecorder.isTypeSupported(type)) {
//             mimeType = type;
//             console.log(componentId, `  ✓ Using MIME type: ${mimeType}`);
//             break;
//           }
//         }
        
//         // Step 6: Create FRESH MediaRecorder right before we need it
//         console.log(componentId, '📍 Creating MediaRecorder with stream having', finalVideoTracks.length, 'video tracks...');
//         let mediaRecorder;
//         try {
//           mediaRecorder = new MediaRecorder(recordingStream, { mimeType });
//           console.log(componentId, '✅ MediaRecorder created, state:', mediaRecorder.state);
//         } catch (recorderErr) {
//           console.error(componentId, '❌ Failed to create MediaRecorder:', recorderErr.message);
//           console.error(componentId, '  Stream state:', {
//             videoTracks: finalVideoTracks.length,
//             audioTracks: finalAudioTracks.length,
//             videoReadyStates: finalVideoTracks.map(t => t.readyState),
//             audioReadyStates: finalAudioTracks.map(t => t.readyState),
//           });
//           alert(`Cannot create recorder: ${recorderErr.message}`);
//           return;
//         }
        
//         mediaRecorderRef.current = mediaRecorder;
        
//         // Step 7: Setup event handlers
//         mediaRecorder.ondataavailable = (e) => {
//           if (e.data.size > 0) {
//             chunksRef.current.push(e.data);
//             console.log(componentId, `  🔊 Chunk #${chunksRef.current.length}: ${(e.data.size / 1024).toFixed(2)} KB`);
//           }
//         };
        
//         mediaRecorder.onerror = (e) => {
//           console.error(componentId, '❌ MediaRecorder runtime error:', e.error);
//         };
        
//         mediaRecorder.onstop = () => {
//           console.log(componentId, '🛑 Recording stopped - total chunks:', chunksRef.current.length);
//           setInterviewEnded(true);
//         };
        
//         // Step 8: Clear chunks and prepare to start
//         chunksRef.current = [];
//         console.log(componentId, '🔄 Cleared chunks, preparing to start...');
        
//         // Small delay for browser to fully initialize MediaRecorder
//         await new Promise(r => setTimeout(r, 200));
        
//         // Step 9: Final validation right before start()
//         console.log(componentId, '📍 Final validation before .start()...');
//         const preStartVideoTracks = recordingStream.getVideoTracks();
//         const preStartAudioTracks = recordingStream.getAudioTracks();
//         console.log(componentId, '  Video:', preStartVideoTracks.map(t => `${t.readyState}/${t.enabled ? 'on' : 'off'}`).join(', '));
//         console.log(componentId, '  Audio:', preStartAudioTracks.map(t => `${t.readyState}/${t.enabled ? 'on' : 'off'}`).join(', '));
        
//         // Step 10: Call start() with careful error handling
//         try {
//           console.log(componentId, '📍 Calling mediaRecorder.start(1000)...');
//           mediaRecorder.start(1000); // Request data every 1000ms
//           console.log(componentId, '🎥 [RECORDING START] Recording started successfully - state:', mediaRecorder.state);
//           setInterviewStarted(true);
//           setStatus("Recording...");
//         } catch (startErr) {
//           console.error(componentId, '❌ CRITICAL: mediaRecorder.start() failed:', startErr.message);
//           console.error(componentId, '  Error name:', startErr.name);
//           console.error(componentId, '  MediaRecorder state:', mediaRecorder.state);
//           console.error(componentId, '  Stream video tracks:', finalVideoTracks.map(t => ({
//             id: t.id,
//             enabled: t.enabled,
//             readyState: t.readyState,
//             muted: t.muted,
//           })));
//           console.error(componentId, '  Stream audio tracks:', finalAudioTracks.map(t => ({
//             id: t.id,
//             enabled: t.enabled,
//             readyState: t.readyState,
//             muted: t.muted,
//           })));
          
//           mediaRecorderRef.current = null;
//           alert(`Recording failed to start: ${startErr.message}\n\nPlease:\n1. Close other apps using camera\n2. Check camera is connected\n3. Refresh and try again`);
//           return;
//         }
        
//       } catch (e) {
//         console.error(componentId, '❌ startInterview error:', e.message);
//         alert(`Recording error: ${e.message}`);
//       }
//     };
 
    

// // ---------------------------------------------------------
// // Auto-start recording when autoStart prop turns true

//     // ---------------------------------------------------------
//     // Stop Recording
//     // ---------------------------------------------------------
//     const pushAnswerForIndex = (idx, ans) => {
//       const item = {
//         question_id: questions[idx]?.question_id || questions[idx]?.id,
//         question: (questions[idx]?.prompt_text || questions[idx]?.question) || '',
//         answer: ans ? ans.trim() : '',
//       };
//       // ensure array size and set at index
//       qaListRef.current = qaListRef.current || [];
//       qaListRef.current[idx] = item;
//     };

//     const endInterview = async () => {
//       try {
//         pushAnswerForIndex(currentIndex, currentAnswer);
//       } catch (e) {}

//       if (mediaRecorderRef.current?.state === "recording") {
//         mediaRecorderRef.current.stop();
//         console.log('🛑 [RECORDING STOP] Persistent recorder stopped. Total chunks collected:', chunksRef.current.length);
//       }
//     };

//     // Wait until recorder 'stop' event fires (returns a Promise)
//     const stopRecordingWait = () => {
//       return new Promise((resolve) => {
//         const rec = mediaRecorderRef.current;
//         if (!rec || rec.state === 'inactive') return resolve();
//         const onStop = () => {
//           try { rec.removeEventListener('stop', onStop); } catch (e) {}
//           resolve();
//         };
//         try {
//           rec.addEventListener('stop', onStop);
//           try { rec.stop(); } catch (e) { onStop(); }
//         } catch (e) {
//           onStop();
//         }
//       });
//     };
 
//     // ---------------------------------------------------------
//     // Upload Recording to Backend
//     // ---------------------------------------------------------
//     // Upload Recording to Backend (for all questions answered)
//     // ---------------------------------------------------------
//       const uploadRecording = async () => {
//       if (!allowUpload) {
//         // Ensure recorder is stopped/flushed so parent recording (if any) can handle finalization
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//           try { mediaRecorderRef.current.requestData(); } catch (e) {}
//           await stopRecordingWait();
//         }
//         const qa_data = (qaListRef.current || []).map((item, idx) => ({
//           question_id: item?.question_id || questions[idx]?.question_id || questions[idx]?.id,
//           question: item?.question || questions[idx]?.prompt_text || questions[idx]?.question || '',
//           answer: item?.answer || '',
//         }));
//         setStatus('Upload deferred');
//         // Do NOT call onComplete because parent will handle upload
//         setUploading(false);
//         return { qa_data, skipped: true };
//       }
//       setUploading(true);
      
//       console.log('📍 uploadRecording starting, mediaRecorderRef exists?', !!mediaRecorderRef.current);
//       console.log('  - Current recorder state:', mediaRecorderRef.current?.state);
//       console.log('  - Current chunks before flushing:', chunksRef.current.length);
      
//       // ensure recorder has flushed final chunks
//       if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//         console.log('📍 Recorder still recording, requesting final data...');
//         // Request final data flush before stopping
//         try {
//           mediaRecorderRef.current.requestData();
//           console.log('  ✅ requestData() called');
//         } catch (e) { console.warn('  ❌ requestData failed:', e); }
        
//         // Wait for ondataavailable to fire
//         await new Promise(resolve => setTimeout(resolve, 200));
//         console.log('  - Chunks after wait:', chunksRef.current.length);
        
//         await stopRecordingWait();
//         console.log('  - Chunks after stopRecordingWait:', chunksRef.current.length);
//       } else {
//         console.log('📍 Recorder not in recording state, already stopped');
//       }

//       console.log(componentId, '📍 Final chunk count before upload check:', chunksRef.current.length);
      
//       if (!chunksRef.current.length) {
//         console.error(componentId, '❌ NO CHUNKS RECORDED');
//         console.error(componentId, '  Diagnostics:');
//         console.error(componentId, '  - mediaRecorderRef exists:', !!mediaRecorderRef.current);
//         console.error(componentId, '  - mediaRecorderRef state:', mediaRecorderRef.current?.state);
//         console.error(componentId, '  - interviewStarted state:', interviewStarted);
//         console.error(componentId, '  - This means ondataavailable was never called during recording, or chunks were cleared');
//         alert("No video recorded! Check console - recording may not have started properly.");
//         setUploading(false);
//         return null;
//       }

//       const blob = new Blob(chunksRef.current, { type: "video/webm" });
//       const filename = `video_${candidateId}_${Date.now()}.webm`;

//       const file = new File([blob], filename, { type: "video/webm" });

//       // use accumulated QA list
//       // ensure we have a safe copy of QA data
//       const qa_data = (qaListRef.current || []).map((item, idx) => ({
//         question_id: item?.question_id || questions[idx]?.question_id || questions[idx]?.id,
//         question: item?.question || questions[idx]?.prompt_text || questions[idx]?.question || '',
//         answer: item?.answer || '',
//       }));

//       const fd = new FormData();
//       fd.append("file", file);
//       fd.append("candidate_id", candidateId);
//       fd.append("question_set_id", questionSetId);
//       fd.append("qa_data", JSON.stringify(qa_data));

//       setStatus("Uploading video...");

//       try {
//         console.log('📤 [UPLOADING VIDEO] Starting upload to backend...');
//         const res = await fetch(`${pythonUrl}/v1/upload_video`, {
//           method: "POST",
//           body: fd,
//         });

//         if (!res.ok) {
//           const txt = await res.text();
//           console.error("Upload failed:", txt);
//           alert("Video upload failed!");
//           setStatus("Upload failed");
//           return { qa_data, error: txt };
//         }

//         const data = await res.json();
//         console.log('✅ [UPLOAD COMPLETE] Video uploaded successfully with', chunksRef.current.length, 'chunks');
//         setStatus("Video uploaded!");
//         // notify parent with qa_data
//         try { onComplete(qa_data); } catch (e) { console.warn('onComplete callback failed', e); }
//         return { qa_data, response: data };

//       } catch (err) {
//         console.error("Upload error:", err);
//         alert("Failed to upload video!");
//         setStatus("Upload failed");
//         return { qa_data, error: err };
//       } finally {
//         setUploading(false);
//       }
//       }
//     // ---------------------------------------------------------
//     // Exposed methods for parent component (GiveTest.jsx)
//     // ---------------------------------------------------------
//     useImperativeHandle(ref, () => ({
//       startInterview,
//       endInterview,
//       uploadRecording,
//       stopAll: () => {
//         try {
//           endInterview();
//           if (createdStreamRef.current) {
//             streamRef.current?.getTracks().forEach((t) => t.stop());
//           }
//         } catch {}
//       },
//     }));
 
//     return (
// <div className="p-4 bg-white rounded shadow relative">
//       {showMultipleFaces && (
//         <>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50" />
//           <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-60 bg-yellow-400 text-black px-4 py-2 rounded shadow">
//             🚨 Multiple faces detected — page blurred
//           </div>
//         </>
//       )}
// <h2 className="text-xl font-bold mb-4">Video Interview</h2>
 
//         {/* Live Camera Feed */}
// <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           className="w-full h-72 bg-black rounded"
//         />
 
//         {/* Question */}
// <div className="mt-4">
// <h3 className="font-semibold mb-2">Question:</h3>
// <p className="p-3 bg-gray-100 rounded">{prompt}</p>
// </div>
 
//         {/* Text Answer */}
// <textarea
//           value={currentAnswer}
//           onChange={(e) => setCurrentAnswer(e.target.value)}
//           className="w-full p-3 border rounded mt-4 min-h-[120px]"
//           placeholder="Write your explanation / answer here..."
//         />
 
//         {/* Buttons */}
//         <div className="flex gap-3 mt-4">
//           {!interviewStarted && (
//             <button
//               onClick={startInterview}
//               className="px-4 py-2 bg-green-600 text-white rounded"
//             >
//               Start Recording
//             </button>
//           )}

//           {interviewStarted && !interviewEnded && (
//             <>
//               <button
//                 onClick={async () => {
//                   // save current answer for this index
//                   pushAnswerForIndex(currentIndex, currentAnswer);
//                   // clear answer and move to next
//                   setCurrentAnswer('');
//                   const next = currentIndex + 1;
//                   if (next < questions.length) {
//                     setCurrentIndex(next);
//                     setTimeout(() => setStatus('Recording...'), 200);
//                   } else {
//                     // last question -> stop recording
//                     await stopRecordingWait();
//                     setInterviewEnded(true);
//                     setStatus('Recording stopped');
//                   }
//                 }}
//                 className="px-4 py-2 bg-amber-600 text-white rounded"
//               >
//                 Next
//               </button>

//               <button
//                 onClick={endInterview}
//                 className="px-4 py-2 bg-red-600 text-white rounded"
//               >
//                 Stop Recording
//               </button>
//             </>
//           )}

//           {interviewEnded && allowUpload && (
//             <button
//               onClick={uploadRecording}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//               disabled={(qaListRef.current?.length || 0) < questions.length}
//             >
//               Upload & Submit
//             </button>
//           )}

//           {interviewEnded && !allowUpload && (
//             <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Recording complete — final upload will occur when you submit the test.</div>
//           )}
//         </div>
 
//         {/* Status */}
// <p className="text-sm text-gray-600 mt-3">Status: {status}</p>
//           {/* Uploading overlay */}
//           {uploading && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center">
//               <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//               <div className="relative z-10 flex flex-col items-center gap-3 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
//                 <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin" />
//                 <div className="text-gray-700 font-medium">Uploading & Submitting...</div>
//               </div>
//             </div>
//           )}
// </div>
//     );
//   }
// );
 
// export default WebCamRecorder;
