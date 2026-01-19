import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, HelpCircle, FileText, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
}

const quickActions = [
  { icon: HelpCircle, label: "How to use Taskora?", query: "How do I use Taskora?" },
  { icon: FileText, label: "Create a task", query: "How do I create a new task?" },
  { icon: Users, label: "Manage team", query: "How do I manage my team members?" },
  { icon: Clock, label: "Track attendance", query: "How does attendance tracking work?" },
];

const botResponses: Record<string, string> = {
  default: "I'm your Taskora AI Assistant! I can help you navigate the system, explain features, and answer questions about task management. What would you like to know?",
  "how do i use taskora": "Taskora is a comprehensive company management system. Here's how to get started:\n\n1. **Dashboard** - View your overview, tasks, and team updates\n2. **Tasks** - Create, assign, and track tasks\n3. **Staff** - Manage team members (Admin/Manager only)\n4. **Attendance** - Track daily attendance\n5. **Files** - Upload and share documents\n6. **Whiteboard** - Collaborate visually\n\nNeed help with something specific?",
  "how do i create a new task": "To create a new task:\n\n1. Go to the **Tasks** page from the sidebar\n2. Click the **Add Task** button\n3. Fill in the task details:\n   - Title\n   - Description\n   - Priority (Low, Medium, High)\n   - Due date\n   - Assignee\n4. Click **Create Task**\n\nYou can also assign tasks to team members and set deadlines!",
  "how do i manage my team members": "Team management is available for Super Admins and Managers:\n\n1. Go to **Staff** page from the sidebar\n2. Here you can:\n   - View all team members\n   - Add new staff using the **Add Staff** button\n   - Remove team members\n   - View member details\n\nYou can also manage team settings from **Settings > Team**.",
  "how does attendance tracking work": "Attendance tracking in Taskora:\n\n1. Go to the **Attendance** page\n2. Staff can check in/out daily\n3. Managers can:\n   - View team attendance\n   - See attendance reports\n   - Track working hours\n4. Super Admins have access to all attendance data\n\nAttendance is recorded automatically with timestamps.",
};

export default function AIAssistant() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "👋 Hello! I'm Taskora AI, your helpful assistant. I can help you understand how to use Taskora, explain features, and answer your questions. How can I assist you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        return response;
      }
    }
    
    if (lowerQuery.includes("task")) {
      return botResponses["how do i create a new task"];
    }
    if (lowerQuery.includes("team") || lowerQuery.includes("staff") || lowerQuery.includes("member")) {
      return botResponses["how do i manage my team members"];
    }
    if (lowerQuery.includes("attendance") || lowerQuery.includes("check in")) {
      return botResponses["how does attendance tracking work"];
    }
    if (lowerQuery.includes("help") || lowerQuery.includes("how") || lowerQuery.includes("what")) {
      return botResponses["how do i use taskora"];
    }
    
    return "I understand you're asking about: \"" + query + "\". I'm here to help with Taskora-related questions like:\n\n• How to use different features\n• Managing tasks and teams\n• Attendance tracking\n• File management\n• And more!\n\nCould you please rephrase your question or choose from the quick actions below?";
  };

  const handleSend = async (query?: string) => {
    const messageContent = query || input;
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: getBotResponse(messageContent),
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
          <Bot className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            AI Assistant
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Your helpful guide to using Taskora
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Quick Actions */}
        <Card className="border-border shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-2 h-auto py-3"
                onClick={() => handleSend(action.query)}
              >
                <action.icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-left text-sm">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col border-border shadow-sm lg:col-span-3 h-[calc(100vh-16rem)]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={
                        message.isBot
                          ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }
                    >
                      {message.isBot ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        getInitials(profile?.full_name || "You")
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.isBot
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.isBot
                          ? "text-muted-foreground"
                          : "text-primary-foreground/70"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask me anything about Taskora..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-center text-muted-foreground">
              AI Assistant helps with Taskora features only. For complex queries, contact support.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}