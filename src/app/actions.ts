'use server';

import { generateCode } from '@/ai/flows/generate-code-from-figma';
import type { GenerateCodeOutput } from '@/ai/flows/generate-code-from-figma';
import { z } from 'zod';

const figmaUrlSchema = z.string().url({ message: 'Please enter a valid Figma URL.' });

type State = {
  data: GenerateCodeOutput | null;
  error: string | null;
};

export async function generateCodeAction(figmaUrl: string): Promise<State> {
  const validatedUrl = figmaUrlSchema.safeParse(figmaUrl);
  if (!validatedUrl.success) {
    return { data: null, error: validatedUrl.error.errors[0].message };
  }

  try {
    // A simple mock for demonstration purposes if Genkit isn't fully configured
    // This can be replaced with the actual Genkit call
    if (process.env.NODE_ENV === 'development' && !process.env.GOOGLE_API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { 
            data: { 
                htmlCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock Design</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Your Design</h1>
        <p>This is a mock response.</p>
        <button class="btn">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`, 
                cssCode: `body {
    font-family: sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
}
.container {
    text-align: center;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.btn {
    background-color: #9400D3;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
}`,
                jsCode: `document.querySelector('.btn').addEventListener('click', () => {
    alert('Button clicked!');
});`
            }, 
            error: null 
        };
    }

    const result = await generateCode({ figmaUrl: validatedUrl.data });
    if (!result.htmlCode || !result.cssCode) {
        return { data: null, error: 'The AI returned an empty response. Please check your Figma link or try again.'}
    }
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to generate code: ${errorMessage}` };
  }
}
