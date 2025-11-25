import type { GoogleGenAI } from '@google/genai';
import type { EvaluationData } from '../types';
import { extractEvaluationDataFromText } from './geminiService';

declare const pdfjsLib: any;

// Set the worker script path for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;

/**
 * Extracts all text content from a given PDF file.
 * @param file The PDF file to process.
 * @returns A promise that resolves to the full text content of the PDF.
 */
const extractTextFromPdf = async (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error("파일을 읽을 수 없습니다."));
      }

      try {
        const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((s: any) => s.str).join(' ');
          fullText += pageText + '\n';
        }
        resolve(fullText);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        reject(new Error("PDF 텍스트를 추출하는 중 오류가 발생했습니다."));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("파일 읽기 오류."));
    };

    fileReader.readAsArrayBuffer(file);
  });
};

/**
 * Parses a PDF file to extract evaluation data.
 * It first extracts raw text and then uses Gemini to structure that text.
 * @param file The PDF file to parse.
 * @param ai The GoogleGenAI client instance.
 * @returns A promise that resolves to the structured EvaluationData.
 */
export const parsePdf = async (file: File, ai: GoogleGenAI): Promise<EvaluationData> => {
  console.log('Starting real PDF parsing for file:', file.name);
  
  const rawText = await extractTextFromPdf(file);
  if (!rawText.trim()) {
      throw new Error("PDF에서 텍스트를 추출할 수 없습니다. 텍스트 기반 PDF인지 확인해주세요.");
  }

  const data = await extractEvaluationDataFromText(ai, rawText);
  return data;
};
