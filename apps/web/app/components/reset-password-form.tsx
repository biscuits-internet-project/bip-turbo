import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "~/components/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authInputClass } from "~/lib/form-styles";

type ResetPasswordFormProps = {
  className?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading?: boolean;
};

export function ResetPasswordForm({ className, onSubmit, isLoading = false, ...props }: ResetPasswordFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card variant="plain" className="relative border backdrop-blur-2xl transition-colors duration-300">
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-[inherit] shadow-2xl" />
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b opacity-50" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">Set new password</CardTitle>
          <CardDescription className="text-base text-content-text-secondary">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-text-secondary" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className={cn(authInputClass, "pl-9 placeholder:text-content-text-tertiary")}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-200">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-text-secondary" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className={cn(authInputClass, "pl-9 placeholder:text-content-text-tertiary")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                variant="outline"
                disabled={isLoading}
                className="w-full text-content-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update password"}
              </Button>
            </div>

            <div className="text-center text-sm text-content-text-secondary">
              Remember your password? <Link to="/auth/login">Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
