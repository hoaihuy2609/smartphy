
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import LatexResult from './components/LatexResult';
import { AppStatus } from './types';
import { solveProblemsFromImages } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [latexResult, setLatexResult] = useState<string>('');
  const [currentImages, setCurrentImages] = useState<{base64: string, mimeType: string}[]>([]);

  const handleImagesChange = (images: { base64: string, mimeType: string }[]) => {
    setCurrentImages(images);
    if (images.length === 0) {
      setLatexResult('');
      setStatus(AppStatus.IDLE);
    }
    setError(null);
  };

  const handleSolve = async () => {
    if (currentImages.length === 0) return;

    setStatus(AppStatus.SOLVING);
    setError(null);

    try {
      const result = await solveProblemsFromImages(currentImages);
      setLatexResult(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">1. Tải lên đề bài</h2>
            <p className="text-slate-500 mt-1">Chọn tối đa 5 ảnh bài tập toán/lý từ máy của bạn.</p>
          </div>
          
          <ImageUploader 
            onImagesChange={handleImagesChange} 
            disabled={status === AppStatus.SOLVING}
          />

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSolve}
              disabled={currentImages.length === 0 || status === AppStatus.SOLVING}
              className={`
                flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition-all
                ${currentImages.length === 0 || status === AppStatus.SOLVING 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'}
              `}
            >
              {status === AppStatus.SOLVING ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý {currentImages.length} câu hỏi...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  Giải {currentImages.length > 0 ? `${currentImages.length} Bài` : 'Ngay'} & Xuất LaTeX
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {status === AppStatus.SUCCESS && latexResult && (
          <LatexResult latex={latexResult} />
        )}
      </main>

      <footer className="mt-12 py-8 text-center text-slate-400 text-sm">
        <p>© 2024 LaTeX Solution AI Tool. Tất cả các lời giải được hỗ trợ bởi trí tuệ nhân tạo.</p>
        <p className="mt-2">Gợi ý: Kiểm tra kỹ các tham số toán học trước khi in ấn.</p>
      </footer>
    </div>
  );
};

export default App;
