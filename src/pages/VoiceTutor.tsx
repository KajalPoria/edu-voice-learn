import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Mic, MicOff, Volume2, VolumeX, Send, Loader2, LogOut, ArrowLeft, Sparkles, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const VoiceTutor = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [motivationMode, setMotivationMode] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Sarah");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize user and load or create conversation
  useEffect(() => {
    const initializeChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to use Voice Tutor");
        navigate("/auth");
        return;
      }
      setUserId(user.id);

      // Load existing conversation or create new one
      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      let currentConversationId: string;

      if (conversations && conversations.length > 0) {
        // Load existing conversation
        currentConversationId = conversations[0].id;
        setConversationId(currentConversationId);

        // Load messages
        const { data: chatMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', currentConversationId)
          .order('created_at', { ascending: true });

        if (chatMessages && chatMessages.length > 0) {
          setMessages(chatMessages.map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content
          })));
        } else {
          // Set initial message if no messages exist
          setMessages([{
            role: "assistant",
            content: "Hello! I'm EduWhiz, your AI study companion. Ask me anything about your lessons, and I'll help you understand better. You can type or use voice!",
          }]);
        }
      } else {
        // Create new conversation
        const { data: newConversation } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: 'Voice Tutor Chat'
          })
          .select()
          .single();

        if (newConversation) {
          currentConversationId = newConversation.id;
          setConversationId(currentConversationId);
          
          const initialMessage = {
            role: "assistant" as const,
            content: "Hello! I'm EduWhiz, your AI study companion. Ask me anything about your lessons, and I'll help you understand better. You can type or use voice!",
          };
          
          setMessages([initialMessage]);
          
          // Save initial message
          await supabase.from('chat_messages').insert({
            conversation_id: currentConversationId,
            user_id: user.id,
            role: initialMessage.role,
            content: initialMessage.content
          });
        }
      }
    };

    initializeChat();
  }, [navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition error");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      toast.info("Listening...");
    }
  };

  const speakText = async (text: string) => {
    if (!voiceEnabled) return;

    try {
      console.log("Attempting to generate speech...");
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text: text.substring(0, 1000), voice: selectedVoice },
      });

      if (error) {
        console.error("TTS error:", error);
        toast.error(error.message || "Failed to generate speech");
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error("No audio content received");
      }

      console.log("Speech generated, playing audio...");
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audio.play().catch(e => {
        console.error("Audio playback error:", e);
        toast.error("Failed to play audio");
      });
      
      audio.onended = () => URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error speaking:", error);
      if (!error.message?.includes("Failed to generate speech")) {
        toast.error("Voice playback failed. Please check your connection.");
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !conversationId || !userId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        user_id: userId,
        role: userMessage.role,
        content: userMessage.content
      });

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      const systemContext = motivationMode
        ? "You are an enthusiastic, motivating AI tutor. Be encouraging and positive!"
        : "";

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            context: systemContext,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (let line of lines) {
          if (line.startsWith(":")) continue;
          if (!line.trim() || !line.startsWith("data: ")) continue;

          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      // Speak the response if voice is enabled
      if (voiceEnabled && assistantMessage) {
        speakText(assistantMessage);
      }

      // Save assistant message to database
      if (assistantMessage && conversationId && userId) {
        await supabase.from('chat_messages').insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'assistant',
          content: assistantMessage
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>

      <header className="relative border-b border-border/50 glass-morphism sticky top-0 z-50 transition-colors duration-500">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-md opacity-60"></div>
                <div className="relative bg-gradient-hero p-3 rounded-2xl shadow-glow">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold gradient-text">
                  Voice Tutor
                </h1>
                <p className="text-xs text-muted-foreground">AI Voice Assistant</p>
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

      <main className="relative container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full mb-4 border border-primary/20">
            <Star className="w-4 h-4 fill-primary" />
            <span className="text-sm font-medium">AI-Powered Voice Learning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            Learn with <span className="gradient-text">Voice</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ask questions via voice or text and get instant AI-powered explanations with natural speech
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-slide-up">
            <Card className="h-[600px] flex flex-col glass-morphism border-border/50 shadow-float">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5 flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-heading">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  Conversation
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={voiceEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-accent to-secondary text-white"
                              : "bg-muted text-foreground border border-border"
                          } animate-fade-in`}
                        >
                          {message.role === "assistant" && message.content === "" ? (
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 animate-pulse" />
                              <span className="text-sm">Thinking...</span>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                  <div className="flex gap-2">
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                      onClick={toggleListening}
                      disabled={isLoading}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="bg-gradient-to-r from-accent to-secondary hover:opacity-90"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 animate-slide-in-right">
            <Card className="glass-morphism border-border/50">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="motivation" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Motivation Mode
                  </Label>
                  <Switch
                    id="motivation"
                    checked={motivationMode}
                    onCheckedChange={setMotivationMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voice-select" className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Tutor Voice
                  </Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger id="voice-select">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah">Sarah (Default)</SelectItem>
                      <SelectItem value="Aria">Aria</SelectItem>
                      <SelectItem value="Roger">Roger</SelectItem>
                      <SelectItem value="Laura">Laura</SelectItem>
                      <SelectItem value="Charlie">Charlie</SelectItem>
                      <SelectItem value="George">George</SelectItem>
                      <SelectItem value="Callum">Callum</SelectItem>
                      <SelectItem value="River">River</SelectItem>
                      <SelectItem value="Liam">Liam</SelectItem>
                      <SelectItem value="Charlotte">Charlotte</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred tutor voice
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                  <p>Type or speak your questions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                  <p>Get instant AI explanations</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                  <p>Listen to voice responses</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5" />
                  <p>Enable motivation mode</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Voice Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>Natural AI voices</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>Real-time responses</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>ElevenLabs powered</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                  <p>Clear pronunciation</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Be specific with questions</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Toggle voice on/off</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Ask for examples</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <p>Request clarifications</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoiceTutor;
