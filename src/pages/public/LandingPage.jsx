import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, TrendingUp, Compass, Briefcase, GraduationCap, ChevronRight, BarChart, Server, Link as LinkIcon, AlertTriangle, Layers, Zap, Star, Shield, Building, Building2, Globe, CheckCircle, Play, ArrowRight, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/20 blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-blue-900/10 blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-slate-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 flex items-center font-black text-2xl text-white tracking-tight"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/20">
                <Brain className="w-6 h-6 text-white" />
              </div>
              SkillSync <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ml-1">AI</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:flex space-x-8 items-center text-sm font-semibold"
            >
              <a href="#platform" className="text-slate-400 hover:text-white transition-colors">Platform</a>
              <a href="#intelligence" className="text-slate-400 hover:text-white transition-colors">Intelligence</a>
              <a href="#impact" className="text-slate-400 hover:text-white transition-colors">Impact</a>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors ml-4">Sign in</Link>
              <Link to="/signup" className="group relative px-5 py-2.5 bg-white text-slate-900 rounded-full hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4" /> The Next Generation of Career Navigation
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8">
              Navigate your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">artificial intelligence.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              SkillSync AI maps your competencies, identifies skill gaps, and builds personalized roadmaps to make you industry-ready from day one.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center group">
                Start your journey <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium">
               <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Free for students</div>
               <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> No credit card required</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:w-1/2 relative w-full perspective-1000"
          >
            {/* Product Showcase Mockup */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-indigo-900/50 overflow-hidden transform rotate-y-[-10deg] rotate-x-[5deg]">
              <div className="h-8 bg-slate-950 flex items-center px-4 gap-2 border-b border-slate-800">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2"><Brain className="w-5 h-5 text-indigo-400"/> AI Skill Graph</h3>
                    <p className="text-sm text-slate-400">Real-time competency mapping</p>
                  </div>
                  <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
                    94% Match
                  </div>
                </div>
                
                <div className="space-y-4 relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
                   {[
                     { skill: "React Architecture", score: 92, color: "bg-blue-500" },
                     { skill: "Node.js Microservices", score: 85, color: "bg-green-500" },
                     { skill: "System Design", score: 68, color: "bg-orange-500" },
                   ].map((item, i) => (
                      <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                         <div className="flex justify-between text-sm font-semibold mb-2">
                            <span className="text-slate-200">{item.skill}</span>
                            <span className="text-slate-400">{item.score}%</span>
                         </div>
                         <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                              className={`h-full ${item.color} rounded-full`}
                            ></motion.div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-8 top-20 bg-slate-800/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400"><TrendingUp className="w-6 h-6"/></div>
                  <div>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Market Demand</p>
                     <p className="text-white font-black text-lg">+124% Growth</p>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Platform */}
      <section id="platform" className="py-32 relative z-10 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-3">Intelligent Platform</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">get hired.</span></h3>
            <p className="text-lg text-slate-400">We replace generic job boards and static courses with a dynamic engine that adapts to the labor market in real-time.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Skill Profiling", desc: "Upload your resume and let our LLMs map your exact competency level across hundreds of technical dimensions.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
              { icon: BarChart, title: "Market Intelligence", desc: "Access live data on what skills companies are actually hiring for right now, not what they wanted 3 years ago.", color: "text-purple-400", bg: "bg-purple-500/10" },
              { icon: Compass, title: "Dynamic Roadmaps", desc: "Get step-by-step learning paths tailored to your exact skill gaps to reach your target role faster.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Zap, title: "AI Mentor", desc: "Chat with an intelligent mentor that understands your profile, suggests projects, and helps you debug code.", color: "text-amber-400", bg: "bg-amber-500/10" },
              { icon: Layers, title: "Mock Interviews", desc: "Practice with our AI interviewer that asks role-specific questions and grades your technical responses.", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: LinkIcon, title: "Opportunity Matching", desc: "Skip the generic search. Get matched with internships and jobs where your skill graph is a perfect fit.", color: "text-rose-400", bg: "bg-rose-500/10" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-900 border border-white/5 p-8 rounded-3xl hover:bg-slate-800/80 transition-colors group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Impact */}
      <section id="impact" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-4xl font-bold text-white mb-6">Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">academia and industry.</span></h2>
                 <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                   The current education system leaves 52% of graduates unemployable. SkillSync AI fixes this structural mismatch by bringing real-time industry requirements directly to the student.
                 </p>
                 <ul className="space-y-6">
                    {[
                      { title: "Reduce Time-to-Hire", desc: "Students are industry-ready months faster." },
                      { title: "Data-Driven Decisions", desc: "Colleges can align curriculum with real metrics." },
                      { title: "Precision Recruitment", desc: "Companies find exact technical matches instantly." }
                    ].map((item, i) => (
                       <li key={i} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                             <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                             <h4 className="font-bold text-white">{item.title}</h4>
                             <p className="text-slate-400">{item.desc}</p>
                          </div>
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-8 rounded-3xl border border-white/5 text-center flex flex-col justify-center">
                    <h3 className="text-5xl font-black text-white mb-2">52%</h3>
                    <p className="text-slate-400 text-sm font-medium">Of graduates lack industry readiness</p>
                 </div>
                 <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-3xl border border-white/10 text-center flex flex-col justify-center">
                    <h3 className="text-5xl font-black text-white mb-2">10x</h3>
                    <p className="text-indigo-200 text-sm font-medium">Faster path to first tech job</p>
                 </div>
                 <div className="col-span-2 bg-slate-900 p-8 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div>
                       <h3 className="text-3xl font-black text-white mb-1">2M+</h3>
                       <p className="text-slate-400 text-sm font-medium">Job Data Points Analyzed</p>
                    </div>
                    <Server className="w-12 h-12 text-slate-700" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative z-10">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-[1px] rounded-[2.5rem] overflow-hidden">
               <div className="bg-slate-950 px-8 py-20 md:p-20 rounded-[2.5rem] text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to accelerate your career?</h2>
                  <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of students and professionals using AI to build their future.</p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
                     <Link to="/signup" className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition shadow-xl shadow-white/10">
                        Create Free Account
                     </Link>
                     <Link to="/signup?role=college" className="bg-slate-800 text-white border border-white/10 px-8 py-4 rounded-full font-bold hover:bg-slate-700 transition flex items-center justify-center">
                        For Universities
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-white font-bold text-xl mb-4 md:mb-0">
               <Brain className="w-6 h-6 mr-2 text-indigo-500" /> SkillSync AI
            </div>
            <div className="flex space-x-8 text-sm font-medium text-slate-500">
               <a href="#" className="hover:text-slate-300 transition-colors">Platform</a>
               <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
               <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
               <a href="#" className="hover:text-slate-300 transition-colors">hello@skillsync.ai</a>
            </div>
            <p className="text-slate-600 text-sm mt-8 md:mt-0 font-medium">© 2026 SkillSync AI. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
