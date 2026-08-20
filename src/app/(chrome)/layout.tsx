import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";

// Chromed surfaces: the classic site shell. The (ledger) group renders
// without any of this — composition is decided here on the server, not by
// client-side pathname checks.
export default function ChromeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div id="main-content" tabIndex={-1} className="flex-1 outline-hidden">
        {children}
      </div>
      <Footer />
    </>
  );
}
