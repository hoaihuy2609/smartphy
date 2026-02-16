
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-6 mb-8 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            Σ
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">LaTeX Solve AI</h1>
            <p className="text-sm text-slate-500 font-medium">Giải bài tập & Xuất code LaTeX chuyên nghiệp</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-100">
            Powered by Gemini 3 Pro
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
