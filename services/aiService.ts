import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, IssueType } from "../types";

// Initialize Gemini Client
// The API key is securely loaded from process.env.API_KEY. 
// Ensure this variable is set in your environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    issue_type: {
      type: Type.STRING,
      enum: Object.values(IssueType),
      description: "The strict category of the civic issue identified.",
    },
    severity: {
      type: Type.INTEGER,
      description: "Urgency scale from 1 (cosmetic) to 10 (immediate safety hazard).",
    },
    title: {
      type: Type.STRING,
      description: "A short, professional summary of the issue (e.g., 'Severe Asphalt Deterioration').",
    },
    description: {
      type: Type.STRING,
      description: "Technical description of visual evidence (dimensions, material type, obstruction).",
    },
    visual_reasoning: {
      type: Type.STRING,
      description: "Chain of thought: specific visual cues leading to this conclusion.",
    },
    suggested_action: {
      type: Type.STRING,
      description: "Recommended remediation step for the municipality.",
    },
  },
  required: ["issue_type", "severity", "title", "description", "visual_reasoning", "suggested_action"],
};

export const analyzeImage = async (base64Image: string): Promise<AnalysisResponse> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are an expert Civil Engineer and Urban Planner in Bhubaneswar, India.
      Analyze this image for civic infrastructure issues.
      
      1. Identify the primary issue from the visual evidence.
      2. Categorize it strictly into one of the provided Enum categories.
      3. Assess severity (1-10) based on safety risk, traffic impact, and monsoon drainage implications.
      4. Provide a technical description suitable for a municipal work order.
      
      Context: Bhubaneswar faces specific challenges with open drains, bitumen degradation, and waste management.
      If the image is clean or shows no issues, categorize as 'CLEAN'.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, // Low temperature for deterministic technical reporting
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResponse;
    } else {
      throw new Error("No text response from Gemini");
    }
  } catch (error) {
    console.error("AI Analysis Failed. Please verify your API_KEY configuration.", error);
    // Fallback for demo purposes if API key is invalid or quota exceeded
    return {
      issue_type: IssueType.OTHER,
      severity: 5,
      title: "Analysis Failed",
      description: "Could not process image. Please ensure your Google Gemini API Key is valid and configured in the environment variables.",
      suggested_action: "Verify API Configuration",
      visual_reasoning: "System error or missing API credentials."
    };
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};