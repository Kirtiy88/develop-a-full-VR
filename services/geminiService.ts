import { GoogleGenAI } from "@google/genai";
import { WaveParams } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePhysicsHelp = async (
  question: string,
  currentParams: WaveParams
): Promise<string> => {
  if (!apiKey) return "Error: API Key is missing. Please check your environment variables.";

  try {
    const context = `
      Current Simulation State:
      - Frequency: ${currentParams.frequency} Hz
      - Amplitude: ${currentParams.amplitude} m
      - Wave Speed: ${currentParams.speed} m/s
      - Calculated Wavelength (Lambda): ${currentParams.speed / currentParams.frequency} m
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful Physics Lab Assistant for a VR Wave Simulation.
      ${context}
      
      The student asks: "${question}"
      
      Provide a concise, encouraging, and scientifically accurate answer. 
      If they ask for the answer directly, guide them on how to calculate it using Lambda = v / f instead of just giving the number.
      Keep the tone educational and friendly.`,
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini Physics Help Error:", error);
    return "I'm having trouble connecting to the lab mainframe. Please try again.";
  }
};

export const generateUnityScript = async (params: WaveParams): Promise<string> => {
  if (!apiKey) return "// Error: API Key missing. Cannot generate script.";

  try {
    const prompt = `
      Write a complete, ready-to-use C# Unity script named "WaveController.cs".
      
      Requirements:
      1. It should use a LineRenderer component to visualize a sine wave.
      2. It should have public variables for Frequency (default ${params.frequency}), Amplitude (default ${params.amplitude}), and Speed (default ${params.speed}).
      3. It should animate the wave in the Update() loop.
      4. Include comments explaining how to attach it in the Unity Editor.
      5. The code should be clean and optimized.
      
      Output ONLY the C# code block. No markdown backticks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Strip markdown code blocks if present
    let cleanCode = response.text || "";
    cleanCode = cleanCode.replace(/^```csharp\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');
    
    return cleanCode;
  } catch (error) {
    console.error("Unity Script Generation Error:", error);
    return "// Error generating Unity script. Please check console.";
  }
};
