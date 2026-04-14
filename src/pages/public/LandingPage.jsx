import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, TrendingUp, Compass, Briefcase, GraduationCap, ChevronRight, BarChart, Server, Link as LinkIcon, AlertTriangle, Layers, Zap, Star, Shield, Building, Building2, Globe, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center font-bold text-2xl text-blue-700">
              <Brain className="w-8 h-8 mr-2" />
              SkillSync AI
            </div>
            <div className="hidden md:flex space-x-6 items-center text-sm font-medium">
              <a href="#problem" className="text-slate-600 hover:text-blue-600 transition">Problem</a>
              <a href="#solution" className="text-slate-600 hover:text-blue-600 transition">Solution</a>
              <a href="#impact" className="text-slate-600 hover:text-blue-600 transition">Impact</a>
              <a href="#vision" className="text-slate-600 hover:text-blue-600 transition">Vision</a>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 transition">Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="lg:w-1/2">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Career Intelligence</span> Engine.
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl">
              An AI-powered platform that helps students discover career paths, identify skill gaps, build personalized learning roadmaps, and connect with real job opportunities.
            </p>
            <div className="flex space-x-4">
              <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center shadow-lg shadow-blue-500/30">
                Get Started <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#solution" className="bg-white text-slate-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition border border-slate-200">
                Explore Features
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 backdrop-blur-sm">
               <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg">SkillMatch Profile</h3>
                    <p className="text-sm text-slate-500">Frontend Developer Target</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">92%</div>
               </div>
               <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded flex overflow-hidden">
                     <div className="w-[92%] bg-blue-500"></div>
                  </div>
                  <p className="text-sm text-slate-600">Industry readiness mapped via real-time LLM matching.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Career Guidance Gap</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">There is a fundamental disconnect between academic curriculum and rapid industry evolution.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-slate-800 mb-2">52%</h3>
                <p className="text-slate-600">of graduates are considered not industry-ready by recruiters.</p>
             </div>
             <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <BarChart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-slate-800 mb-2">44.5%</h3>
                <p className="text-slate-600">youth graduate unemployment rate due to skill mismatch.</p>
             </div>
             <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <Compass className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2 mt-4">No Visibility</h3>
                <p className="text-slate-600">Generic job portals are not personalized, and counseling lacks real-time labor market data.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How SkillSync AI Works</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-xl transition duration-300">
              <Brain className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI Skill Profiling</h3>
              <p className="text-slate-600">Analyze resumes and assessments to map your unique skill graph and competency level.</p>
            </div>
            <div className="p-8 bg-purple-50 rounded-2xl border border-purple-100 hover:shadow-xl transition duration-300">
              <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Labor Market Engine</h3>
              <p className="text-slate-600">Use real-time job trends and demand forecasting to highlight in-demand industry skills.</p>
            </div>
            <div className="p-8 bg-green-50 rounded-2xl border border-green-100 hover:shadow-xl transition duration-300">
              <Compass className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Career Path Builder</h3>
              <p className="text-slate-600">Build personalized roadmaps mapping exactly which milestones, courses, and certifications you need.</p>
            </div>
            <div className="p-8 bg-orange-50 rounded-2xl border border-orange-100 hover:shadow-xl transition duration-300">
              <LinkIcon className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Opportunity Connector</h3>
              <p className="text-slate-600">Match intelligently with jobs, internships, referrals, and track applications in one dashboard.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Social Impact */}
      <section id="impact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Driving Social Impact</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-xl border-t-4 border-blue-500 shadow-sm">
                <GraduationCap className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Students</h3>
                <p className="text-sm text-slate-600">Reduce time-to-first-job with personalized roadmaps from day 1.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border-t-4 border-purple-500 shadow-sm">
                <Building className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Corporates</h3>
                <p className="text-sm text-slate-600">Access pre-screened talent, reducing recruitment time and cost.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border-t-4 border-green-500 shadow-sm">
                <Building2 className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Colleges</h3>
                <p className="text-sm text-slate-600">Placement analytics mapping curriculum to real industry needs.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border-t-4 border-orange-500 shadow-sm">
                <Globe className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">India's Growth</h3>
                <p className="text-sm text-slate-600">Supports NEP 2020 and actively resolves structural graduate unemployment.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section id="vision" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
           <div className="md:w-1/2 pr-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Turning Social Impact into a Startup</h2>
              <p className="text-slate-600 mb-6">SkillSync AI evolves from a student guidance tool into India's highly scalable intelligent career navigation platform.</p>
              <ul className="space-y-4 mb-8">
                 <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> <span className="font-medium text-slate-700">B2C Premium Career Plans</span></li>
                 <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> <span className="font-medium text-slate-700">B2B Hiring Solutions for Corporates</span></li>
                 <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> <span className="font-medium text-slate-700">B2B Dashboards for Colleges</span></li>
              </ul>
           </div>
           <div className="md:w-1/2 mt-10 md:mt-0 p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-xl mb-4">Vision Overview</h3>
              <p className="text-slate-600 italic">"To support employability, skilling, and workforce readiness at scale, transforming how talent meets opportunity across the tech ecosystem."</p>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-blue-600 text-white text-center">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold mb-6">Build Smarter Careers with SkillSync AI</h2>
            <p className="text-xl mb-10 text-blue-100">Empowering students, colleges, and companies with AI-driven career intelligence.</p>
            <div className="flex justify-center space-x-4">
               <Link to="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-slate-50 transition shadow-lg">Join the Platform</Link>
               <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Request Demo</button>
            </div>
         </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
            <div className="flex items-center text-white mb-4 md:mb-0"><Brain className="w-6 h-6 mr-2" /> SkillSync AI</div>
            <div className="flex space-x-6 text-sm">
               <a href="#" className="hover:text-white">Privacy</a>
               <a href="#" className="hover:text-white">Terms</a>
               <a href="#" className="hover:text-white">Contact: hello@skillsync.ai</a>
            </div>
            <p className="text-sm mt-4 md:mt-0">© 2026 SkillSync AI. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
