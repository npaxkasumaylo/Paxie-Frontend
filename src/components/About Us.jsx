import React, { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import AboutUsImage from "../assets/AboutUs.png";
import NPAX1IImage from "../assets/N-Pax1.png";
import nPaxImage from "../assets/npax-white.png";
import NPAX3Image from "../assets/N-Pax3.png";
import TeamImage from "../assets/LP2.png";
import Chatbot from "./Chatbot.jsx";

export default function AboutUs() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image (Hero Section) */}
      <div
        className="absolute inset-0 bg-contain"
        style={{ backgroundImage: `url(${AboutUsImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-800/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="z-20 relative flex items-center justify-between px-8 py-3 text-sm">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <img src={nPaxImage} alt="N-PAX Logo" className="h-12 w-auto cursor-pointer" />
              </Link>
            </div>
  
            {/* Navigation Links */}
            <div className="lg:flex hidden items-center gap-8 text-white">
                <Link to="/AboutUs" className="text-white-600 hover:text-blue-300 transition">
                ABOUT US
              </Link>
  
  
              {/* SOFTWARE PRODUCTS & SERVICES Dropdown */}
              <div className="relative group">
                <button className="hover:text-blue-300 transition flex items-center gap-1">
                  SOFTWARE PRODUCTS AND SERVICES
                  <ChevronDown className="w-4 h-4" />
                </button>
  
                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 border-t-2 border-t-blue-500 
                  shadow-xl overflow-hidden
                  max-h-0 opacity-0 invisible -translate-y-2 
                  group-hover:max-h-96 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-500 ease-out">
                  
                  <div className="p-5">
                    <h3 className="font-semibold mb-4 text-gray-800">
                      Software Products and Services
                    </h3>
                    <div className="space-y-2 text-sm text-gray-500">
                      <a href="advance_analytics.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200 
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        Advanced Analytics Solutions
                      </a>
                      <a href="motionboard.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        BI and Dashboarding
                      </a>
                      <a href="digital_transformation.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        Digital Transformation Services
                      </a>
                      <a href="hrc.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        HRIS / Payroll System
                      </a>
                      <a href="nxpert.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        ERP System
                      </a>
                      <a href="mcframega.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        Accounting System
                      </a>
                      <a href="mcframe_iot.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        IoT System
                      </a>
                      <a href="manage_services.php" 
                        className="block hover:text-blue-400 border-b mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        Managed IT Services
                      </a>
                      <a href="https://www.paxyroll.com" 
                        className="block hover:text-blue-400 mx-3 transition-all duration-200
                        opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        Paxyroll Cloud Timekeeping
                      </a>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* INSIGHTS AND BLOGS (Mega Dropdown) */}
              <div className="relative group">
                <button className="hover:text-blue-300 transition flex items-center gap-1 ">
                  INSIGHTS AND BLOGS
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Full-Width Mega Dropdown */}
                <div className="absolute top-full left-1/4 w-[150vh] bg-white mt-5
                  -translate-x-1/2 z-50 shadow-xl overflow-hidden max-h-0 opacity-0 invisible 
                  -translate-y-2 group-hover:max-h-96 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-500 ease-out border border-gray-200 border-t-2 border-t-blue-500 "
                >
                      
                  <div className="container mx-auto px-12 py-8">
                    <div className="grid grid-cols-3 gap-16 max-w-6xl mx-auto">
                      {/* Column 1: News and Insights */}
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-gray-800 text-base mb-2">
                          News and Insights
                        </h3>
                        <a 
                          href="update/category_news?category=23" 
                          className="py-1.5 border-b text-gray-600 hover:text-blue-500 hover:translate-x-1 transition-all duration-200 text-sm"
                        >
                          News & Events
                        </a>
                      </div>
  
                      {/* Column 2: Recent Blogs */}
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-gray-700 text-base mb-2">
                          Recent Blogs
                        </h3>
                        <a 
                          href="update/category?category=17" 
                          className="border-b py-1.5 text-gray-600 hover:text-blue-500  hover:translate-x-1 transition-all duration-200 text-sm"
                        >
                          Advanced Analytics
                        </a>
                        <a 
                          href="update/category?category=21" 
                          className="border-b py-1.5 text-gray-600 hover:text-blue-500  hover:translate-x-1 transition-all duration-200 text-sm"
                        >
                          Digital Transformation
                        </a>
                        <a href="update/category?category=18" 
                          className="border-b py-1.5 text-gray-600 hover:text-blue-500  hover:translate-x-1 transition-all duration-200 text-sm"
                        >
                          Human Resource Information
                        </a>
                      </div>
  
                      {/* Column 3: Additional Blogs */}
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-white text-base mb-2 opacity-0">
                          &nbsp;
                        </h3>
                        <a href="update/category?category=19" 
                          className="border-b py-1.5 text-gray-600 hover:text-blue-500  hover:translate-x-1 transition-all duration-200 text-sm"
                        >
                          Enterprise Resource Planning
                        </a>
                        <a href="update/category?category=20" 
                          className="border-b py-1.5 text-gray-600 hover:text-blue-500  hover:translate-x-1 transition-all duration-200 text-sm"
                        >
                          Accounting
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <Link to="/Career" className="text-gray hover:text-blue-300 transition">
                CAREERS
              </Link>
              <a href="#contact" className="hover:text-blue-300 transition-colors uppercase text-sm tracking-wide">Contact Us</a>
              <button
                className="text-white border border-white px-4 py-2 hover:bg-white hover:text-slate-800 transition-all uppercase text-sm tracking-wide"
              >
                Language
              </button>
            </div>

             {/* Responsive Nav Link */}
          <div className="lg:hidden flex items-center">
            <div className="relative group">
              <button className="hover:text-blue-300 transition flex items-center gap-1">
                <Menu className="w-6 h-6 text-white" />
              </button>

              <div className="absolute right-0 mt-2 rounded-md bg-slate-800/50 backdrop-blur-md
                shadow-xl overflow-hidden max-h-0 opacity-0 invisible 
                -translate-y-2 w-[95vh] text-center
                group-hover:max-h-[100vh] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-500 ease-out">

                <div className="p-5 flex flex-col gap-4">
                  <Link to="/AboutUs" className="text-gray-100 hover:text-blue-400 transition">
                    ABOUT US
                  </Link>
                  <a href="#contact" className="text-gray-100 hover:text-blue-400 transition">
                    SOFTWARE PRODUCTS AND SERVICES
                  </a>
                  <a href="#contact" className="text-gray-100 hover:text-blue-400 transition">
                    INSIGHTS AND BLOGS
                  </a>
                  <Link to="/Career" className="text-gray-100 hover:text-blue-400 transition">
                    CAREERS
                  </Link>
                  <a href="#contact" className="text-gray-100 hover:text-blue-400 transition">
                    CONTACT US
                  </a>
                  <button
                    className="text-white border border-white px-4 py-2 hover:bg-white hover:text-slate-800 transition-all uppercase text-sm tracking-wide"
                  >
                    Language
                  </button>
                  
                </div>

              </div>
            </div>
          </div>
        </nav>

        {/* Hero / Header Logo */}
        <div className="flex flex-col items-center justify-center px-8 mt-20">
          <div className="flex items-center justify-center mb-12">
            <img
              src="/src/assets/N-Pax2.png"
              alt="n-pax"
              style={{ width: "60%" }}
              className="block"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around min-w-full px-11">
          {/* Block 1 */}
          <div className="text-center px-12">
            <img
              src={NPAX3Image}
              alt="n-pax"
              className="mx-auto relative top-13"
              style={{ width: "100%" }} // ✅ Bigger
            />
          </div>
        </div>

        {/* Main Content Section with White Background */}
        <div className="relative z-10 bg-white py-16 px-8 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Content: Mission and Vision */}
              <div className="space-y-8">
                <div className="space-y-16">
                  <div>
                    <h2 className="text-4xl font-bold text-blue-400 mb-5">
                      Our Mission
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed space-y-2">
                      We build trust and deliver value through the harmony of
                      people and technology.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We aim to be a lasting IT partner that empowers the growth
                      of our clients and our teams.
                    </p>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-blue-400 mb-6">
                      Our Vision
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed space-y-2">
                      We combine diverse talents and technological strengths to
                      deliver sustainable value to businesses around the world.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed mb-10">
                      We aim to be a trusted presence that continuously creates
                      new possibilities through collaboration and harmony.
                    </p>
                    <h2 className="text-4xl font-bold text-blue-400 mb-6">
                      Our Core Values
                    </h2>
                    <ul className="text-gray-700 text-lg leading-relaxed space-y-2">
                      <li>1. Sincere Contribution to Client Success</li>
                      <li>2. Long-Term Relationships Rooted in Trust</li>
                      <li>3. Culture of Diversity and Co-Creation</li>
                      <li>4. Embracing Change with Courage</li>
                      <li>5. Open and Healthy Organizational Management</li>
                      <li>6. Harmony of Support and Autonomy</li>
                      <li>7. Practicing Balance and Harmony</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Content: Image */}
              <div className="relative">
                <img
                  src={TeamImage}
                  alt="Team"
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                />
              </div>
              {/* Floating Chatbot */}
              <div className="fixed bottom-8 right-8 z-50">
                {/* <Chatbot isDark={false} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
