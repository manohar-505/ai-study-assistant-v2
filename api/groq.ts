import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
req: VercelRequest,
res: VercelResponse
) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
return res.status(500).json({
error: "Server configuration error: Groq API key is missing.",
});
}

try {
const { action, content } = req.body ?? {};

```
if (
  !["explain", "summary", "quiz"].includes(action) ||
  typeof content !== "string" ||
  !content.trim()
) {
  return res.status(400).json({
    error: "Please provide a valid action and some text.",
  });
}

const instructions: Record<string, string> = {
  explain: `Explain these notes in simple English:\n\n${content.slice(0, 2000)}`,
  summary: `Summarize these notes in bullet points:\n\n${content.slice(0, 2000)}`,
  quiz: `Create 5 multiple-choice questions from the following text.
```

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
${content.slice(0, 2000)}`,
};

````
const groqResponse = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: instructions[action],
        },
      ],
    }),
  }
);

const result = await groqResponse.json();

if (!groqResponse.ok) {
  console.error("Groq API error:", result);
  return res.status(502).json({
    error: "The AI service could not process your request. Please try again.",
  });
}

const responseText = result.choices?.[0]?.message?.content;

if (typeof responseText !== "string") {
  return res.status(502).json({
    error: "The AI service returned an empty response.",
  });
}

if (action === "quiz") {
  const cleaned = responseText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let quizData: unknown;

  try {
    quizData = JSON.parse(cleaned);
  } catch {
    return res.status(502).json({
      error: "The AI returned an invalid quiz. Please try again.",
    });
  }

  if (
    !Array.isArray(quizData) ||
    !quizData.every(
      (q) =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every((option: unknown) => typeof option === "string") &&
        Number.isInteger(q.correctAnswer) &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3
    )
  ) {
    return res.status(502).json({
      error: "The AI returned an incorrectly formatted quiz. Please try again.",
    });
  }

  return res.status(200).json({ success: true, data: quizData });
}

return res.status(200).json({
  success: true,
  data: responseText,
});
````

} catch (error) {
console.error("Backend error:", error);

```
return res.status(500).json({
  error: "Something went wrong. Please try again.",
});
```

}
}
