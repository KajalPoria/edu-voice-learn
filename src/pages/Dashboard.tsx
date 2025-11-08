import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Upload, LogOut, BookOpen, MessageSquare, Mic, Zap, Sparkles, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>

      <header className="relative border-b border-border/50 glass-morphism sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-md opacity-60"></div>
              <div className="relative bg-gradient-hero p-3 rounded-2xl shadow-glow">
                <Brain className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold gradient-text">
                EduWhiz
              </h1>
              <p className="text-xs text-muted-foreground">AI Learning Platform</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full mb-4 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Welcome Back!</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-3">
            Ready to <span className="gradient-text">Learn</span> Today?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your learning path and let AI supercharge your studies
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Upload,
              title: "Upload & Study",
              description: "Add new materials and get AI summaries",
              gradient: "from-primary to-primary-glow",
              action: () => navigate("/upload"),
              buttonText: "Upload Now",
              delay: "0s"
            },
            {
              icon: MessageSquare,
              title: "AI Tutor Chat",
              description: "Get instant help from your AI assistant",
              gradient: "from-secondary to-accent",
              action: () => navigate("/dashboard"),
              buttonText: "Start Chat",
              delay: "0.1s"
            },
            {
              icon: Mic,
              title: "Voice Tutor",
              description: "Learn with voice-powered conversations",
              gradient: "from-accent to-primary",
              action: () => navigate("/voice-tutor"),
              buttonText: "Start Voice",
              delay: "0.2s"
            },
            {
              icon: Zap,
              title: "Practice Quiz",
              description: "Test your knowledge with AI quizzes",
              gradient: "from-primary to-secondary",
              action: () => navigate("/quiz"),
              buttonText: "Take Quiz",
              delay: "0.3s"
            }
          ].map((item, index) => (
            <Card 
              key={index}
              className="group interactive-card glass-morphism border-border/50 hover-lift animate-slide-up"
              style={{animationDelay: item.delay}}
            >
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-medium group-hover:shadow-glow transition-all duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-heading">{item.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className={`w-full bg-gradient-to-r ${item.gradient} hover:shadow-glow transition-all duration-300`}
                  onClick={item.action}
                >
                  {item.buttonText}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <Card className="glass-morphism border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Study Streak</p>
                  <p className="text-2xl font-heading font-bold">7 Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <p className="text-2xl font-heading font-bold">12 Docs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quiz Score</p>
                  <p className="text-2xl font-heading font-bold">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass-morphism border-border/50 animate-fade-in" style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Recent Activity</CardTitle>
            <CardDescription>Your latest learning sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Completed Physics Quiz", time: "2 hours ago", icon: Zap, color: "primary" },
                { title: "Studied Quantum Mechanics Summary", time: "5 hours ago", icon: BookOpen, color: "secondary" },
                { title: "Voice Chat with AI Tutor", time: "Yesterday", icon: Mic, color: "accent" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className={`w-10 h-10 bg-gradient-to-br from-${activity.color} to-${activity.color}-glow rounded-lg flex items-center justify-center`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
