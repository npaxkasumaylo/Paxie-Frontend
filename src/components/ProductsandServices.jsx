import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, Search } from "lucide-react";
import Chatbot from "./Chatbot";

import nPaxImage from "../assets/npax-white.png";

const ITEMS = [
  {
    key: "MCFrame7",
    title: "MCF7 (PCM/SCM)",
    description:
      "Integrated solutions covering finance, procurement, inventory, operations, and supply chain management.",
    link: "https://www.n-pax.com/mcframe_iot.php"
  },
  {
    key: "MCFrameGA",
    title: "MCF GA",
    description:
      "Accurate and compliant accounting solutions with reporting, tax management, and financial controls.",
    link: "https://www.n-pax.com/mcframega.php"
  },
  {
    key: "Dr. Sum",
    title: "Dr. Sum",
    description:
      "Centralized HR platforms that manage employee data, payroll, timekeeping, compliance, and performance analytics.",
    link: "https://www.wingarc.com/en/product/dr_sum/scene/"
  },
  {
    key: "MotionBoard",
    title: "MotionBoard",
    description:
      "Next-generation BI dashboard to analyze and visualize business data in one place, in real-time.",
    link: "https://www.n-pax.com/motionboard.php"
  },
];

function DashboardTile({ active, title, description, onClick }) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full text-left
        overflow-hidden rounded-xl border
        px-6 py-7 transition
        ${active ? "bg-blue-200 border-blue-500" : "bg-white hover:bg-slate-50"}
      `}
    >

      {/* Soft overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-white/85" />

      {/* Content */}
      <div className="relative z-10">
        <div className="text-[15px] font-semibold text-slate-900">
          <span className="relative inline-block">
            {title}
            <span
              className="
                absolute left-0 -bottom-1 h-[2px] w-full
                origin-left scale-x-0 bg-slate-900
                transition-transform duration-300 group-hover:scale-x-100
              "
            />
          </span>
        </div>

        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
            {description}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function Navbar() {
  return (
    <nav className="relative z-20 border-b border-white/10 bg-slate-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3 lg:px-8">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={nPaxImage}
              alt="N-PAX Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>

        <div className="hidden items-center gap-8 text-white lg:flex">
          <Link to="/AboutUs" className="hover:text-blue-300 transition">
            ABOUT US
          </Link>

          <div className="relative group">
            <button className="hover:text-blue-300 transition flex items-center gap-1">
              SOFTWARE PRODUCTS AND SERVICES
            </button>

            <div
              className="
                absolute left-0 top-full mt-2 w-[340px]
                bg-white border border-gray-200 border-t-2 border-t-blue-500
                shadow-xl overflow-hidden
                max-h-0 opacity-0 invisible -translate-y-2
                group-hover:max-h-96 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-500 ease-out
              "
            >
              <div className="p-5">
                <h3 className="font-semibold mb-4 text-gray-800">
                  Software Products and Services
                </h3>
                
              </div>
            </div>
          </div>

          <a
            href="#contact"
            className="hover:text-blue-300 transition uppercase text-sm tracking-wide"
          >
            INSIGHTS AND BLOGS
          </a>

          <Link to="/Career" className="hover:text-blue-300 transition">
            CAREERS
          </Link>

          <a
            href="#contact"
            className="hover:text-blue-300 transition uppercase text-sm tracking-wide"
          >
            Contact Us
          </a>

          <button className="text-white border border-white px-4 py-2 hover:bg-white hover:text-slate-800 transition-all uppercase text-sm tracking-wide">
            Language
          </button>
        </div>

        <div className="lg:hidden flex items-center">
          <div className="relative group">
            <button className="hover:text-blue-300 transition flex items-center gap-1">
              <Menu className="w-6 h-6 text-white" />
            </button>

            <div
              className="
                absolute right-0 mt-2 rounded-md bg-slate-900/90 backdrop-blur
                shadow-xl overflow-hidden max-h-0 opacity-0 invisible -translate-y-2
                w-[85vw] text-center
                group-hover:max-h-[100vh] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-500 ease-out
              "
            >
              <div className="p-5 flex flex-col gap-4">
                <Link
                  to="/AboutUs"
                  className="text-gray-100 hover:text-blue-400 transition"
                >
                  ABOUT US
                </Link>
                <a
                  href="#"
                  className="text-gray-100 hover:text-blue-400 transition"
                >
                  SOFTWARE PRODUCTS AND SERVICES
                </a>
                <a
                  href="#"
                  className="text-gray-100 hover:text-blue-400 transition"
                >
                  INSIGHTS AND BLOGS
                </a>
                <Link
                  to="/Career"
                  className="text-gray-100 hover:text-blue-400 transition"
                >
                  CAREERS
                </Link>
                <a
                  href="#contact"
                  className="text-gray-100 hover:text-blue-400 transition"
                >
                  CONTACT US
                </a>
                <button className="text-white border border-white px-4 py-2 hover:bg-white hover:text-slate-800 transition-all uppercase text-sm tracking-wide">
                  Language
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function ProductsandServices() {
  const [activeKey, setActiveKey] = useState(ITEMS[0]?.key ?? "mcf7");
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMaximized, setChatMaximized] = useState(false);

  const [autoPrompt, setAutoPrompt] = useState("");
  const [autoPromptId, setAutoPromptId] = useState(null);
  const [chatContext, setChatContext] = useState("");


  const activeItem = useMemo(
    () => ITEMS.find((x) => x.key === activeKey) || ITEMS[0],
    [activeKey]
  );

  const filteredItems = useMemo(() => {
  const q = query.trim().toLowerCase();
  if (!q) return ITEMS;

  return ITEMS.filter((item) => {
    const title = (item.title || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const link = (item.link || "").toLowerCase();

    return title.includes(q) || desc.includes(q) || link.includes(q);
  });
}, [query]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Dashboard wrapper (matches screenshot spacing) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-[720px] py-4"> 
            <h2 className="mt-4 text-[34px] sm:text-[42px] lg:text-[48px] leading-[1.1] font-bold tracking-[-0.02em] text-slate-900"> 
              Products & Services 
            </h2> 
            
            <p className="mt-6 text-[16px] sm:text-[18px] leading-[1.9] text-slate-600"> 
              We deliver integrated technology solutions designed to streamline operations, enhance decision-making, and accelerate business growth. 
            </p>
          </div> 
          {/* 1) Paxie Search Bar */}
          <div className="rounded-2xl border border-blue-500 bg-white px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, services, or insights..."
                className="
                  w-full bg-transparent outline-none
                  text-[14px] sm:text-[15px] text-slate-700 placeholder:text-slate-400
                "
              />
            </div>
          </div>

          {/* 2) Top Tiles (4 boxes) */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <DashboardTile
                key={item.key}
                title={item.title}
                description={item.description}
                image={item.image}
                active={item.key === activeKey}
                onClick={() => setActiveKey(item.key)}
              />
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              No results for <span className="font-semibold">{query}</span>
            </div>
          )}
        </div>

          {/* 3) Large Preview Panel */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-blue-500 bg-white">
            {/* Header (optional browser-like bar) */}
            <div className="flex items-center gap-2 border-b border-blue-500/30 bg-blue-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="ml-3 flex-1 truncate text-xs text-slate-600">
                {activeItem?.link || "No link available"}
              </div>

              <div className="text-xs font-semibold text-slate-700">
                {activeItem?.title}
              </div>
            </div>

            {/* Iframe area */}
            <div className="relative h-[650px] w-full bg-white">
              {activeItem?.link ? (
                <iframe
                  src={activeItem.link}
                  title={activeItem.title}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No preview available
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-blue-500/30 bg-white px-6 py-5">
              {activeItem?.link ? (
                <a
                  href={activeItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                >
                  View this Website
                </a>
              ) : (
                <button
                  disabled
                  className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-400"
                >
                  View Details
                </button>
              )}

              <button
                onClick={() => {
                  setChatContext(activeItem?.key || "");
                  setChatOpen(true);
                  setChatMaximized(true);

                  const prompt = `can you tell me more about ${activeItem.title}.`;
                  setAutoPrompt(prompt);
                  setAutoPromptId(crypto?.randomUUID?.() || String(Date.now()));
                }}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:opacity-90 transition"
              >
                Ask Paxie about this
              </button>
            </div>
          </div>


          {/* Chatbot */}
          <Chatbot 
            externalOpen={chatOpen} 
            externalMaximized={chatMaximized} 
            onOpenChange={setChatOpen}
            onMaximizedChange={setChatMaximized}
            autoPrompt={autoPrompt}
            autoPromptId={autoPromptId}
            context={chatContext}
            onClearContext={() => setChatContext("")}
          />
        </div>
      </section>
    </div>
  );
}

