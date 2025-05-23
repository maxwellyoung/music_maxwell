"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { Separator } from "~/components/ui/separator";
import { motion } from "framer-motion";
import Link from "next/link";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    instagram: "",
    website: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      setUsername(session.user.username ?? "");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-64 rounded bg-gray-200"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          socialLinks,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error((data.error as string) || "Failed to delete account");
      }
      toast({
        title: "Account deleted",
        description: "Your account has been deleted.",
        className: "bg-white",
      });
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
        className: "bg-white",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/forum" passHref legacyBehavior>
            <Button
              variant="outline"
              className="px-5 py-2 text-base font-semibold"
            >
              ← Back to Forum
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <Separator />

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium leading-none"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium leading-none"
                  >
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    className="h-24"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Social Links
                  </label>
                  <Input
                    value={socialLinks.twitter}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSocialLinks({
                        ...socialLinks,
                        twitter: e.target.value,
                      })
                    }
                    placeholder="Twitter URL"
                    className="h-12"
                  />
                  <Input
                    value={socialLinks.instagram}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSocialLinks({
                        ...socialLinks,
                        instagram: e.target.value,
                      })
                    }
                    placeholder="Instagram URL"
                    className="h-12"
                  />
                  <Input
                    value={socialLinks.website}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSocialLinks({
                        ...socialLinks,
                        website: e.target.value,
                      })
                    }
                    placeholder="Website URL"
                    className="h-12"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-lg">{session.user?.email}</p>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/change-password")}
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-12 flex flex-col items-center">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
