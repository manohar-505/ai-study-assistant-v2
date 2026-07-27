import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Check, Brain, Sparkles, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { explainNotes, generateSummary } from '@/services/gemini';
import { getUploadedContent } from '@/hooks/useUploadedContent';

const sampleContent = `Cell Division: Mitosis and Meiosis

Cell division is the process by which a parent cell divides into two or more daughter cells. There are two main types of cell division: mitosis and meiosis.

Mitosis is the process by which a cell replicates its chromosomes and segregates them, producing two identical nuclei in preparation for cell division. This process is essential for growth, repair, and asexual reproduction.

The stages of mitosis include:
1. Prophase: Chromatin condenses into chromosomes, the nuclear envelope breaks down, and spindle fibers begin to form.
2. Metaphase: Chromosomes align at the metaphase plate (equator of the cell), with spindle fibers attached to each chromosome.
3. Anaphase: Sister chromatids separate and move toward opposite poles of the cell.
4. Telophase: Chromosomes reach the poles and begin to decondense. Nuclear envelopes reform around each set of chromosomes.
5. Cytokinesis: The cytoplasm divides, resulting in two daughter cells.

Meiosis produces four unique haploid cells through two successive divisions, crucial for sexual reproduction and genetic diversity. Unlike mitosis, meiosis involves crossing over and independent assortment, which create genetic variation.

Key differences between mitosis and meiosis:
- Mitosis produces 2 identical diploid cells; meiosis produces 4 unique haploid cells
- Mitosis involves one division; meiosis involves two successive divisions
- Mitosis is for growth and repair; meiosis is for gamete production
- No crossing over occurs in mitosis; crossing over is a key feature of meiosis`;

const responseConfig = {
  explain: {
    title: 'AI Explanation',
    icon: Brain,
  },
  summary: {
    title: 'AI Summary',
    icon: Sparkles,
  },
};

function renderMarkdownContent(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('## ')) {
      return (
        <h2
          key={index}
          className="text-2xl font-bold text-white mt-6 mb-4"
        >
          {line.replace('## ', '')}
        </h2>
      );
    }
    if (line.startsWith('### ')) {
      return (
        <h3
          key={index}
          className="text-xl font-semibold text-white mt-4 mb-2"
        >
          {line.replace('### ', '')}
        </h3>
      );
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={index} className="font-semibold text-white">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    }
    if (line.startsWith('- ')) {
      return (
        <li
          key={index}
          className="ml-4 text-muted-foreground list-disc"
        >
          {line.replace('- ', '')}
        </li>
      );
    }
    if (line.match(/^\d+\.\s/)) {
      return (
        <li
          key={index}
          className="ml-4 text-muted-foreground list-decimal"
        >
          {line.replace(/^\d+\.\s/, '')}
        </li>
      );
    }
    if (line.trim() === '') {
      return <br key={index} />;
    }
    const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (boldLine !== line) {
      return (
        <p
          key={index}
          className="text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: boldLine }}
        />
      );
    }
    return (
      <p key={index} className="text-muted-foreground">
        {line}
      </p>
    );
  });
}

export function AIResponsePage() {
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') || 'explain') as 'explain' | 'summary';
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseContent, setResponseContent] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  const config = responseConfig[type] || responseConfig.explain;
  const IconComponent = config.icon;

  const storedContent = getUploadedContent();
  const contentToUse = storedContent?.content || sampleContent;
  const filename = storedContent?.filename || 'Biology Chapter 5 - Cell Division.pdf';

  const generateContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = type === 'summary'
        ? await generateSummary(contentToUse)
        : await explainNotes(contentToUse);

      const endTime = performance.now();
      setGenerationTime(Math.round((endTime - startTime) / 100) / 10);

      if (response.success && response.data) {
        setResponseContent(response.data as string);
      } else {
        setError(response.error || 'Failed to generate content. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [type, contentToUse]);

  useEffect(() => {
    generateContent();
  }, []);

  const handleCopy = () => {
    if (responseContent) {
      navigator.clipboard.writeText(responseContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    generateContent();
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />

      <main className="ml-72 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{config.title}</h1>
              <p className="text-muted-foreground">
                Generated from: {filename}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="mt-4 rounded-xl"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="glass-card border-0 shadow-glass mb-6">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl gradient-primary">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">AI Response</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg hover:bg-muted"
                    title="Regenerate"
                    onClick={handleRegenerate}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="rounded-lg gap-2"
                    disabled={!responseContent || isLoading}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="p-4 rounded-full gradient-primary mb-4">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                    <p className="text-muted-foreground">Generating {type === 'summary' ? 'summary' : 'explanation'}...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
                  </motion.div>
                ) : responseContent ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="prose prose-invert max-w-none"
                  >
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      {renderMarkdownContent(responseContent)}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {generationTime ? `Generated in ${generationTime}s` : 'Ready to generate'}
            </p>
            <div className="flex gap-3">
              <Link to="/quiz">
                <Button className="gradient-primary hover:gradient-primary-hover text-white rounded-xl">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Quiz
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
