import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "The designs are ready for review",
    time: "2 min",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "MC",
    lastMessage: "I'll push the changes tonight",
    time: "15 min",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "EW",
    lastMessage: "Can you review my PR?",
    time: "1 hour",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Alex Kumar",
    avatar: "AK",
    lastMessage: "Meeting at 3 PM",
    time: "2 hours",
    unread: 0,
    online: true,
  },
  {
    id: "5",
    name: "Lisa Park",
    avatar: "LP",
    lastMessage: "Thanks for the update!",
    time: "1 day",
    unread: 0,
    online: false,
  },
];

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah Johnson",
    senderAvatar: "SJ",
    content: "Hey! I just finished the new homepage designs. Would you mind taking a look?",
    timestamp: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    sender: "You",
    senderAvatar: "JD",
    content: "Of course! I'll check them out right now.",
    timestamp: "10:32 AM",
    isMe: true,
  },
  {
    id: "3",
    sender: "Sarah Johnson",
    senderAvatar: "SJ",
    content: "Great! I've uploaded them to the Files section. Let me know if you need any changes.",
    timestamp: "10:33 AM",
    isMe: false,
  },
  {
    id: "4",
    sender: "You",
    senderAvatar: "JD",
    content: "The designs look amazing! I love the color scheme and layout. Just a few minor tweaks needed on the footer section.",
    timestamp: "10:45 AM",
    isMe: true,
  },
  {
    id: "5",
    sender: "Sarah Johnson",
    senderAvatar: "SJ",
    content: "Thanks! I'll work on those changes right away. Should be done by EOD.",
    timestamp: "10:47 AM",
    isMe: false,
  },
  {
    id: "6",
    sender: "Sarah Johnson",
    senderAvatar: "SJ",
    content: "The designs are ready for review",
    timestamp: "11:30 AM",
    isMe: false,
  },
];

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      senderAvatar: "JD",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      {/* Conversations List */}
      <Card className="w-80 shrink-0 border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Messages</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="space-y-1 p-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                    selectedConversation?.id === conv.id
                      ? "bg-primary/10"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium text-foreground">
                        {conv.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {conv.time}
                      </span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      {conv.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex flex-1 flex-col border-border shadow-sm">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedConversation?.avatar}
                </AvatarFallback>
              </Avatar>
              {selectedConversation?.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {selectedConversation?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedConversation?.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isMe ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {message.senderAvatar}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      message.isMe
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
