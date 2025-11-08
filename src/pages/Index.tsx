import { Button } from "@/components/ui/button";
import { Brain, Upload, Zap, BookOpen, Award, TrendingUp, Mic, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

      {/* Hero Section */}
      <section className="container relative mx-auto px-4 pt-20 pb-32 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-xl opacity-60 animate-glow-pulse"></div>
              <div className="relative bg-gradient-hero p-8 rounded-3xl shadow-glow">
                <Brain className="w-20 h-20 text-white animate-float" />
              </div>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full mb-6 animate-fade-in border border-primary/20">
            <Star className="w-4 h-4 fill-primary" />
            <span className="text-sm font-medium">AI-Powered Learning Revolution</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 animate-slide-up">
            <span className="gradient-text">Learn Smarter</span>
            <br />
            <span className="text-foreground">with EduWhiz</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            Transform any document into interactive summaries, master concepts with AI-powered quizzes, 
            and get personalized tutoring 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button 
              size="lg"
              className="text-lg px-10 py-7 bg-gradient-hero hover:shadow-glow transition-all duration-300 hover:scale-105 font-semibold group"
              onClick={() => navigate("/auth")}
            >
              Get Started Free
              <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-10 py-7 border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300 font-semibold"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container relative mx-auto px-4 py-24">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Everything You Need to <span className="gradient-text">Excel</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to accelerate your learning journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: Upload,
              title: "Smart Upload & Analysis",
              description: "Upload any document and get instant AI-powered summaries with key insights and mind maps.",
              gradient: "from-primary to-primary-glow",
              delay: "0s"
            },
            {
              icon: Brain,
              title: "AI Tutor Chat",
              description: "Get personalized explanations adapted to your learning style with voice-enabled conversations.",
              gradient: "from-secondary to-accent",
              delay: "0.1s"
            },
            {
              icon: Zap,
              title: "Dynamic Quizzes",
              description: "Auto-generated quizzes with instant feedback and detailed explanations for mastery.",
              gradient: "from-accent to-primary",
              delay: "0.2s"
            },
            {
              icon: Mic,
              title: "Voice Learning",
              description: "Listen to lessons with natural AI narration in multiple voices and languages.",
              gradient: "from-primary to-secondary",
              delay: "0.3s"
            },
            {
              icon: TrendingUp,
              title: "Progress Tracking",
              description: "Monitor your learning journey with detailed analytics and performance insights.",
              gradient: "from-secondary to-primary",
              delay: "0.4s"
            },
            {
              icon: Award,
              title: "Spaced Repetition",
              description: "Smart review scheduling based on your performance for optimal knowledge retention.",
              gradient: "from-accent to-secondary",
              delay: "0.5s"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group interactive-card glass-morphism rounded-3xl p-8 shadow-soft hover-lift border border-border/50"
              style={{animationDelay: feature.delay}}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-medium group-hover:shadow-glow transition-all duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container relative mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative glass-morphism rounded-[2rem] p-16 border border-border/50 shadow-float overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-5 animate-gradient"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full mb-6 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Join Thousands of Students</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Ready to <span className="gradient-text">Transform</span> Your Learning?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Start your journey to smarter, more efficient learning today. No credit card required.
              </p>
              <Button 
                size="lg"
                className="text-lg px-12 py-7 bg-gradient-hero hover:shadow-glow transition-all duration-300 hover:scale-105 font-semibold"
                onClick={() => navigate("/auth")}
              >
                Start Learning Free
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-hero p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-semibold text-xl">EduWhiz</span>
            </div>
            <p className="text-muted-foreground">
              Built with ❤️ for Hackathon 2025 by <span className="font-semibold text-foreground">Kajal Poria</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
