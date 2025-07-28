import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { Form, useLoaderData, useNavigation } from "react-router-dom";
import { ArrowLeft, Upload, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { protectedLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";
import type { User } from "@bip/domain";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit Profile | Biscuits Internet Project" },
    { name: "description", content: "Edit your user profile and settings" },
  ];
};

export const loader = protectedLoader(async ({ context }): Promise<{ user: User }> => {
  const user = await services.users.find(context.currentUser.id);
  
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  
  return { user };
});

export default function ProfileEdit() {
  const data = useLoaderData() as { user: User };
  const { user } = data;
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const response = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setAvatarPreview(url || null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to={`/users/${user.username}`}
          className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to profile</span>
        </Link>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-content-text-primary">Edit Profile</h1>
        <p className="text-content-text-secondary">Update your profile information and settings</p>
      </div>

      {/* Profile Form */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-content-text-primary">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="space-y-4">
              <Label htmlFor="avatarUrl" className="text-content-text-primary font-medium">
                Profile Picture
              </Label>
              
              <div className="flex items-start gap-6">
                {/* Avatar Preview */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-glass-bg border-2 border-glass-border flex items-center justify-center">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                        onError={() => setAvatarPreview(null)}
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 text-content-text-tertiary" />
                    )}
                  </div>
                </div>

                {/* Avatar URL Input */}
                <div className="flex-1 space-y-2">
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    defaultValue={user.avatarUrl || ""}
                    onChange={handleAvatarChange}
                    className="bg-glass-bg border-glass-border text-content-text-primary placeholder:text-content-text-tertiary"
                  />
                  <p className="text-sm text-content-text-tertiary">
                    Enter a URL to an image file. Leave blank to use default avatar.
                  </p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-content-text-primary font-medium">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={50}
                defaultValue={user.username}
                className="bg-glass-bg border-glass-border text-content-text-primary placeholder:text-content-text-tertiary"
                placeholder="Enter your username"
              />
              <p className="text-sm text-content-text-tertiary">
                Your username will be used in your profile URL: /users/{user.username}
              </p>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-content-text-primary font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-glass-bg/50 border-glass-border text-content-text-secondary cursor-not-allowed"
              />
              <p className="text-sm text-content-text-tertiary">
                Email address cannot be changed. Contact support if you need to update this.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="btn-secondary"
                asChild
              >
                <Link to={`/users/${user.username}`}>Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || navigation.state === "submitting"}
                className="btn-primary"
              >
                {isSubmitting || navigation.state === "submitting" ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}