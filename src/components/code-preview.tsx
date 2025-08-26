'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Check, Code, Copy, Download, Terminal } from 'lucide-react';
import type { GenerateCodeOutput } from '@/ai/flows/generate-code-from-figma';

type CodePreviewProps = {
  code: GenerateCodeOutput | null;
  isLoading: boolean;
  error: string | null;
};

function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
      <div className="bg-secondary p-4 rounded-full mb-4">
        <Code className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Waiting for generation</h3>
      <p>Your generated code will appear here once you provide a Figma URL.</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="p-6">
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7"
        onClick={handleCopy}
      >
        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function CodePreview({ code, isLoading, error }: CodePreviewProps) {
  const handleDownload = () => {
    if (!code) return;
    const zip = new JSZip();
    zip.file('index.html', code.htmlCode);
    zip.file('styles.css', code.cssCode);
    if (code.jsCode) {
      zip.file('script.js', code.jsCode);
    }
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'figma2code.zip');
    });
  };

  return (
    <Card className="flex-grow flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>2. Generated Code</CardTitle>
            <CardDescription>
              Preview the HTML, CSS, and JS. You can copy or download the files.
            </CardDescription>
          </div>
          {code && (
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download ZIP
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {isLoading && <LoadingSkeleton />}
        {error && <ErrorDisplay message={error} />}
        {!isLoading && !error && !code && <Placeholder />}
        {!isLoading && !error && code && (
          <Tabs defaultValue="html" className="flex-grow flex flex-col">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              {code.jsCode && <TabsTrigger value="js">JavaScript</TabsTrigger>}
            </TabsList>
            <TabsContent value="html" className="flex-grow mt-4">
              <CodeBlock code={code.htmlCode} />
            </TabsContent>
            <TabsContent value="css" className="flex-grow mt-4">
              <CodeBlock code={code.cssCode} />
            </TabsContent>
            {code.jsCode && (
              <TabsContent value="js" className="flex-grow mt-4">
                <CodeBlock code={code.jsCode} />
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
