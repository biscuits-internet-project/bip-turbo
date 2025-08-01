import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "~/components/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type ForgotPasswordFormProps = {
  className?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function ForgotPasswordForm({ className, onSubmit, ...props }: ForgotPasswordFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative border-none bg-content-bg/90 backdrop-blur-2xl before:pointer-events-none before:absolute before:-inset-1 before:rounded-[inherit] before:border before:border-brand/20 before:opacity-0 before:transition before:duration-300 hover:before:opacity-100">
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-brand/10 via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-brand/5" />
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b from-brand/5 to-brand/0 opacity-50" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">Reset password</CardTitle>
          <CardDescription className="text-base text-content-text-secondary">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-200">
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
                    className="border-zinc-800 bg-black/50 pl-9 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full bg-brand text-white hover:bg-hover-accent">
                Send reset link
              </Button>
            </div>

            <div className="text-center text-sm text-content-text-secondary">
              Remember your password?{" "}
              <Link to="/auth/login" className="text-brand hover:text-hover-accent">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
