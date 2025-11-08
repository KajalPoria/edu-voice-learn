import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Trophy, Sparkles, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuizInterface } from "@/components/QuizInterface";

const Quiz = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [studyMaterial, setStudyMaterial] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleGenerateQuiz = () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    // Create study material from topic for AI to generate quiz
    setStudyMaterial(`Generate a comprehensive quiz about: ${topic}. 
    
This quiz should test key concepts, facts, and understanding of ${topic}. 
Include questions that cover fundamentals, applications, and advanced concepts where applicable.`);
    
    setShowQuiz(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-secondary/10">
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary to-secondary p-2.5 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  EduWhiz
                </h1>
                <p className="text-xs text-muted-foreground">Quiz Generator</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {!showQuiz ? (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-secondary to-accent rounded-2xl shadow-xl">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-3">Generate Your Custom Quiz</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enter a topic and our AI will create a personalized 5-question quiz with instant feedback and explanations.
              </p>
            </div>

            <Card className="border-secondary/20 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-secondary/10 via-primary/5 to-accent/5 text-center">
                <CardTitle className="text-2xl">Quiz Topic</CardTitle>
                <CardDescription>
                  e.g., World War 2, Python Programming, Biology...
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter your topic here..."
                  className="h-14 text-lg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleGenerateQuiz();
                    }
                  }}
                />

                <Button
                  variant="hero"
                  onClick={handleGenerateQuiz}
                  disabled={!topic.trim()}
                  className="w-full h-14 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Quiz
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-2">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Instant Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get immediate explanations for each answer
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Any Topic</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate quizzes on any subject you're studying
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mb-2">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">AI-Powered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Questions adapt to your learning needs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <QuizInterface
              studyMaterial={studyMaterial}
              onClose={() => {
                setShowQuiz(false);
                setTopic("");
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
