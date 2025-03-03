import { Github, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "~/components/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type RegisterFormProps = {
  className?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function RegisterForm({ className, onSubmit, ...props }: RegisterFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative border-none bg-zinc-900/90 backdrop-blur-2xl before:pointer-events-none before:absolute before:-inset-1 before:rounded-[inherit] before:border before:border-purple-500/20 before:opacity-0 before:transition before:duration-300 hover:before:opacity-100">
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-purple-500/5" />
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b from-purple-500/5 to-purple-500/0 opacity-50" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">Create an account</CardTitle>
          <CardDescription className="text-base text-zinc-400">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-zinc-200">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    required
                    className="border-zinc-800 bg-black/50 pl-9 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="border-zinc-800 bg-black/50 pl-9 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="border-zinc-800 bg-black/50 pl-9 text-zinc-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full bg-purple-500 text-white hover:bg-purple-600">
                Create account
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                type="button"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-purple-400 hover:text-purple-300">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
