import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { Form, useLoaderData, useNavigation } from "react-router-dom";
import { ArrowLeft, Upload, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "~/hooks/use-session";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FileUpload } from "~/components/ui/file-upload";
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
  const user = await services.users.findByEmail(context.currentUser.email);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
});

export default function ProfileEdit() {
  const data = useLoaderData() as { user: User };
  const { user } = data;
  const { supabase } = useSession();
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

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

        // Refresh the session to pick up updated user metadata
        if (supabase) {
          try {
            await supabase.auth.refreshSession();
          } catch (error) {
            console.warn("Failed to refresh session:", error);
          }
        }
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
    setAvatarUrl(url || null);
    setAvatarPreview(url || null);
  };

  const handleAvatarUpload = (result: { id: string; filename: string; url: string; size: number; type: string }) => {
    setUploadedFileId(result.id);
    setAvatarUrl(result.url);
    setAvatarPreview(result.url);
    toast.success("Avatar uploaded successfully!");
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
                    <UserIcon className="w-10 h-10 text-content-text-tertiary" />
                  )}
                </div>
                <p className="text-xs text-content-text-tertiary text-center mt-2">
                  Auto-resized to 200×200
                </p>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3">
                <div>
                  <Label className="text-sm font-medium text-content-text-primary mb-2 block">
                    Profile Picture
                  </Label>
                  <p className="text-sm text-content-text-tertiary mb-3">
                    Upload an image or enter a URL
                  </p>
                </div>

                {/* File Upload - Compact */}
                <FileUpload
                  category="avatar"
                  onUploadComplete={handleAvatarUpload}
                  accept="image/jpeg,image/png,image/webp"
                  helperText="JPG, PNG, WebP (max 5MB)"
                  className="min-h-[60px]"
                />

                {/* URL Input - Clean */}
                <div className="flex gap-2 items-center">
                  <Label htmlFor="avatarUrl" className="text-xs text-content-text-tertiary whitespace-nowrap">
                    or URL:
                  </Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={avatarUrl || ""}
                    onChange={handleAvatarChange}
                    className="bg-glass-bg border-glass-border text-content-text-primary placeholder:text-content-text-tertiary text-sm"
                  />
                </div>

                {/* Hidden inputs */}
                <input type="hidden" name="avatarUrl" value={avatarUrl || ""} />
                {uploadedFileId && <input type="hidden" name="avatarFileId" value={uploadedFileId} />}
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
              <Button type="button" variant="outline" className="btn-secondary" asChild>
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
