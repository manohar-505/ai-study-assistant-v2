import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
console.log("Groq API Key:", API_KEY?.substring(0, 8));

if (!API_KEY) {
  console.warn("Groq API Key missing");
}

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface AIResponse {
  success: boolean;
  data?: string | QuizQuestion[];
  error?: string;
}

const truncateContent = (content: string, maxLength = 2000) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength);
};

// ---------------- EXPLAIN ----------------
export async function explainNotes(content: string): Promise<AIResponse> {
  try {
    const res = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Explain these notes in simple English:\n\n${truncateContent(content)}`,
        },
      ],
    });

    return { success: true, data: res.choices[0].message.content || "" };
   }catch (err: any) {
  console.error("Groq Error:", err);

  return {
    success: false,
    error: err?.message || "Explain failed",
  };
}
}

// ---------------- SUMMARY ----------------
export async function generateSummary(content: string): Promise<AIResponse> {
  try {
    const res = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Summarize these notes in bullet points:\n\n${truncateContent(content)}`,
        },
      ],
    });

    return { success: true, data: res.choices[0].message.content || "" };
  } catch (err) {
    return { success: false, error: "Summary failed" };
  }
}

// ---------------- QUIZ ----------------
export async function generateQuiz(content: string): Promise<AIResponse> {
  try {
    const res = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
Create 5 MCQ questions from this text.

Return ONLY JSON:
[
  {
    "question": "",
    "options": ["A","B","C","D"],
    "correctAnswer": 0
  }
]

Text:
${truncateContent(content)}
          `,
        },
      ],
    });

    const text = res.choices[0].message.content || "";
    const cleaned = text.replace(/```json|```/g, "");

    return {
      success: true,
      data: JSON.parse(cleaned),
    };
  } catch (err) {
    return {
      success: false,
      error: "Quiz generation failed",
    };
  }
}
