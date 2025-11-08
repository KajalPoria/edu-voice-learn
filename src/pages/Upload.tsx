import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Upload as UploadIcon, FileText, Loader2, ArrowLeft, MessageSquare, Trophy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VoiceSelector } from "@/components/VoiceSelector";
import { QuizInterface } from "@/components/QuizInterface";
import { AITutorChat } from "@/components/AITutorChat";
import { ThemeToggle } from "@/components/ThemeToggle";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("Sarah");
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [originalContent, setOriginalContent] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSummary("");
      setOriginalContent("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      setOriginalContent(text);
      
      const { data, error } = await supabase.functions.invoke("generate-summary", {
        body: { text: text.substring(0, 10000) },
      });

      if (error) throw error;

      setSummary(data.summary);
      setActiveTab("summary");
      toast.success("Summary generated successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <header className="border-b border-border/50 glass-morphism sticky top-0 z-10 transition-colors duration-500">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} size="icon" className="hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <div className="bg-gradient-to-br from-primary via-secondary to-accent p-2.5 rounded-xl shadow-glow animate-glow-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold gradient-text">
                  Study Assistant
                </h1>
                <p className="text-xs text-muted-foreground">Upload, Learn, Excel</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-4xl font-heading font-bold mb-3 gradient-text">Transform Your Learning</h2>
          <p className="text-muted-foreground text-lg">
            Upload documents to get AI summaries, practice with quizzes, or chat with your tutor
          </p>
        </div>

        <Card className="mb-6 interactive-card border-primary/20 shadow-float animate-slide-up">
          <CardHeader className="bg-gradient-card">
            <CardTitle className="flex items-center gap-2 text-2xl font-heading">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
                <UploadIcon className="w-5 h-5 text-white" />
              </div>
              Upload Study Material
            </CardTitle>
            <CardDescription className="text-base">
              Support for PDF, DOCX, and TXT files (max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                disabled={loading}
                className="flex-1 h-12 border-2 border-primary/20 focus:border-primary/50 transition-all duration-300"
              />
            </div>

            {file && (
              <div className="flex items-center gap-4 p-5 glass-morphism rounded-xl border border-primary/30 animate-scale-in hover-lift">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-glow animate-glow-pulse">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{file.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    {(file.size / 1024).toFixed(2)} KB • Ready to analyze
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="hero"
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full text-lg h-14 shadow-glow hover:shadow-float transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {summary && (
          <Card className="interactive-card border-accent/30 shadow-float animate-fade-in">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="bg-gradient-card">
                <TabsList className="grid w-full grid-cols-3 glass-morphism h-14">
                  <TabsTrigger value="summary" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all duration-300">
                    <Brain className="w-5 h-5" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all duration-300">
                    <Trophy className="w-5 h-5" />
                    Quiz
                  </TabsTrigger>
                  <TabsTrigger value="tutor" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white transition-all duration-300">
                    <MessageSquare className="w-5 h-5" />
                    AI Tutor
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                <TabsContent value="summary" className="space-y-6 mt-0 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-heading font-bold gradient-text">AI-Generated Summary</h3>
                    <VoiceSelector value={selectedVoice} onChange={setSelectedVoice} />
                  </div>
                  
                  <div className="prose prose-sm max-w-none p-8 glass-morphism rounded-2xl border border-primary/20 hover-lift">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">{summary}</p>
                  </div>
                  
                  <AudioPlayer text={summary} voice={selectedVoice} />
                </TabsContent>

                <TabsContent value="quiz" className="mt-0 animate-fade-in">
                  <QuizInterface 
                    studyMaterial={originalContent || summary} 
                    onClose={() => setActiveTab("summary")}
                  />
                </TabsContent>

                <TabsContent value="tutor" className="mt-0 animate-fade-in">
                  <AITutorChat studyContext={originalContent || summary} />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Upload;
