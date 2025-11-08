import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Trophy, RotateCcw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizInterfaceProps {
  studyMaterial: string;
  onClose: () => void;
}

export const QuizInterface = ({ studyMaterial, onClose }: QuizInterfaceProps) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { text: studyMaterial.substring(0, 8000), numQuestions: 5 },
      });

      if (error) throw error;

      setQuestions(data.questions);
      setAnsweredQuestions(new Array(data.questions.length).fill(false));
      toast.success("Quiz generated! Good luck! 🎯");
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      toast.error(error.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect && !answeredQuestions[currentQuestion]) {
      setScore(score + 1);
    }

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setQuizComplete(false);
  };

  if (questions.length === 0) {
    return (
      <Card className="border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            Ready to Test Your Knowledge?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate a personalized quiz based on your study material to reinforce learning!
          </p>
          <Button
            variant="hero"
            onClick={generateQuiz}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-8 h-8 text-success" />
            Quiz Complete! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-6xl font-bold text-success">{percentage}%</div>
            <p className="text-xl text-muted-foreground">
              You scored {score} out of {questions.length}
            </p>
          </div>

          <div className="space-y-2">
            <Progress value={percentage} className="h-3" />
          </div>

          <div className="flex gap-3">
            <Button variant="hero" onClick={restartQuiz} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
          <div className="text-sm font-semibold text-primary">
            Score: {score}/{questions.length}
          </div>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{question.question}</div>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showCorrect = showExplanation && isCorrectAnswer;
            const showWrong = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  showCorrect
                    ? "border-success bg-success/10"
                    : showWrong
                    ? "border-destructive bg-destructive/10"
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                } ${showExplanation ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-success" />}
                  {showWrong && <XCircle className="w-5 h-5 text-destructive" />}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div
            className={`p-4 rounded-lg border-2 ${
              isCorrect
                ? "border-success/50 bg-success/5"
                : "border-destructive/50 bg-destructive/5"
            } animate-fade-in`}
          >
            <div className="flex items-start gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  {isCorrect ? "Correct! 🎉" : "Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!showExplanation ? (
            <Button
              variant="hero"
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              Submit Answer
            </Button>
          ) : (
            <Button variant="hero" onClick={nextQuestion} className="flex-1">
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
