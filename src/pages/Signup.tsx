import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Navigate to dashboard
    navigate("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <CheckSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Taskora</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create your workspace</h1>
            <p className="mt-2 text-muted-foreground">
              Get started with your company management platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Workspace
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden bg-gradient-to-br from-accent to-accent/80 lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-lg text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-foreground/10">
            <CheckSquare className="h-10 w-10 text-accent-foreground" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-accent-foreground">
            Your All-in-One Solution
          </h2>
          <p className="text-accent-foreground/80">
            Create your workspace as a Super Admin and start inviting your team
            members. Full control, complete transparency.
          </p>
        </div>
      </div>
    </div>
  );
}
