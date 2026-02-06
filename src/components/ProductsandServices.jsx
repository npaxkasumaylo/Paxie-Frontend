import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import Chatbot from "./Chatbot";

import nPaxImage from "../assets/npax-white.png";

// ✅ Best practice:
// - If images are in /public, reference them like "/adminBG.jpg" (NO /public)
// - Or import from src/assets.
const FALLBACK_IMAGE = "/adminBG.jpg";

const ITEMS = [
  {
    title: "Business Analytics & Intelligence",
    description:
      "Transform data into actionable insights using real-time dashboards, advanced reporting, and predictive analytics.",
    image: "/2.png",
  },
  {
    title: "Digital Transformation",
    description:
      "Modernize business operations through cloud adoption, automation, and technology-driven process optimization.",
    image: "/3.png",
  },
  {
    title: "HRIS & Payroll Systems",
    description:
      "Centralized HR platforms that manage employee data, payroll, timekeeping, compliance, and performance analytics.",
    image: "/5.png",
  },
  {
    title: "Enterprise Resource Planning (ERP)",
    description:
      "Integrated ERP solutions covering finance, procurement, inventory, operations, and supply chain management.",
    image: "/6.png",
  },
  {
    title: "Accounting & Financial Systems",
    description:
      "Accurate and compliant accounting solutions with reporting, tax management, and financial controls.",
    image: "/7.png",
  },
  {
    title: "IOT System",
    description:
      "Boost factory productivity by digitalizing hidden elements with Kaizen-driven IoT solutions",
    image: "/7.png",
  },
  {
    title: "Managed IT Services",
    description:
      "End-to-end IT support including infrastructure management, system monitoring, and technical support services.",
    image: "/8.png",
  },
  {
    title: "MotionBoard™ Workflow Automation",
    description:
      "MotionBoard is a next-generation BI dashboard that helps business managers and users accelerate business performance. It gives you the power to analyze and visualize all of your business data in one place, in real-time, in a matter of seconds.",
    image: "/4.png",
  },
  {
    title: "Paxyroll Cloud Timekeeping",
    description:
      "Timesheet nightmare no more when Paxyroll got your role. Your state of the art digitalized work hour trackers under cloudbase solution you can use for free.",
    image: "/9.png",
  },
];

function ServiceCard({ title, description, image }) {
  const bg = image || FALLBACK_IMAGE;

  return (
    <div className="group relative overflow-hidden rounded-xl px-8 py-10">
      {/* Background image (low opacity on hover) */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-0 scale-105
          transition-all duration-500 ease-out
          group-hover:opacity-100 group-hover:scale-100
        "
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Soft overlay to keep text readable */}
      <div className="pointer-events-none absolute inset-0 bg-white/80" />

      {/* Content */}
      <h3
        className="
          relative z-10 inline-block
          text-[19px] font-semibold tracking-[-0.01em] text-slate-900
          transition-transform duration-300 group-hover:translate-x-1
        "
      >
        <span className="relative">
          {title}
          <span
            className="
              absolute left-0 -bottom-1 h-[2px] w-full
              origin-left scale-x-0 bg-slate-900
              transition-transform duration-300 group-hover:scale-x-100
            "
          />
        </span>
      </h3>

      <p
        className="
          relative z-10 mt-4
          text-[16px] leading-[1.8] text-slate-600
          transition-transform duration-300 group-hover:translate-x-1
        "
      >
        {description}
      </p>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="relative z-20 border-b border-white/10 bg-slate-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src={nPaxImage}
              alt="N-PAX Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 text-white lg:flex">
          <Link to="/AboutUs" className="hover:text-blue-300 transition">
            ABOUT US
          </Link>

          {/* Dropdown */}
          <div className="relative group">
            <button className="hover:text-blue-300 transition flex items-center gap-1">
              SOFTWARE PRODUCTS AND SERVICES
              <ChevronDown className="w-4 h-4" />
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
                <div className="space-y-2 text-sm text-gray-500">
                  {[
                    "Advanced Analytics Solutions",
                    "BI and Dashboarding",
                    "Digital Transformation Services",
                    "HRIS / Payroll System",
                    "ERP System",
                    "Accounting System",
                    "IoT System",
                    "Managed IT Services",
                    "Paxyroll Cloud Timekeeping",
                  ].map((label) => (
                    <a
                      key={label}
                      href="#"
                      className="block border-b mx-3 pb-2 hover:text-blue-500 transition"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

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

        {/* Mobile Menu */}
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
                <Link to="/AboutUs" className="text-gray-100 hover:text-blue-400 transition">
                  ABOUT US
                </Link>
                <a href="#" className="text-gray-100 hover:text-blue-400 transition">
                  SOFTWARE PRODUCTS AND SERVICES
                </a>
                <a href="#" className="text-gray-100 hover:text-blue-400 transition">
                  INSIGHTS AND BLOGS
                </a>
                <Link to="/Career" className="text-gray-100 hover:text-blue-400 transition">
                  CAREERS
                </Link>
                <a href="#contact" className="text-gray-100 hover:text-blue-400 transition">
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
  return (
    <div className="bg-white">
      <Navbar />

      <section className="bg-white">
        <div className="mx-auto max-w-[1120px] px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
          {/* Header */}
          <div className="max-w-[720px]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Products & Services
            </div>

            <h2 className="mt-4 text-[34px] sm:text-[42px] lg:text-[48px] leading-[1.1] font-bold tracking-[-0.02em] text-slate-900">
              Smart Solutions for a Digital-First Enterprise
            </h2>

            <p className="mt-6 text-[16px] sm:text-[18px] leading-[1.9] text-slate-600">
              We deliver integrated technology solutions designed to streamline
              operations, enhance decision-making, and accelerate business growth.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.map((item) => (
              <ServiceCard
                key={item.title}
                title={item.title}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </section>
      <div className="fixed bottom-8 right-8 z-50">
            <Chatbot isDark={false} /> 
      </div>
    </div>
  );
}
