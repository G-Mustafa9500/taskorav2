import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Users,
  Clock,
  FolderOpen,
  MessageCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Trello-like kanban boards with drag & drop functionality",
  },
  {
    icon: Users,
    title: "Staff Management",
    description: "Manage your team with detailed profiles and role assignments",
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "Automatic attendance logging on daily login",
  },
  {
    icon: FolderOpen,
    title: "File Management",
    description: "Secure file uploads linked to tasks and staff",
  },
  {
    icon: MessageCircle,
    title: "Team Chat",
    description: "Real-time internal communication for your team",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visual insights into team productivity and progress",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "10K+", label: "Companies" },
  { value: "500K+", label: "Tasks Completed" },
  { value: "24/7", label: "Support" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Taskora</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              <span>The #1 Company Management Platform</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Manage Your Team
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Taskora combines task management, staff tracking, attendance, and
              communication in one beautiful, intuitive platform. Built for
              modern teams.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground">
              Powerful features designed to streamline your workflow and boost
              team productivity.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            <div className="relative">
              <Shield className="mx-auto mb-4 h-12 w-12 text-primary-foreground/80" />
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
                Ready to Transform Your Workflow?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
                Join thousands of companies already using Taskora to manage
                their teams more effectively.
              </p>
              <Button
                size="xl"
                className="bg-card text-primary hover:bg-card/90"
                asChild
              >
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <CheckSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Taskora</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Taskora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
