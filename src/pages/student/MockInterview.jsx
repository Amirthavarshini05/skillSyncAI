import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, User, Send, Zap, Award, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MockInterview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const job = location.state?.job;

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interviewStage, setInterviewStage] = useState(0); 
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (!job) {
      navigate('/tracker');
      return;
    }
    
    setTimeout(() => {
       setMessages([{
         id: 1,
         role: 'ai',
         text: `Hello ${user?.name || ''}! I'm the AI Recruiter for ${job.company}. I see you're interviewing for the ${job.title} position. I'll be conducting your technical screening today. When you're ready, just say "Ready" and we'll begin!`,
         stage: 'intro'
       }]);
    }, 1000);
  }, [job, navigate, user]);

  const QUESTION_BANK = {
    'React': 'Can you explain how the Virtual DOM works and why it makes React so fast?',
    'Javascript': 'What is the Event Loop in JavaScript, and how does it handle asynchronous callbacks?',
    'Python': 'Can you explain the concept of decorators in Python and give an example of when you might use one?',
    'Node.js': 'How does Node.js handle concurrent requests even though it is single-threaded?',
    'Sql': 'What is the difference between an INNER JOIN and a LEFT JOIN in SQL?',
    'Aws': 'If you needed to deploy a scalable web application on AWS, which services would you choose and why?',
    'Java': 'Explain the concept of OOP principles and how they are implemented in Java.',
    'Docker': 'What is the fundamental difference between a Docker container and a virtual machine?'
  };

  const BEHAVIORAL = "That's great. Finally, can you tell me about a time you had to overcome a difficult technical challenge on a tight deadline?";

  // Simple heuristic logic to simulate an AI interviewer
  const handleAIResponse = (userText) => {
     setIsTyping(true);
     
     setTimeout(() => {
        let aiReply = "";
        let newStage = interviewStage;

        const skills = job.requiredSkills || [];
        const techSkill1 = skills[0] || 'Software Engineering';
        const techSkill2 = skills[1] || 'Web Development';

        // Find a question from the bank or use a generic one
        const getQ = (skill) => {
           const key = Object.keys(QUESTION_BANK).find(k => skill.toLowerCase().includes(k.toLowerCase()));
           return key ? QUESTION_BANK[key] : `What is your experience working with ${skill}, and what is the most complex thing you've built with it?`;
        };

        if (interviewStage === 0) {
           aiReply = `Awesome. Let's start with a technical question regarding your stack. \n\n${getQ(techSkill1)}`;
           newStage = 1;
        } 
        else if (interviewStage === 1) {
           // Provide fake evaluation of their answer
           if (userText.length < 20) {
              aiReply = `Could you elaborate a bit more on that? I'd love to hear more details.`;
           } else {
              aiReply = `Good explanation. Let's move on to another core technology for this role. \n\n${getQ(techSkill2)}`;
              newStage = 2;
           }
        }
        else if (interviewStage === 2) {
           if (userText.length < 20) {
              aiReply = `Could you provide a bit more detail?`;
           } else {
              aiReply = `Excellent. It sounds like you have a solid grasp of that. \n\n${BEHAVIORAL}`;
              newStage = 3;
           }
        }
        else if (interviewStage === 3) {
           aiReply = `Thank you for sharing that experience! That concludes our mock interview. I will now analyze your responses and generate your feedback report.`;
           newStage = 4;
           
           // Trigger feedback generation
           setTimeout(() => generateFeedback(), 2500);
        }

        setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: aiReply }]);
        setInterviewStage(newStage);
        setIsTyping(false);
     }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay for realism
  };

  const generateFeedback = () => {
      setIsTyping(true);
      setTimeout(() => {
         setIsTyping(false);
         setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'ai',
            type: 'feedback',
            text: `**Mock Interview Feedback Report**\n\nOverall, you did a great job! You demonstrated strong foundational knowledge for the ${job.title} role.\n\n**Strengths:**\n- Confident technical explanations.\n- Good understanding of ${job.requiredSkills[0] || 'core technologies'}.\n\n**Areas for Improvement:**\n- Try to use the STAR method (Situation, Task, Action, Result) for behavioral questions to give more structured answers.\n- When explaining technical concepts, providing a quick real-world example from a past project makes your answer much stronger.\n\nGood luck with your real interview at ${job.company}!`
         }]);
      }, 3000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    
    const newMsg = { id: Date.now(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    // If the interview is over, don't respond
    if (interviewStage < 4) {
       handleAIResponse(inputValue);
    }
  };

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 p-5 px-8 flex items-center justify-between shrink-0">
         <div className="flex items-center gap-4">
            <Link to="/tracker" className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full">
               <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
               <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" /> AI Mock Interviewer
               </h2>
               <p className="text-slate-400 text-xs font-medium">Interviewing for: <span className="text-indigo-300">{job.title} at {job.company}</span></p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Live Session</span>
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
         {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                  
                  {/* Avatar */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                     {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl ${
                     msg.type === 'feedback' 
                       ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-500 shadow-lg w-full'
                       : msg.role === 'user' 
                         ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                         : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100'
                  }`}>
                     {msg.type === 'feedback' && <div className="flex items-center gap-2 mb-3 text-indigo-300 font-bold border-b border-indigo-700/50 pb-2"><Award className="w-5 h-5"/> Scorecard Generated</div>}
                     <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>

               </div>
            </div>
         ))}
         
         {isTyping && (
            <div className="flex justify-start">
               <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shadow-sm">
                     <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1.5">
                     <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                     <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
               </div>
            </div>
         )}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
         {interviewStage >= 4 ? (
            <div className="text-center p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-100">
               <CheckCircle2 className="w-5 h-5" /> Interview Completed
            </div>
         ) : (
            <form onSubmit={handleSend} className="flex items-end gap-2">
               <textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                     }
                  }}
                  placeholder="Type your answer here... (Press Enter to send)"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 min-h-[50px]"
                  rows="2"
               />
               <button 
                  type="submit" 
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-2xl transition-colors disabled:opacity-50 shadow-md shadow-indigo-200 shrink-0"
               >
                  <Send className="w-5 h-5" />
               </button>
            </form>
         )}
      </div>
    </div>
  );
}
