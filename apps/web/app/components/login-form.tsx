import { Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "~/components/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type LoginFormProps = {
  className?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onGoogleClick: () => void;
};

export function LoginForm({ className, onSubmit, onGoogleClick, ...props }: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative border-none bg-content-bg/90 backdrop-blur-2xl before:pointer-events-none before:absolute before:-inset-1 before:rounded-[inherit] before:border before:border-brand/20 before:opacity-0 before:transition before:duration-300 hover:before:opacity-100">
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-brand/10 via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-brand/5" />
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b from-brand/5 to-brand/0 opacity-50" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-content-text-primary">Welcome back</CardTitle>
          <CardDescription className="text-base text-content-text-secondary">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-content-text-secondary">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-text-secondary" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="border-content-bg-secondary bg-black/50 pl-9 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-brand-secondary hover:text-hover-accent">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-text-secondary" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="border-content-bg-secondary bg-black/50 pl-9 text-content-text-secondary focus:border-focus-ring focus:ring-focus-ring/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full bg-brand-primary text-content-text-primary hover:bg-hover-accent">
                Sign in
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-content-bg-secondary" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-content-text-tertiary">Or continue with</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-content-bg-secondary bg-transparent text-content-text-secondary hover:bg-content-bg-secondary hover:text-content-text-primary"
                type="button"
                onClick={onGoogleClick}
              >
                Google
              </Button>
            </div>

            <div className="text-center text-sm text-content-text-secondary">
              Don&apos;t have an account?{" "}
              <Link to="/auth/register" className="text-brand-secondary hover:text-hover-accent">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
