import { Bell, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks, staff, files..."
          className="w-full pl-10"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/chat">
            <MessageCircle className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-success p-0 text-[10px] font-semibold">
              3
            </Badge>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to="/notifications">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-destructive p-0 text-[10px] font-semibold">
              5
            </Badge>
          </Link>
        </Button>
      </div>
    </header>
  );
}
