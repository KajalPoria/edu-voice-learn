import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic } from "lucide-react";

interface VoiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const voices = [
  { id: "Sarah", name: "Sarah (Female)" },
  { id: "Aria", name: "Aria (Female)" },
  { id: "Laura", name: "Laura (Female)" },
  { id: "Charlotte", name: "Charlotte (Female)" },
  { id: "Roger", name: "Roger (Male)" },
  { id: "Charlie", name: "Charlie (Male)" },
  { id: "George", name: "George (Male)" },
  { id: "Callum", name: "Callum (Male)" },
  { id: "Liam", name: "Liam (Male)" },
  { id: "River", name: "River (Neutral)" },
];

export const VoiceSelector = ({ value, onChange }: VoiceSelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      <Mic className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
