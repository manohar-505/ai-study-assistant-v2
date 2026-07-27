import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateQuiz, QuizQuestion } from '@/services/gemini';
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
- Mitosis is for growth and repair; meiosis is for gamete production`;

export function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const storedContent = getUploadedContent();
  const contentToUse = storedContent?.content || sampleContent;

  const loadQuiz = useCallback(async (isRegenerate = false) => {
    if (isRegenerate) {
      setRegenerating(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    setAnswers({});
    setSubmitted(false);
    setScore(0);

    try {
      const response = await generateQuiz(contentToUse);

      if (response.success && response.data) {
        setQuestions(response.data as QuizQuestion[]);
      } else {
        setError(response.error || 'Failed to generate quiz. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setRegenerating(false);
    }
  }, [contentToUse]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const handleAnswer = (questionId: number, value: string) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: parseInt(value),
      }));
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleRegenerate = () => {
    loadQuiz(true);
  };

  const allAnswered = questions.length > 0 && questions.every((_, index) => answers[index] !== undefined);
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />

      <main className="ml-72 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Quiz: Cell Division</h1>
                <p className="text-muted-foreground">
                  {questions.length > 0 ? `${questions.length} questions generated by AI` : 'Loading quiz...'}
                </p>
              </div>
            </div>
            {questions.length > 0 && !isLoading && (
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="rounded-xl gap-2"
              >
                <RotateCcw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
                New Quiz
              </Button>
            )}
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
                  onClick={() => loadQuiz()}
                  className="mt-4 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="p-4 rounded-full gradient-primary mb-4">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <p className="text-muted-foreground">Generating quiz questions...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
              </motion.div>
            ) : submitted ? (
              <motion.div
                key="score"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card border-0 shadow-glass mb-8 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative p-8 text-center">
                      <div className="absolute inset-0 mesh-gradient opacity-30" />
                      <div className="relative">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                          className={`inline-flex p-4 rounded-full mb-4 ${
                            percentage >= 80
                              ? 'bg-green-500/20'
                              : percentage >= 60
                              ? 'bg-yellow-500/20'
                              : 'bg-red-500/20'
                          }`}
                        >
                          <Trophy
                            className={`h-12 w-12 ${
                              percentage >= 80
                                ? 'text-green-400'
                                : percentage >= 60
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          />
                        </motion.div>
                        <motion.h2
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl font-bold text-white mb-2"
                        >
                          {score} out of {questions.length} Correct!
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-muted-foreground mb-6"
                        >
                          {percentage >= 80
                            ? 'Excellent work! You have a strong understanding of the material.'
                            : percentage >= 60
                            ? 'Good effort! Review the questions below to improve.'
                            : 'Keep studying! Review the material and try again.'}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center gap-4"
                        >
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            className="rounded-xl gap-2"
                          >
                            Review Answers
                          </Button>
                          <Button
                            onClick={handleRegenerate}
                            className="gradient-primary hover:gradient-primary-hover text-white rounded-xl gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            New Quiz
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {!isLoading && questions.length > 0 && (
            <div className="space-y-4">
              {questions.map((q, qIndex) => {
                const isCorrect = answers[qIndex] === q.correctAnswer;

                return (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                  >
                    <Card
                      className={`glass-card border-0 shadow-glass transition-all ${
                        submitted
                          ? isCorrect
                            ? 'ring-2 ring-green-500/50 bg-green-500/5'
                            : 'ring-2 ring-red-500/50 bg-red-500/5'
                          : ''
                      }`}
                    >
                      <CardHeader className="border-b border-border">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                              submitted
                                ? isCorrect
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {submitted ? (
                              isCorrect ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <XCircle className="h-5 w-5" />
                              )
                            ) : (
                              <span className="text-sm">{qIndex + 1}</span>
                            )}
                          </div>
                          <CardTitle className="text-white text-lg font-medium leading-relaxed">
                            {q.question}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <RadioGroup
                          value={answers[qIndex]?.toString()}
                          onValueChange={(value) => handleAnswer(qIndex, value)}
                          className="space-y-3"
                          disabled={submitted}
                        >
                          {q.options.map((option, optIndex) => {
                            const isSelected = answers[qIndex] === optIndex;
                            const isCorrectOption = optIndex === q.correctAnswer;

                            return (
                              <label
                                key={optIndex}
                                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                                  submitted
                                    ? isCorrectOption
                                      ? 'bg-green-500/10 border border-green-500/30'
                                      : isSelected && !isCorrectOption
                                      ? 'bg-red-500/10 border border-red-500/30 opacity-50'
                                      : 'opacity-50'
                                    : isSelected
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
                                }`}
                              >
                                <RadioGroupItem
                                  value={optIndex.toString()}
                                  id={`q${qIndex}-${optIndex}`}
                                  className={`${
                                    submitted && (isCorrectOption || isSelected)
                                      ? isCorrectOption
                                        ? 'border-green-500 text-green-500'
                                        : 'border-red-500 text-red-500'
                                      : ''
                                  }`}
                                />
                                <Label
                                  htmlFor={`q${qIndex}-${optIndex}`}
                                  className={`flex-1 cursor-pointer ${
                                    submitted && isCorrectOption
                                      ? 'text-green-400 font-medium'
                                      : submitted && isSelected && !isCorrectOption
                                      ? 'text-red-400'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {option}
                                </Label>
                                {submitted && isCorrectOption && (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                )}
                                {submitted && isSelected && !isCorrectOption && (
                                  <XCircle className="h-5 w-5 text-red-400" />
                                )}
                              </label>
                            );
                          })}
                        </RadioGroup>
                        {submitted && !isCorrect && (
                          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-green-400">Correct Answer: </span>
                              {q.options[q.correctAnswer]}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && questions.length > 0 && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center justify-between"
            >
              <p className="text-sm text-muted-foreground">
                {Object.keys(answers).length} of {questions.length} questions answered
              </p>
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="gradient-primary hover:gradient-primary-hover text-white font-semibold px-8 rounded-xl disabled:opacity-50"
              >
                Submit Quiz
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
