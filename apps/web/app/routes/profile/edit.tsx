import type { User } from "@bip/domain";
import { ArrowLeft, Upload, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MetaFunction } from "react-router-dom";
import { Link, useLoaderData, useNavigation, useRevalidator } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ImageUpload } from "~/components/ui/image-upload";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useSession } from "~/hooks/use-session";
import { protectedLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

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
  const revalidator = useRevalidator();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const localPreviewUrlRef = useRef<string | null>(null);

  // Clean up local preview URL on unmount
  useEffect(() => {
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    };
  }, []);

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
          } catch (_error) {
          }
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (_error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUploadStart = (files: File[]) => {
    if (files.length > 0) {
      setIsUploadingAvatar(true);
      // Clean up previous local preview URL if it exists
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
      // Show local preview immediately
      const previewUrl = URL.createObjectURL(files[0]);
      localPreviewUrlRef.current = previewUrl;
      setAvatarPreview(previewUrl);
    }
  };

  const handleAvatarUploadComplete = async (images: { id: string; filename: string; variants: Record<string, string> }[]) => {
    setIsUploadingAvatar(false);
    // Clean up local preview URL since we now have a remote URL
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
    if (images.length > 0) {
      const avatarUrl = images[0].variants.avatar || images[0].variants.public;
      setAvatarPreview(avatarUrl);
      toast.success("Avatar updated!");
      revalidator.revalidate();

      // Refresh session to pick up updated avatar in Supabase metadata
      if (supabase) {
        try {
          await supabase.auth.refreshSession();
        } catch (_error) {
        }
      }
    }
  };

  const handleAvatarUploadError = (error: string) => {
    setIsUploadingAvatar(false);
    // Clean up local preview URL and revert to previous avatar
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
    setAvatarPreview(user.avatarUrl);
    toast.error(error);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="space-y-4">
              <Label className="text-content-text-primary font-medium">Profile Picture</Label>

              <div className="flex items-start gap-6">
                {/* Current Avatar Preview */}
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-glass-bg border-2 border-glass-border flex items-center justify-center">
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
                    {/* Uploading overlay */}
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <Upload className="w-6 h-6 text-white animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar Upload */}
                <div className="flex-1">
                  <ImageUpload
                    endpoint="/api/users/avatar"
                    onUploadStart={handleAvatarUploadStart}
                    onUploadComplete={handleAvatarUploadComplete}
                    onError={handleAvatarUploadError}
                    multiple={false}
                    maxFileSize={5 * 1024 * 1024}
                    showPreviews={false}
                  />
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
