'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { FigmaForm } from '@/components/figma-form';
import { CodePreview } from '@/components/code-preview';
import type { GenerateCodeOutput } from '@/ai/flows/generate-code-from-figma';
import { generateCodeAction } from '@/app/actions';

export default function Home() {
  const [code, setCode] = useState<GenerateCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (figmaUrl: string) => {
    setIsLoading(true);
    setCode(null);
    setError(null);

    const result = await generateCodeAction(figmaUrl);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setCode(result.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col">
            <FigmaForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <div className="mt-8 lg:mt-0 flex flex-col">
            <CodePreview code={code} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-muted-foreground text-sm">
        <p>Powered by Firebase Genkit</p>
      </footer>
    </div>
  );
}
