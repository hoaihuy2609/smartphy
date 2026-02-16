
import React, { useState } from 'react';

interface LatexResultProps {
  latex: string;
}

const LatexResult: React.FC<LatexResultProps> = ({ latex }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 px-6 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
               <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.716 4.01 1.89C12.484 3.716 13.973 3 15.5 3c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">FULL LATEX CODE</span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              copied ? 'bg-green-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy Code
              </>
            )}
          </button>
        </div>
        <div className="p-0">
          <textarea
            readOnly
            value={latex}
            className="w-full h-[600px] p-6 font-mono text-sm bg-slate-900 text-slate-300 focus:outline-none resize-none"
          />
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 italic">
            Copy đoạn code trên dán vào Overleaf để nhận file PDF chuẩn.
          </p>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">PDF 1:1</span>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">LATEX 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatexResult;
