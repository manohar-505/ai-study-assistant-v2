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

type AIAction = "explain" | "summary" | "quiz";

async function requestAI(
action: AIAction,
content: string
): Promise<AIResponse> {
try {
const response = await fetch("/api/groq", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ action, content }),
});


const result = await response.json();

if (!response.ok || !result.success) {
  throw new Error(result.error || "AI request failed.");
}

return {
  success: true,
  data: result.data,
};


} catch (error: unknown) {
console.error(`AI ${action} error:`, error);


return {
  success: false,
  error:
    error instanceof Error
      ? error.message
      : "Something went wrong. Please try again.",
};


}
}

export async function explainNotes(
content: string
): Promise<AIResponse> {
return requestAI("explain", content);
}

export async function generateSummary(
content: string
): Promise<AIResponse> {
return requestAI("summary", content);
}

export async function generateQuiz(
content: string
): Promise<AIResponse> {
return requestAI("quiz", content);
}
