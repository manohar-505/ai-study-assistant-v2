import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY is missing in Vercel settings.",
    });
  }

  try {
    const body = req.body || {};
    const action = body.action;
    const content = body.content;

    if (
      ["explain", "summary", "quiz"].indexOf(action) === -1 ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        error: "Invalid action or empty content.",
      });
    }

    let prompt = "";
    const notes = content.slice(0, 2000);

    if (action === "explain") {
      prompt = "Explain these notes in simple English:\n\n" + notes;
    } else if (action === "summary") {
      prompt = "Summarize these notes in bullet points:\n\n" + notes;
    } else {
      prompt =
        'Create 5 multiple-choice questions from the text below. ' +
        'Return ONLY valid JSON, without Markdown code fences. ' +
        'Use this format: [{"question":"Question text",' +
        '"options":["Option A","Option B","Option C","Option D"],' +
        '"correctAnswer":0}]. ' +
        "correctAnswer must be an index from 0 to 3.\n\nText:\n" +
        notes;
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const result = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error("Groq API error:", result);

      return res.status(502).json({
        error: "Groq could not process the request. Please try again.",
      });
    }

    const responseText = result.choices?.[0]?.message?.content;

    if (typeof responseText !== "string") {
      return res.status(502).json({
        error: "The AI returned an empty response.",
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
          error: "The AI returned invalid quiz data. Please try again.",
        });
      }

      if (
        !Array.isArray(quizData) ||
        !quizData.every(
          (q: any) =>
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
          error: "The AI returned an incorrectly formatted quiz.",
        });
      }

      return res.status(200).json({
        success: true,
        data: quizData,
      });
    }

    return res.status(200).json({
      success: true,
      data: responseText,
    });
  } catch (error) {
    console.error("Backend error:", error);

    return res.status(500).json({
      error: "Something went wrong in the AI backend.",
    });
  }
}