import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req, res) {
  // Config CORS for Vercel Serverless
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { images } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("Server API Key missing");
        return res.status(500).json({ error: 'Configuration Error: API Key missing on server.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Reconstruct image parts
    const imageParts = images.map(img => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64,
      },
    }));

    const textPart = {
      text: `Please solve the ${images.length} problem(s) shown in the images and provide the full LaTeX code for all of them, starting from Câu 1.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Using flash for faster response in serverless
      contents: { parts: [...imageParts, textPart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    const text = response.text() ?? '';
    const cleanText = text.replace(/```latex/g, '').replace(/```/g, '').trim();

    return res.status(200).json({ result: cleanText });

  } catch (error) {
    console.error("API Proxy Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
