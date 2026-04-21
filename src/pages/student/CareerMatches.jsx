import { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Link } from 'react-router-dom';
import { SearchX, TrendingUp, Zap } from 'lucide-react';

export default function CareerMatches() {
  const { roles, skills } = useAppData();

  // ── Fetch explore (high-demand, 0% match) roles ───────────────────────────
  const [exploreRoles, setExploreRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('skillsync_token');
    if (!token) return;
    fetch('http://localhost:8000/api/dashboard/explore', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : [])
      .then((data) =>
        setExploreRoles(
          data.map((r) => ({
            ...r,
            matchScore: r.match_score,
            demandLevel: r.demand_level,
            avgSalary: r.avg_salary,
            whyMatches: r.why_matches,
            requiredSkills: r.required_skills,
          }))
        )
      )
      .catch(() => {});
  }, [skills]); // re-fetch when skills change

  // ── Skill lookup helpers ──────────────────────────────────────────────────
  const userSkillNames = new Set(skills.map((s) => s.name.toLowerCase()));

  const hasSkill = (reqSkill) => {
    const r = reqSkill.toLowerCase();
    return userSkillNames.has(r);
  };

  // ── Score colour helpers ──────────────────────────────────────────────────
  const getScoreStyle = (score) => {
    if (score >= 70) return { ring: 'border-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (score >= 40) return { ring: 'border-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50'   };
    return             { ring: 'border-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50'   };
  };

  // ── Shared card renderer ──────────────────────────────────────────────────
  const renderCard = (role, idx, isExplore = false) => {
    const style = isExplore
      ? { ring: 'border-slate-300', text: 'text-slate-500', bg: 'bg-slate-50' }
      : getScoreStyle(role.matchScore);
    const isTopMatch = !isExplore && role.matchScore >= 70;

    return (
      <div
        key={role.id}
        className={`group relative bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
          isExplore
            ? 'border-slate-200 hover:shadow-md opacity-90 hover:opacity-100'
            : 'border-slate-100 hover:shadow-xl'
        }`}
        style={{ animationDelay: `${idx * 80}ms` }}
      >
        {/* Top bar */}
        <div
          className={`h-1 w-full bg-gradient-to-r transition-opacity duration-300 ${
            isExplore
              ? 'from-orange-400 to-rose-400 opacity-40 group-hover:opacity-100'
              : 'from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100'
          }`}
        />

        <div className="p-6 md:p-8 flex-1 flex flex-col">
          {/* Title row */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 tracking-wide uppercase">
                  {role.category}
                </span>
                {isTopMatch && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 tracking-wide uppercase shadow-sm">
                    Top Match
                  </span>
                )}
                {isExplore && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 tracking-wide uppercase">
                    <TrendingUp className="w-3 h-3" /> {role.demandLevel} Demand
                  </span>
                )}
              </div>
              <h3 className={`text-xl font-bold transition-colors duration-300 ${
                isExplore ? 'text-slate-700 group-hover:text-orange-600' : 'text-slate-800 group-hover:text-indigo-600'
              }`}>
                {role.title}
              </h3>
            </div>

            {/* Score badge */}
            <div className="flex flex-col items-center shrink-0 ml-4">
              <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-base shadow-inner ${style.ring} ${style.bg} ${style.text}`}>
                {isExplore ? '0%' : `${role.matchScore}%`}
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Match</span>
            </div>
          </div>

          {/* Required skills */}
          <div className="mb-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              Required Skills
              {!isExplore && (
                <span className="ml-2 font-normal text-slate-400 normal-case">
                  (<span className="text-emerald-600 font-semibold">{role.requiredSkills.filter(hasSkill).length}</span>
                  /{role.requiredSkills.length} you have)
                </span>
              )}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {role.requiredSkills.map((skill) => {
                const owned = !isExplore && hasSkill(skill);
                return (
                  <span
                    key={skill}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                      owned
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isExplore
                        ? 'bg-orange-50 border-orange-100 text-orange-700'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    {owned && <span className="mr-1">✓</span>}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Market Demand</span>
              <strong className={`font-bold ${isExplore ? 'text-orange-600' : 'text-slate-800'}`}>
                {role.demandLevel}
              </strong>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Avg Salary</span>
              <strong className="text-slate-800 font-bold">{role.avgSalary}</strong>
            </div>
          </div>

          <Link
            to={`/roadmap?role=${role.id}`}
            state={{ title: role.title }}
            className={`mt-4 w-full relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden font-bold text-white rounded-xl transition-colors duration-300 ${
              isExplore
                ? 'bg-orange-500 hover:bg-orange-600 group/btn'
                : 'bg-slate-900 hover:bg-indigo-600 group/btn'
            }`}
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover/btn:w-56 group-hover/btn:h-56 opacity-10" />
            <span className="relative flex items-center gap-2 text-sm">
              {isExplore ? (
                <><Zap className="w-4 h-4" /> Start Learning</>
              ) : (
                <>View Learning Roadmap
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
          </Link>
        </div>
      </div>
    );
  };

  // ── Empty matched state ───────────────────────────────────────────────────
  const emptyMatchSection = (
    <div className="flex flex-col items-center justify-center py-14 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
        <SearchX className="w-7 h-7 text-indigo-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">No Skill Matches Yet</h3>
      <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
        Update your skills in the <strong>Skill Profile</strong> section so we can find careers that fit you.
      </p>
      <Link
        to="/skill-profile"
        className="mt-5 px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition"
      >
        Update My Skills
      </Link>
    </div>
  );

  // ── Page render ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-500 opacity-20 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white mb-3">
              Career Match Recommendations
            </h2>
            <p className="text-indigo-100 max-w-2xl text-lg font-light leading-relaxed">
              Match score = skills you have ÷ total required. Only roles with at least one of your skills are shown as matches.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-center">
            <p className="text-xs uppercase tracking-widest text-indigo-300 font-semibold mb-1">Roles Matched</p>
            <p className="text-4xl font-black text-white">{roles.length}</p>
          </div>
        </div>
      </div>

      {/* ── Matched Careers ─────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
          Your Matched Careers
        </h3>
        {roles.length === 0
          ? emptyMatchSection
          : <div className="grid lg:grid-cols-2 gap-6">{roles.map((r, i) => renderCard(r, i, false))}</div>
        }
      </section>

      {/* ── Explore High-Demand Careers ──────────────────────────────────────── */}
      {exploreRoles.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
            <h3 className="text-lg font-bold text-slate-800">Explore High-Demand Careers</h3>
            <span className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-0.5 rounded-full font-semibold">
              0% match — start upskilling
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-5 -mt-2">
            These roles have <strong>High</strong> or <strong>Very High</strong> market demand. You currently have none of the required skills, but they're great targets to work towards.
          </p>
          <div className="grid lg:grid-cols-2 gap-6">
            {exploreRoles.map((r, i) => renderCard(r, i, true))}
          </div>
        </section>
      )}
    </div>
  );
}
