import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type FlashcardItem = {
  front: string
  back: string
}

export type GeneratedContent = QuizQuestion[] | FlashcardItem[]

export async function generateQuizOrFlashcard(
  notes: string,
  mode: "quiz" | "flashcard",
  count: number = 10
): Promise<GeneratedContent> {
  const truncatedNotes = notes.slice(0, 12000)

  const systemPrompt =
    mode === "quiz"
      ? `You are an expert educational quiz generator. Your ONLY task is to output a valid JSON object.
STRICT RULES:
1. Return ONLY a JSON object with a single key "questions" containing an array of exactly ${count} items.
2. Each item MUST have this exact shape:
   { "question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correctIndex": 0, "explanation": "..." }
3. "correctIndex" is an integer from 0 to 3 indicating which option is correct (0=A, 1=B, 2=C, 3=D).
4. Options MUST start with "A. ", "B. ", "C. ", "D. " respectively.
5. Questions must be clear, specific, and directly based on the provided notes.
6. Do NOT include any markdown, code blocks, comments, or text outside the JSON object.
7. Do NOT use the word "None" or "All of the above" as an option.
Example output structure:
{"questions":[{"question":"What is X?","options":["A. Answer1","B. Answer2","C. Answer3","D. Answer4"],"correctIndex":1,"explanation":"Answer2 is correct because..."}]}`
      : `You are an expert educational flashcard generator. Your ONLY task is to output a valid JSON object.
STRICT RULES:
1. Return ONLY a JSON object with a single key "flashcards" containing an array of exactly ${count} items.
2. Each item MUST have this exact shape:
   { "front": "...", "back": "..." }
3. "front" is a concise question, term, or concept from the notes.
4. "back" is a clear, complete answer or definition.
5. Flashcards must be diverse and cover the key concepts in the notes.
6. Do NOT include any markdown, code blocks, comments, or text outside the JSON object.
Example output structure:
{"flashcards":[{"front":"What is X?","back":"X is the concept that..."}]}`

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate exactly ${count} ${mode === "quiz" ? "quiz questions" : "flashcards"} based on these notes:\n\n${truncatedNotes}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4096,
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error("No content returned from AI")

  const parsed = JSON.parse(content)

  if (mode === "quiz") {
    const questions = parsed.questions as QuizQuestion[]
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid quiz data returned from AI")
    }
    return questions
  } else {
    const flashcards = parsed.flashcards as FlashcardItem[]
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error("Invalid flashcard data returned from AI")
    }
    return flashcards
  }
}
