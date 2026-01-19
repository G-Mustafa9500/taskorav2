import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock } from "lucide-react";

export default function Chat() {
  return (
    <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
      <Card className="max-w-md w-full border-border shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <Badge variant="secondary" className="mb-4">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Team Chat
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Real-time messaging with your team members is coming soon. 
            Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}