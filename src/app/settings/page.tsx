"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Save } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useToast } from "~/components/ui/use-toast";

type SocialLinks = {
  twitter: string;
  instagram: string;
  website: string;
};

type ProfileResponse = {
  username: string | null;
  bio: string | null;
  socialLinks: Partial<SocialLinks> | null;
};

const emptyLinks: SocialLinks = {
  twitter: "",
  instagram: "",
  website: "",
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(emptyLinks);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") return;

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) throw new Error("Could not load profile");
        const profile = (await response.json()) as ProfileResponse;
        setUsername(profile.username ?? session?.user?.username ?? "");
        setBio(profile.bio ?? "");
        setSocialLinks({
          twitter: profile.socialLinks?.twitter ?? "",
          instagram: profile.socialLinks?.instagram ?? "",
          website: profile.socialLinks?.website ?? "",
        });
      } catch {
        toast({
          title: "Could not load profile",
          description: "Refresh the page and try again.",
          variant: "destructive",
        });
      } finally {
        setIsProfileLoading(false);
      }
    };

    void loadProfile();
  }, [router, session?.user?.username, status, toast]);

  if (status === "loading" || isProfileLoading) {
    return (
      <main className="notes-canvas min-h-[70vh] px-5 py-16">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-6 h-4 w-32 bg-foreground/10" />
          <div className="mb-4 h-16 w-2/3 bg-foreground/10" />
          <div className="h-72 w-full bg-foreground/5" />
        </div>
      </main>
    );
  }

  if (!session) return null;

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, socialLinks }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to update profile");
      }

      toast({
        title: "Profile saved",
        description: "Your corner of the wall is up to date.",
      });
    } catch (error) {
      toast({
        title: "Could not save profile",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete", { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete account");
      }
      toast({
        title: "Account deleted",
        description: "Your account has been removed.",
      });
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Could not delete account",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <main className="notes-canvas min-h-screen px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/forum"
          className="group mb-12 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground/50 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Notes
        </Link>

        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Your account
          </p>
          <h1 className="mb-3 mt-3 text-5xl leading-[0.92] tracking-[-0.05em] sm:text-7xl">
            Make it yours.
          </h1>
          <p className="font-reenie text-4xl leading-none text-foreground/55">
            the name beside the fragments
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[0.32fr_0.68fr] lg:gap-20">
          <aside>
            <div className="border-t border-foreground/15 py-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/40">
                Username
              </p>
              <p className="mt-2 text-2xl">@{username}</p>
              <p className="mt-2 text-xs leading-relaxed text-foreground/40">
                Usernames stay fixed so links to your notes keep working.
              </p>
            </div>
            <div className="border-t border-foreground/15 py-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/40">
                Email
              </p>
              <p className="mt-2 break-all text-sm text-foreground/70">
                {session.user.email}
              </p>
            </div>
            {username && (
              <Link
                href={`/user/${username}`}
                className="group flex items-center justify-between border-y border-foreground/15 py-5 text-xs font-bold uppercase tracking-[0.16em] transition hover:text-primary"
              >
                View public profile
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => router.push("/change-password")}
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground/50 transition hover:text-foreground"
            >
              Password settings
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </aside>

          <div>
            <form onSubmit={handleProfileUpdate} className="space-y-10">
              <div>
                <div className="mb-3 flex items-end justify-between">
                  <label
                    htmlFor="bio"
                    className="text-xs font-bold uppercase tracking-[0.18em]"
                  >
                    A few words
                  </label>
                  <span className="text-xs text-foreground/35">
                    {bio.length} / 320
                  </span>
                </div>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="what should people know about you?"
                  maxLength={320}
                  className="min-h-[180px] w-full resize-y rounded-none border border-foreground/25 bg-white/25 p-5 text-lg leading-relaxed shadow-none placeholder:text-foreground/20 focus:border-primary focus:ring-primary"
                />
              </div>

              <fieldset>
                <legend className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">
                  Elsewhere online
                </legend>
                <div className="space-y-5">
                  {(
                    [
                      ["instagram", "Instagram"],
                      ["twitter", "Twitter / X"],
                      ["website", "Website"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="block">
                      <span className="mb-1 block text-xs text-foreground/45">
                        {label}
                      </span>
                      <input
                        type="url"
                        value={socialLinks[key]}
                        onChange={(event) =>
                          setSocialLinks((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                        placeholder="https://"
                        className="h-12 w-full rounded-none border-0 border-b border-foreground/30 bg-transparent px-0 shadow-none focus:border-primary focus:ring-0"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex justify-end border-t border-foreground/15 pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 text-xs font-bold uppercase tracking-[0.18em] text-background transition hover:bg-primary disabled:opacity-40"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save profile"}
                </button>
              </div>
            </form>

            <div className="mt-20 border-t border-destructive/30 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-destructive">
                Leave for good
              </p>
              <p className="mb-5 mt-2 max-w-lg text-sm leading-relaxed text-foreground/50">
                Deleting your account is permanent. Your login and profile
                cannot be recovered afterward.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="text-xs font-bold uppercase tracking-[0.16em] text-destructive underline decoration-destructive/30 underline-offset-4 hover:decoration-destructive"
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete account?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This cannot be undone. Your profile and access will be removed.
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
                {isDeleting ? "Deleting..." : "Delete account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
