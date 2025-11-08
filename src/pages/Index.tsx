import { Button } from "@/components/ui/button";
import { Brain, Upload, Zap, BookOpen, Award, TrendingUp, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-3xl shadow-xl">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Learn Smarter with EduWhiz
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your 24/7 AI-powered study companion that transforms any document into interactive summaries, 
            personalized quizzes, and engaging conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg"
              onClick={() => navigate("/auth")}
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Excel
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40">
            <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Upload & Analysis</h3>
            <p className="text-muted-foreground">
              Upload any document and get instant AI-powered summaries, key points, and interactive mind maps.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary/20 hover:border-secondary/40">
            <div className="w-14 h-14 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Tutor Chat</h3>
            <p className="text-muted-foreground">
              Ask questions and get personalized explanations adapted to your learning style and knowledge level.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20 hover:border-accent/40">
            <div className="w-14 h-14 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Dynamic Quizzes</h3>
            <p className="text-muted-foreground">
              Auto-generated quizzes with instant feedback and detailed explanations for every answer.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 hover:border-primary/40">
            <div className="w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mb-4">
              <Mic className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Voice Learning</h3>
            <p className="text-muted-foreground">
              Listen to lessons with natural-sounding narration in multiple languages and voices.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary/20 hover:border-secondary/40">
            <div className="w-14 h-14 bg-gradient-to-r from-secondary to-primary rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your learning journey with detailed analytics and retention forecasts.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20 hover:border-accent/40">
            <div className="w-14 h-14 bg-gradient-to-r from-accent to-secondary rounded-xl flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Spaced Repetition</h3>
            <p className="text-muted-foreground">
              Smart scheduling of review sessions based on your performance for optimal retention.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students who are learning smarter, not harder.
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg"
            onClick={() => navigate("/auth")}
          >
            Start Learning Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Built for Hackathon 2025 by Kajal Poria</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
