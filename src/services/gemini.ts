
import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!API_KEY) {
  console.warn("Groq API key is missing. Check your .env file.");
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
export async function explainNotes(
  content: string
): Promise<AIResponse> {
  try {
    const res = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: `Explain these notes in simple English:\n\n${truncateContent(content)}`,
        },
      ],
    });

    return {
      success: true,
      data: res.choices[0].message.content || "",
    };
  } catch (err: unknown) {
    console.error("Groq Explain Error:", err);

    return {
      success: false,
      error: err instanceof Error ? err.message : "Explain failed",
    };
  }
}

// ---------------- SUMMARY ----------------
export async function generateSummary(
  content: string
): Promise<AIResponse> {
  try {
    const res = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: `Summarize these notes in bullet points:\n\n${truncateContent(content)}`,
        },
      ],
    });

    return {
      success: true,
      data: res.choices[0].message.content || "",
    };
  } catch (err: unknown) {
    console.error("Groq Summary Error:", err);

    return {
      success: false,
      error: err instanceof Error ? err.message : "Summary failed",
    };
  }
}

// ---------------- QUIZ ----------------
export async function generateQuiz(
  content: string
): Promise<AIResponse> {
  try {
    const res = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: `
Create 5 multiple-choice questions from the following text.

Return ONLY valid JSON, without Markdown code fences, using this format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

The correctAnswer must be an index from 0 to 3.

Text:
${truncateContent(content)}
          `,
        },
      ],
    });

    const responseText = res.choices[0].message.content || "";
    const cleaned = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const quizData: QuizQuestion[] = JSON.parse(cleaned);

    return {
      success: true,
      data: quizData,
    };
  } catch (err: unknown) {
    console.error("Groq Quiz Error:", err);

    return {
      success: false,
      error: err instanceof Error
        ? err.message
        : "Quiz generation failed",
    };
  }
}
