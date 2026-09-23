import { SessionProvider } from "~/components/providers/SessionProvider";
import { Toaster } from "~/components/ui/toaster";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}
