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
  onGoogleClick: () => void;
};

export function RegisterForm({ className, onSubmit, onGoogleClick, ...props }: RegisterFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative border border-brand/10 bg-content-bg/90 backdrop-blur-2xl transition-colors duration-300 hover:border-brand/30">
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-brand/10 via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-brand/5" />
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b from-brand/5 to-brand/0 opacity-50" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-content-text-primary">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-content-text-secondary">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-6">
            <Button 
              type="button" 
              onClick={onGoogleClick}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-label="Google Logo">
                <title>Google Logo</title>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-content-bg-secondary" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-content-text-tertiary">Or use email</span>
              </div>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-content-text-secondary">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-text-secondary" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      required
                      className="border-content-bg-secondary bg-black/50 pl-9 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
                    />
                  </div>
                </div>
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
                      className="border-content-bg-secondary bg-black/50 pl-9 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
                    Password
                  </Label>
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

              <Button type="submit" variant="outline" className="w-full text-content-text-secondary border-content-bg-secondary hover:bg-content-bg-secondary/50">
                Create account
              </Button>
            </form>
            
            <div className="text-center text-sm text-content-text-secondary">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-brand-secondary hover:text-hover-accent">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
