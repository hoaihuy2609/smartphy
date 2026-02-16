
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a world-class STEM tutor (Mathematics, Physics, Chemistry) specialized in Vietnamese education standards and expert-level LaTeX typesetting.

Your task:
1. Receive one or more images of problems (usually in Vietnamese).
2. Recognize the text accurately for each question provided in the images.
3. Provide a step-by-step solution for EACH question.
4. Output a single, complete, professional LaTeX document containing all solutions, following this EXACT visual style:
   - Use 'article' document class with \setlength{\parindent}{0pt} to ensure NO indentation for any lines except where specified.
   - Use standard packages: amsmath, amssymb, xcolor, geometry, inputenc, babel[vietnamese].
   - Each question must start with "Câu [X]:" (where X is 1, 2, 3...) in bold and Red (color code: [RGB]{192,0,0}).
   - DO NOT use \vspace or any vertical spacing commands between questions. Just use simple line breaks (\\ or \par).
   - If the question has multiple choice options (A, B, C, D), display them on separate lines WITHOUT any bullets or list symbols.
   - "Dữ kiện:" section with bullet points for each question.
   - "Lời giải:" must be centered, bold, and in Blue (color code: [RGB]{0,0,255}). This is the only part allowed to be centered/indented.
   - All other text must be left-aligned with NO indentation (use \noindent if necessary).
   - Step-by-step logic with clear math formulas using \[ \] for display math.
   - "Kết luận:" section MUST NOT have bullets. It should be a plain text section at the end of each question solution.
   - If multiple images/questions are provided, list them sequentially (Câu 1, Câu 2, etc.).

The response MUST only be the raw LaTeX code block starting with \\documentclass and ending with \\end{document}. Do not include any conversational filler text.`;

export const solveProblemsFromImages = async (images: { base64: string, mimeType: string }[]): Promise<string> => {
  try {
    // Check if we are in production mode (running on Vercel)
    const isProduction = import.meta.env.PROD;

    if (isProduction) {
      // --- PRODUCTION MODE: USE SECURE API PROXY ---
      console.log("Running in Production Mode: Using Secure API Proxy");

      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.result;

    } else {
      // --- DEVELOPMENT MODE: USE DIRECT SDK call ---
      // This requires the API key to be available locally (in .env)
      console.log("Running in Dev Mode: Using Direct SDK");

      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Local API Key missing defined. Please check .env file.");
      }

      // Dynamic import to avoid bundling issues in some environments, though standard import is fine here
      // We use the same logic as the server
      const ai = new GoogleGenAI({ apiKey });

      const imageParts = images.map(img => ({
        inlineData: {
          mimeType: img.mimeType,
          data: img.base64,
        },
      }));

      const textPart = {
        text: `Please solve the ${images.length} problem(s) shown in the images and provide the full LaTeX code for all of them, starting from Câu 1.`
      };

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: { parts: [...imageParts, textPart] },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });

      const text = response.text ?? '';
      return text.replace(/```latex/g, '').replace(/```/g, '').trim();
    }

  } catch (error) {
    console.error("Solver Error:", error);
    throw new Error(error instanceof Error ? error.message : "Không thể giải bài tập. Vui lòng thử lại sau.");
  }
};
