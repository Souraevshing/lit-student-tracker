"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChatBotProps {
  status: string | null;
}

export default function ChatBot({ status }: ChatBotProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `Welcome to LIT School! I'm your admission assistant. Your application status is: ${
        status || "Pending"
      }. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, status }),
      });

      if (!res.ok) {
        toast.error("Failed to get response from chatbot");
        throw new Error("Failed to get response from chatbot");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      toast.error("Error getting response. Please try again later");
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Error getting response. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-x-hidden">
      <CardHeader>
        <CardTitle>🤖 AI Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] rounded border border-border p-3 bg-muted/30 overflow-y-auto overflow-x-hidden">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="text-sm leading-snug space-y-1 break-words"
              >
                <div className="font-medium capitalize text-foreground">
                  {msg.role === "system"
                    ? "System"
                    : msg.role === "user"
                    ? "You"
                    : "Assistant"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="text-muted-foreground whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
                {i !== messages.length - 1 && <Separator />}
              </div>
            ))}
            {isLoading && (
              <div className="text-sm flex items-center text-muted-foreground">
                <LoadingSpinner />
                Assistant is typing...
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            variant="default"
            size="lg"
            className="sm:w-auto w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
