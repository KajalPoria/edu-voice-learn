import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = "Sarah", model = "eleven_turbo_v2_5" } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    if (!text) {
      throw new Error("Text is required");
    }

    // Limit text length to prevent excessive credit usage (max 1000 characters)
    const truncatedText = text.length > 1000 
      ? text.substring(0, 1000) + "..." 
      : text;

    console.log(`Generating speech for ${truncatedText.length} characters with voice: ${voice}`);

    // Voice ID mapping
    const voiceIds: Record<string, string> = {
      "Aria": "9BWtsMINqrJLrRacOk9x",
      "Roger": "CwhRBWXzGAHq8TQ4Fs17",
      "Sarah": "EXAVITQu4vr4xnSDxMaL",
      "Laura": "FGY2WhTYpPnrIDTdsKH5",
      "Charlie": "IKne3meq5aSn9XLyUdCD",
      "George": "JBFqnCBsd6RMkjVDRZzb",
      "Callum": "N2lVS1w4EtoT3dr4eOWO",
      "River": "SAz9YHcvj6GT2YYXdXww",
      "Liam": "TX3LPaxmHKxFdv7VOQHJ",
      "Charlotte": "XB0fDUnXU5powFXDhCwa",
    };

    const voiceId = voiceIds[voice] || voiceIds["Sarah"];

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: truncatedText,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      
      // Handle specific error cases
      if (response.status === 401) {
        const errorData = JSON.parse(errorText);
        if (errorData.detail?.status === "quota_exceeded") {
          throw new Error("ElevenLabs quota exceeded. Please add credits to your account or try again later.");
        }
        throw new Error("Invalid ElevenLabs API key or authentication failed.");
      }
      
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Get the audio data as array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log("Speech generated successfully");

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in text-to-speech function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
