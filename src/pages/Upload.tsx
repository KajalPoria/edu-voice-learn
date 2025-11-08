import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Upload as UploadIcon, FileText, Loader2, ArrowLeft, MessageSquare, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VoiceSelector } from "@/components/VoiceSelector";
import { QuizInterface } from "@/components/QuizInterface";
import { AITutorChat } from "@/components/AITutorChat";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/10">
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary to-secondary p-2.5 rounded-xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Study Assistant
              </h1>
              <p className="text-xs text-muted-foreground">Upload, Learn, Excel</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">Transform Your Learning</h2>
          <p className="text-muted-foreground">
            Upload documents to get AI summaries, practice with quizzes, or chat with your tutor
          </p>
        </div>

        <Card className="mb-6 border-primary/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5 text-primary" />
              Upload Study Material
            </CardTitle>
            <CardDescription>
              Support for PDF, DOCX, and TXT files (max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                disabled={loading}
                className="flex-1"
              />
            </div>

            {file && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-muted to-muted/50 rounded-lg border border-primary/20 animate-fade-in">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-secondary">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="hero"
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full text-lg h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {summary && (
          <Card className="border-accent/20 shadow-2xl animate-fade-in">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="bg-gradient-to-r from-accent/10 via-primary/5 to-secondary/5">
                <TabsList className="grid w-full grid-cols-3 bg-background/50">
                  <TabsTrigger value="summary" className="gap-2">
                    <Brain className="w-4 h-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="gap-2">
                    <Trophy className="w-4 h-4" />
                    Quiz
                  </TabsTrigger>
                  <TabsTrigger value="tutor" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    AI Tutor
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                <TabsContent value="summary" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">AI-Generated Summary</h3>
                    <VoiceSelector value={selectedVoice} onChange={setSelectedVoice} />
                  </div>
                  
                  <div className="prose prose-sm max-w-none p-6 bg-gradient-to-br from-muted/50 to-transparent rounded-xl border border-border">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
                  </div>
                  
                  <AudioPlayer text={summary} voice={selectedVoice} />
                </TabsContent>

                <TabsContent value="quiz" className="mt-0">
                  <QuizInterface 
                    studyMaterial={originalContent || summary} 
                    onClose={() => setActiveTab("summary")}
                  />
                </TabsContent>

                <TabsContent value="tutor" className="mt-0">
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
