import React, { useMemo, useState } from "react";
import axios from 'axios';
import { superAdminBaseUrl } from '../../utils/ApiConstants';
import LP1 from "../../img/LP1.png";
import LP2 from "../../img/LP2.png";
import LP3 from "../../img/LP3.png";
import LP4 from "../../img/LP4.png";
import LP5 from "../../img/LP5.png";
import LP6 from "../../img/LP6.png";
import LP7 from "../../img/LP7.png";
import MainImage from "../../img/MainImage.png";
import footerbg from "../../img/footer.png";
import contactimg from "../../img/contactimg.png";
import Facebook from "../../img/Facebook.png";
import Instagram from "../../img/Instagram.png";
import Twitter from "../../img/Twitter.png";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    if (formData.phoneNumber.length !== 10) {
      setSubmitStatus({ type: 'error', message: 'Phone number must be exactly 10 digits.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${superAdminBaseUrl}/enquiry/submit`, {
        companyName: `${formData.firstName} ${formData.lastName}`,
        emailid: formData.email,
        phone: formData.phoneNumber,
        message: formData.message
      });

      if (response.data.status === 'success') {
        setSubmitStatus({ type: 'success', message: 'Your form has been submitted successfully!' });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: response.data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error. Please check your connection and try again.';
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whyCards = [
    {
      title: "Cut Hiring Time",
      desc: "Significantly reduce hiring cycle by pre-qualified candidates.",
      img: LP1,
    },
    {
      title: "Always-on Recruiting",
      desc: "Recruit smarter with always-on, automated, continuous hiring.",
      img: LP2,
    },
    {
      title: "Bias Free Screening",
      desc: "Fair, unbiased AI screening for smarter candidate selection.",
      img: LP3,
    },
    {
      title: "Seamless Integration",
      desc: "Effortless integration with tools for smooth workflows.",
      img: LP4,
    },
  ];

  const steps = [
    {
      n: 1,
      title: "Post Your Role",
      desc: "Describe your ideal candidate in plain language",
    },
    {
      n: 2,
      title: "AI Talent Match",
      desc: "Our system scans thousands of profiles instantly",
    },
    {
      n: 3,
      title: "Smart Screening",
      desc: "Automated skill tests and candidate scoring",
    },
    {
      n: 4,
      title: "Interview-Ready Shortlist",
      desc: "Receive a curated list of top matches",
    },
  ];

  const features = [
    {
      title: "Smart Resume Screening",
      desc: "Automatically filter and shortlist candidates with AI that reads between the lines and understands real talent.",
      art: LP5,
    },
    {
      title: "AI Interview Automation",
      desc: "Our intelligent AI system conducts automated interviews to make the hiring process faster, unbiased, and more efficient.",
      art: LP6,
    },
    {
      title: "Real Time Analysis",
      desc: "Make data-backed hiring decisions using deep insights on candidates, job roles, and funnel efficiency.",
      art: LP7,
    },
  ];

  const faqs = useMemo(
    () => [
      {
        q: "How does the AI Screening process work?",
        a: "You submit your job requirements and candidate pool. Our AI evaluates resumes and screening signals against role criteria, then surfaces a ranked shortlist with key highlights to help you decide faster.",
      },
      {
        q: "How long does it take to setup?",
        a: "Setup is quick—typically minutes to connect your workflow and publish your role. You can start receiving matched candidates and screening results shortly after.",
      },
      {
        q: "Is the Interview process biased?",
        a: "We focus on structured, criteria-based evaluation. Automated scoring and consistent question sets help reduce subjective bias and keep comparisons fair across candidates.",
      },
    ],
    []
  );

  const renderFeatureTitle = (title) => {
    const words = title.split(" ");
    const firstWord = words[0];
    const restWords = words.slice(1).join(" ");

    return (
      <>
        <span className="text-[#BF00FF]">{firstWord}</span>
        {restWords && <span> {restWords}</span>}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      <header className="mx-auto max-w-6xl px-4 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

          <div className="text-2xl font-bold text-[#9730BA]">
            RecruterAI
          </div>

          <nav className="hidden items-center gap-10 text-[15px] font-medium text-slate-700 md:flex">
            <button onClick={(e) => scrollToSection(e, 'home')} className="hover:text-black cursor-pointer">Home</button>
            <button onClick={(e) => scrollToSection(e, 'features')} className="hover:text-black cursor-pointer">Features</button>
            <button onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-black cursor-pointer">How It Works</button>
            <button onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-black cursor-pointer">Contact</button>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="relative">
              <button
                className="rounded-xl border border-[#9931BC] px-6 py-2 text-sm font-medium text-[#9931BC] transition hover:bg-[#F3E8FF]"
                onClick={() => setLoginDropdown((v) => !v)}
                onBlur={() => setTimeout(() => setLoginDropdown(false), 150)}
              >
                LogIn
              </button>

              {loginDropdown && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-2 shadow-lg z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#9931BC]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setLoginDropdown(false); navigate("/login", { state: { role: "Admin" } }); }}
                  >
                    Admin
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#9931BC]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setLoginDropdown(false); navigate("/login", { state: { role: "RMG" } }); }}
                  >
                    RMG
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#9931BC]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setLoginDropdown(false); navigate("/login", { state: { role: "Recruiter" } }); }}
                  >
                    Recruiter
                  </button>
                </div>
              )}
            </div>

            <button
              className="rounded-xl bg-gradient-to-r from-[#9931BC] to-[#4F1878] px-6 py-2 text-sm font-medium text-white shadow-md"
              onClick={() => navigate("/CandidateLogin")}
            >
              LogIn as Candidate
            </button>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden"
          >
            <svg
              className="h-6 w-6 text-slate-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenu
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 pb-6 md:hidden">
            <div className="flex flex-col gap-4 pt-4 text-[15px] font-medium text-slate-700">
              <button onClick={(e) => { scrollToSection(e, 'home'); setMobileMenu(false); }}>Home</button>
              <button onClick={(e) => { scrollToSection(e, 'features'); setMobileMenu(false); }}>Features</button>
              <button onClick={(e) => { scrollToSection(e, 'how-it-works'); setMobileMenu(false); }}>How It Works</button>
              <button onClick={(e) => { scrollToSection(e, 'contact'); setMobileMenu(false); }}>Contact</button>

              <div className="mt-4 flex flex-col gap-3">
                <div className="relative">
                  <button
                    className="w-full rounded-xl border border-[#9931BC] py-2 text-sm font-medium text-[#9931BC]"
                    onClick={() => setLoginDropdown((v) => !v)}
                  >
                    LogIn
                  </button>

                  {loginDropdown && (
                    <div className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                      <button
                        className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#9931BC]"
                        onClick={() => { setLoginDropdown(false); setMobileMenu(false); navigate("/login", { state: { role: "Admin" } }); }}
                      >
                        Admin
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#9931BC]"
                        onClick={() => { setLoginDropdown(false); setMobileMenu(false); navigate("/login", { state: { role: "RMG" } }); }}
                      >
                        RMG
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#F3E8FF] hover:text-[#9931BC]"
                        onClick={() => { setLoginDropdown(false); setMobileMenu(false); navigate("/login", { state: { role: "Recruiter" } }); }}
                      >
                        Recruiter
                      </button>
                    </div>
                  )}
                </div>
                <button className="rounded-xl bg-gradient-to-r from-[#9931BC] to-[#4F1878] py-2 text-sm font-medium text-white"
                  onClick={() => navigate("/CandidateLogin")}
                >
                  LogIn as Candidate
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-10 md:pt-14">

        <section id="home" className="mb-14 md:mb-16">
          <div className="relative overflow-hidden rounded-[28px] bg-[#FBF7FF] px-4 pt-12 md:px-12 md:pt-16">

            <div className="pointer-events-none absolute inset-0">
              <span className="absolute left-8 top-10 text-[#BF00FF]/20">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="absolute right-10 top-12 text-[#BF00FF]/18">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M9 18h6M10 22h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 2a7 7 0 0 0-4 12c.7.6 1 1.2 1 2h6c0-.8.3-1.4 1-2A7 7 0 0 0 12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="absolute left-14 top-40 text-[#BF00FF]/14">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M7 7h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 12h8M8 16h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span className="absolute right-16 top-44 text-[#BF00FF]/16">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M4 14c2-4 6-7 11-7 2 0 4 .5 5 1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 14a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M20 8v4h-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="absolute bottom-10 left-10 text-[#BF00FF]/18">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="M12 2l1.2 4.2L17.5 8l-4.3 1.2L12 13.5l-1.2-4.3L6.5 8l4.3-1.8L12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="absolute bottom-8 right-12 text-[#BF00FF]/14">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M6 18V6M18 18V6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.5 12h7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
              <h1 className="text-[38px] font-semibold leading-[1.1] text-slate-900 md:text-[56px]">
                Revolutionize Your <br />
                <span className="bg-gradient-to-r from-[#C04AE8] to-[#42158B] bg-clip-text text-transparent font-bold">
                  Hiring
                </span>{" "}
                Process with <br />
                <span className="bg-gradient-to-r from-[#C04AE8] to-[#42158B] bg-clip-text text-transparent font-bold">
                  AI-Powered
                </span>{" "}
                Solutions
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 md:text-[15px]">
                Our Recruter AI finds, screens, and engages top talent 24/7—so
                you can focus on growing your business, not chasing resumes
              </p>
            </div>

            <div className="relative mt-10 -mb-5 flex justify-center md:mt-12">
              <div className="w-full max-w-5xl">
                <div className="rounded-2xl bg-white p-1 shadow-[0_18px_70px_rgba(149,0,168,0.18)] border-7 border-slate-200">
                  <img
                    src={MainImage}
                    alt="Hero preview"
                    className="w-full rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#BF00FF]" />
            <span className="text-[14px] font-medium italic tracking-wide text-[#BF00FF]">
              Why Choose Us?
            </span>
            <span className="h-px w-16 bg-[#BF00FF]" />
          </div>

          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            Choose us to hire smarter, faster,
            <br className="hidden md:block" />
            and with confidence.
          </h2>

          <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map(({ title, desc, img }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-300 bg-white p-5 text-left shadow-[0_1px_0_rgba(15,23,42,0.02)]"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center">
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </span>
                <h3 className="mt-4 font-semibold text-[#730099]">{title}</h3>
                <p className="mt-2 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-14 text-center md:mt-16">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#BF00FF]" />
            <span className="text-[14px] font-medium italic tracking-wide text-[#BF00FF]">
              How Does It Work?
            </span>
            <span className="h-px w-16 bg-[#BF00FF]" />
          </div>

          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            See how our AI simplifies hiring in
            <br className="hidden md:block" />
            a few smart steps.
          </h2>

          <div className="relative mt-10">
            <div className="absolute left-0 right-0 top-4 hidden h-px border-t border-dashed border-[#BF00FF]/50 lg:block" />

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="relative">
                  <div className="mx-auto flex flex-col items-center">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#BF00FF] text-xs font-semibold text-white shadow-sm">
                      {s.n}
                    </div>
                    <h4 className="mt-3 font-semibold text-[#BF00FF]">
                      {s.title}
                    </h4>
                    <p className="mt-2 max-w-[15rem] text-sm">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mt-14 text-center md:mt-16">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#BF00FF]" />
            <span className="text-[14px] font-medium italic tracking-wide text-[#BF00FF]">
              Features
            </span>
            <span className="h-px w-16 bg-[#BF00FF]" />
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-slate-800 md:text-3xl">
            Powerful capabilities designed to simplify and
            <br className="hidden md:block" />
            elevate your hiring experience.
          </h2>

          <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-[0_10px_30px_#9500A80D]"
              >
                <img
                  src={f.art}
                  alt={f.title}
                  className="w-full object-contain"
                />
                <h3 className="mt-4 text-lg font-semibold text-center">
                  {renderFeatureTitle(f.title)}
                </h3>
                <p className="mt-2 text-sm text-center">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#BF00FF]" />
            <span className="text-[14px] font-medium italic tracking-wide text-[#BF00FF]">
              Frequently Asked Questions
            </span>
            <span className="h-px w-16 bg-[#BF00FF]" />
          </div>

          <h2 className="mx-auto mt-3 max-w-3xl text-center text-2xl font-semibold md:text-3xl">
            Answers to common questions about our
            <br className="hidden md:block" />
            platform and hiring process.
          </h2>

          <div className="mx-auto mt-10 max-w-5xl space-y-5">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={item.q}
                  className={`rounded-2xl border border-slate-200 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-colors duration-300 ${isOpen ? "bg-[#F8F8F8]" : "bg-white"
                    }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq((v) => (v === idx ? null : idx))}
                    className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
                  >
                    <span className="text-[10px] font-semibold md:text-[15px]">
                      {item.q}
                    </span>

                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${isOpen ? "bg-[#F8F8F8]" : "bg-white"
                        }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                          }`}
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid overflow-hidden px-6 transition-all duration-300 ${isOpen
                      ? "grid-rows-[1fr] pb-6 opacity-100"
                      : "grid-rows-[0fr] pb-0 opacity-0"
                      }`}
                  >
                    <div className="min-h-0">
                      <p className="text-sm leading-6 rounded-lg">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="contact" className="relative z-10 mt-16 mb-[-80px] md:mt-20">
          <div className="relative overflow-hidden rounded-[28px] bg-[#FBF7FF] p-6 md:p-10">
            <div className="relative grid items-center gap-10 grid-cols-1 md:grid-cols-2">

              <div className="text-left">
                <div>
                  <img src={contactimg} alt="" />
                </div>

                <h3 className="text-3xl font-semibold leading-tight mt-10">
                  Take the <span className="text-[#BF00FF]">First</span> Step
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6">
                  Experience the difference for yourself. Schedule a live demo
                  with our team and watch RecruterAI in action
                </p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -left-4 -top-4 h-16 w-16 rounded-full bg-[#BF00FF]/40 blur-xl" />
                <div className="pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#BF00FF]/40 blur-xl" />

                <form
                  onSubmit={handleSubmit}
                  className="relative rounded-2xl bg-white p-6 shadow-[0_18px_60px_rgba(17,24,39,0.12)] md:p-8"
                >
                  <h4 className="text-left text-lg font-semibold text-slate-900">
                    Enter Your <span className="text-[#BF00FF]">Details</span>
                  </h4>

                  {submitStatus.message && (
                    <div className={`mt-4 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <div className="mt-5 grid gap-4 grid-cols-1 md:grid-cols-2">
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-lg bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#BF00FF]/35"
                      placeholder="First Name"
                    />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-lg bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#BF00FF]/35"
                      placeholder="Last Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-lg bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#BF00FF]/35"
                      placeholder="Email ID"
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-lg bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#BF00FF]/35"
                      placeholder="Phone Number"
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="min-h-[110px] w-full resize-none rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#BF00FF]/35 md:col-span-2"
                      placeholder="Write your message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-5 h-12 w-full rounded-lg text-sm font-semibold text-white shadow-[0_10px_30px_rgba(191,0,255,0.25)] ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#BF00FF] to-[#2A0A5E]'}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Book your demo'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="relative pt-32 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${footerbg})`
          }}
        >
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10">
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">

            <div>
              <div className="text-xl font-semibold">RecruterAI</div>
              <p className="mt-3 max-w-xs text-sm text-white/80">
                Smarter hiring with AI-powered interviews
              </p>

              <div className="mt-4 flex items-center gap-3 text-white/90">
                <img src={Twitter} alt="Twitter" className="h-7 w-5" />
                <img src={Facebook} alt="Facebook" className="h-7 w-5" />
                <img src={Instagram} alt="Instagram" className="h-7 w-5" />
              </div>
            </div>

            <div>
              <div className="text-lg font-semibold">Quick Link</div>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                <li>
                  <button onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white">Features</button>
                </li>
                <li>
                  <button onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-white">How It Works</button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-lg font-semibold">Contact</div>
              <div className="mt-4 space-y-3 text-sm text-white/85">
                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4"
                    fill="none"
                  >
                    <path
                      d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h2a2 2 0 0 1 2 1.72c.12.86.32 1.7.57 2.5a2 2 0 0 1-.45 2.11L7.1 9.9a16 16 0 0 0 6 6l1.57-1.13a2 2 0 0 1 2.11-.45c.8.25 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>+91 9147410041</span>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4"
                    fill="none"
                  >
                    <path
                      d="M4 6h16v12H4z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m4 7 8 6 8-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>sales@netfotech.in</span>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4"
                    fill="none"
                  >
                    <path
                      d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>
                    World Trade Center,Kharadi,Pune
                    <br />
                    Maharashta-411014,INDIA
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-5 text-center text-xs text-white/70">
            © 2025 RecruitAI. All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}