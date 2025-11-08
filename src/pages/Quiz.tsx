import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Trophy, Sparkles, LogOut, ArrowLeft, Zap, Target, Star } from "lucide-react";
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

    setStudyMaterial(`Generate a comprehensive quiz about: ${topic}. 
    
This quiz should test key concepts, facts, and understanding of ${topic}. 
Include questions that cover fundamentals, applications, and advanced concepts where applicable.`);
    
    setShowQuiz(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>

      <header className="relative border-b border-border/50 glass-morphism sticky top-0 z-50 transition-colors duration-500">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-accent rounded-2xl blur-md opacity-60"></div>
                <div className="relative bg-gradient-accent p-3 rounded-2xl shadow-glow">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold gradient-text">
                  Quiz Master
                </h1>
                <p className="text-xs text-muted-foreground">AI Quiz Generator</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 max-w-6xl">
        {!showQuiz ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-accent rounded-3xl blur-xl opacity-60 animate-glow-pulse"></div>
                  <div className="relative bg-gradient-accent p-8 rounded-3xl shadow-glow">
                    <Trophy className="w-16 h-16 text-white animate-float" />
                  </div>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-5 py-2 rounded-full mb-6 border border-accent/20">
                <Star className="w-4 h-4 fill-accent" />
                <span className="text-sm font-medium">Personalized Learning</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Generate Your <span className="gradient-text">Custom Quiz</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Enter any topic and our AI will create a personalized 5-question quiz with instant feedback and detailed explanations.
              </p>
            </div>

            {/* Quiz Input Card */}
            <Card className="glass-morphism border-border/50 shadow-float animate-slide-up">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-heading">Choose Your Topic</CardTitle>
                <CardDescription className="text-base">
                  World War 2, Python Programming, Biology, Quantum Physics...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter your topic here..."
                    className="h-16 text-lg px-6 border-2 focus:border-primary transition-all"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleGenerateQuiz();
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={handleGenerateQuiz}
                  disabled={!topic.trim()}
                  className="w-full h-16 text-lg bg-gradient-accent hover:shadow-glow transition-all duration-300 hover:scale-105 font-semibold"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Quiz
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              {[
                {
                  icon: Trophy,
                  title: "Instant Feedback",
                  description: "Get immediate explanations for each answer with detailed insights",
                  gradient: "from-primary to-primary-glow",
                },
                {
                  icon: Sparkles,
                  title: "Any Topic",
                  description: "Generate quizzes on any subject you're studying, anywhere",
                  gradient: "from-secondary to-accent",
                },
                {
                  icon: Target,
                  title: "AI-Powered",
                  description: "Smart questions that adapt to your learning needs",
                  gradient: "from-accent to-primary",
                }
              ].map((feature, index) => (
                <Card key={index} className="group interactive-card glass-morphism border-border/50 hover-lift">
                  <CardHeader>
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-glow transition-all duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
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
