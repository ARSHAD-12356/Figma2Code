'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

const formSchema = z.object({
  figmaUrl: z.string().url({
    message: 'Please enter a valid Figma URL.',
  }),
});

type FigmaFormProps = {
  onGenerate: (figmaUrl: string) => Promise<void>;
  isLoading: boolean;
};

export function FigmaForm({ onGenerate, isLoading }: FigmaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      figmaUrl: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values.figmaUrl);
  }

  return (
    <Card className="flex-grow">
      <CardHeader>
        <CardTitle>1. Enter Figma URL</CardTitle>
        <CardDescription>
          Provide a public link to your Figma design. The AI will analyze the design to generate code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="figmaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Figma URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.figma.com/design/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Make sure sharing permissions are set to "anyone with the link can view".
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Code...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate Code
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
