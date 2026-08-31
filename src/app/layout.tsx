import type { Metadata, Viewport } from "next";
import { Anuphan } from "next/font/google";
import localFont from "next/font/local";
import AppHeader from "./components/header";
import "./globals.css";

/* Thai is the reading language, so the UI face has to carry it natively —
   Anuphan covers Thai and Latin in one family, so headings never switch
   skeletons mid-sentence. Figures go to a mono with true tabular widths. */
const sans = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Numerical Methods",
    template: "%s · Numerical Methods",
  },
  description:
    "เครื่องคำนวณเชิงตัวเลข 25 เมธอด แสดงตารางการวนซ้ำและกราฟทุกขั้นตอน สำหรับทวนสอบการบ้านวิชา Numerical Methods",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

/* Runs before paint so a dark-mode reader never sees a white flash. */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme') || 'system';
    var dark = stored === 'dark' || (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

const directionContract = `
THESIS: 25 numerical methods reachable in two keystrokes, each one showing its work. Refuses the mission-control dark skin the old build wore, and the bespoke visual world the direction round put on the table.
OWN-WORLD: The category standard at full craft. Neutral zinc scale, one blue carrying links, focus and data, 8px radius, hairline borders, offset-plus-blur shadows, Anuphan for Thai and Latin, Geist Mono for every figure. Light and dark are both first class.
STORY: A student verifying homework finds the method in seconds, enters parameters, and reads an iteration table whose columns line up with their own pencil work.
FIRST VIEWPORT: Header with Cmd-K search; on method pages a 16.5rem sidebar of all 25; page title, then a sticky parameter card left and the results stack right - answer, graph, then table.
FORM: canon, the standing exit, chosen by the user over the dealt hand; seed c9c067c1.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
`;

/* React has no way to render a bare comment node, and forcing one through a
   self-replacing script breaks hydration. So the contract ships as the first
   child of <body>, inside an inert hidden element whose entire content is the
   comment — auditable by grepping the built HTML for the seed key. */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>
        <div hidden dangerouslySetInnerHTML={{ __html: `<!--${directionContract}-->` }} />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
