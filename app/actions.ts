"use server"

import { generateQuizOrFlashcard } from "@/lib/ai"

async function extractPDF(buffer: Buffer): Promise<string> {
  const PDFParser = (await import("pdf2json")).default
  return new Promise((resolve, reject) => {
    const parser = new (PDFParser as any)(null, 1)
    parser.on("pdfParser_dataReady", (data: any) => {
      try {
        const text = (data.Pages || [])
          .map((page: any) =>
            (page.Texts || [])
              .map((t: any) =>
                (t.R || []).map((r: any) => decodeURIComponent(r.T)).join("")
              )
              .join(" ")
          )
          .join("\n")
        resolve(text.trim())
      } catch (err) {
        reject(new Error("Failed to parse PDF content"))
      }
    })
    parser.on("pdfParser_dataError", (errData: any) =>
      reject(new Error(errData?.parserError || "PDF parsing failed"))
    )
    parser.parseBuffer(buffer)
  })
}

async function extractDOCX(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth")
  const result = await mammoth.extractRawText({ buffer })
  return result.value.trim()
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const name = file.name.toLowerCase()

  if (name.endsWith(".txt")) {
    return buffer.toString("utf-8").trim()
  }
  if (name.endsWith(".pdf")) {
    return extractPDF(buffer)
  }
  if (name.endsWith(".docx")) {
    return extractDOCX(buffer)
  }
  throw new Error("Unsupported file type. Please upload a .txt, .pdf, or .docx file.")
}

export async function generateContent(formData: FormData) {
  const mode = formData.get("mode") as "quiz" | "flashcard"
  const count = Math.min(Math.max(Number(formData.get("count") || 10), 1), 20)
  const pastedNotes = (formData.get("notes") as string) || ""
  const file = formData.get("file") as File | null

  let notes = pastedNotes

  if (file && file.size > 0) {
    notes = await extractTextFromFile(file)
  }

  notes = notes.trim()
  if (!notes) {
    throw new Error("Please paste your notes or upload a file before generating.")
  }
  if (notes.length < 20) {
    throw new Error("Notes are too short. Please provide more content.")
  }

  const data = await generateQuizOrFlashcard(notes, mode, count)
  return { mode, data }
}
