"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ---------------- Theme (dark minimalist) ---------------- */
const PALETTE = {
  bg: "bg-black",
  text: "text-white",
  subtext: "text-neutral-400",
  border: "border-white/15",
};

/* ---------------- Smart image with next/image + graceful fallbacks ----------------
   - Wrapper gets your className (sets size & fit classes)
   - Uses next/image (fill) for optimization
   - Tries multiple sources; if one fails, advances to the next
----------------------------------------------------------------------------- */
function SmartImg({
  sources,
  alt,
  className,
}: {
  sources: string[];
  alt: string;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [failedAll, setFailedAll] = useState(false);
  const src = sources[idx];

  if (!src || failedAll) {
    return (
      <div
        className={
          "flex items-center justify-center bg-white/5 text-xs text-red-300 " +
          (className || "")
        }
      >
        Missing image
      </div>
    );
  }

  return (
    <div className={("relative " + (className || "")).trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className={
          (className || "").includes("object-contain")
            ? "object-contain"
            : "object-cover"
        }
        onError={() => {
          if (idx < sources.length - 1) setIdx(idx + 1);
          else setFailedAll(true);
        }}
        priority={false}
      />
    </div>
  );
}

/* ---------------- Small motion helper ---------------- */
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------- HERO FADE SLIDESHOW (JPEGs only) ---------------- */
const heroSlides: string[][] = [
  ["/soap-sunset.jpeg"],
  ["/polish-black.jpeg"],
   ["/gold-wheels.jpeg"],
   ["/red-mustang.jpeg"],
];

function HeroSlideshow({
  onSelectPackage,
}: {
  onSelectPackage: (pkg: string) => void;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[92vh] w-full isolate overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <SmartImg
            sources={heroSlides[i]}
            alt="Detailing showcase"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-6">
        <h1 className="max-w-3xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[0.95]">
          VEHICLE DETAILING
          <br /> IN MINNEAPOLIS
        </h1>
        <p className="mt-5 max-w-xl text-white/70">
          Professional interior restoration, exterior detailing, and lasting
          protection — delivered right to your driveway.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#booking"
            onClick={() => onSelectPackage("General Booking")}
            className="rounded-md px-6 py-3 text-sm font-medium bg-white text-black ring-1 ring-inset ring-white/20 hover:opacity-90 transition"
          >
            Book Today
          </a>
          <a
            href="#services"
            className="rounded-md px-6 py-3 text-sm font-medium border border-white/30 hover:bg-white hover:text-black transition"
          >
            Explore Services
          </a>
        </div>
      </div>

      {/* simple progress dots (read-only) */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, idx) => (
          <span
            key={idx}
            className={[
              "h-2 w-2 rounded-full",
              i === idx ? "bg-white" : "bg-white/40",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PACKAGES (Tabbed)
   ========================================================= */
function PackagesSection({ onSelectPackage }: { onSelectPackage: (pkg: string) => void }) {
  type SizeKey = "2-door" | "4-door" | "suv" | "large";

  const baseTiers = [
    {
      title: "BRONZE",
      features: [
        "Exterior — Rinse",
        "Foam Cannon",
        "Hand Wash (Two Bucket Method)",
        "Hand Dry",
        "Tires Dressed",
        "Interior — Trash Removal",
        "Wipe Down All Surfaces",
        "Quick Vacuum",
        "Windows Cleaned",
      ],
      price: 150,
    },
    {
      title: "SILVER",
      features: [
        "Exterior — Rinse",
        "Foam Cannon",
        "Hand Wash (Two Bucket Method)",
        "Hand Dry",
        "Tires Dressed",
        "Interior — Trash Removal",
        "Wipe Down All Surfaces",
        "Vacuum",
        "Leather Cleaned",
        "Cloth Seats Shampooed",
        "Windows Cleaned",
      ],
      price: 200,
    },
    {
      title: "GOLD",
      features: [
        "Exterior — Rinse",
        "Foam Cannon",
        "Hand Wash (Two Bucket Method)",
        "Hand Dry",
        "Tires Dressed",
        "Interior — Trash Removal",
        "Wipe Down All Surfaces",
        "Vacuum",
        "Steam Cleaning",
        "Leather Cleaned & Conditioned",
        "Cloth Seats Shampooed",
        "Carpets Shampooed",
        "Door Jambs Cleaned",
        "Windows Cleaned",
      ],
      price: 250,
    },
    {
      title: "PLATINUM (Maintenance)",
      features: [
        "Exterior — Rinse",
        "Foam Cannon",
        "Hand Wash (Two Bucket Method)",
        "Hand Dry",
        "Tires Dressed",
        "Interior — Trash Removal",
        "Wipe Down All Surfaces",
        "Vacuum",
        "Steam Cleaning",
        "Leather Cleaned & Conditioned",
        "Cloth Seats Shampooed",
        "Carpets Shampooed",
        "Door Jambs Cleaned",
        "Windows Cleaned",
        "Weekly/Biweekly Wash Option",
      ],
      price: 250,
    },
  ];

  const sizeAdj: Record<SizeKey, number> = {
    "2-door": 0,
    "4-door": 20,
    suv: 40,
    large: 60,
  };

  const [size, setSize] = useState<SizeKey>("2-door");
  const sizes: { key: SizeKey; label: string }[] = [
    { key: "2-door", label: "2 DOOR" },
    { key: "4-door", label: "4 DOOR" },
    { key: "suv", label: "SUV" },
    { key: "large", label: "LARGE" },
  ];

  return (
    <section id="packages" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-6 text-xs tracking-[0.25em] text-white/60">CUSTOM PRICING</div>
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">BROWSE OUR PACKAGES</h2>

      {/* Size tabs */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {sizes.map((s) => {
          const active = s.key === size;
          return (
            <button
              key={s.key}
              onClick={() => setSize(s.key)}
              className={[
                "rounded-lg px-5 py-3 text-sm font-medium border transition",
                active
                  ? "border-white bg-white/10 text-white"
                  : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-3 xl:grid-cols-4">
        {baseTiers.map((tier) => {
          const adj = tier.title.startsWith("PLATINUM") ? tier.price : tier.price + sizeAdj[size];
          const label = tier.title.startsWith("PLATINUM")
            ? `${tier.title} – ${size.toUpperCase()} (Initial $${adj})`
            : `${tier.title} – ${size.toUpperCase()} ($${adj})`;

          return (
            <div key={tier.title} className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur">
              <div className="px-6 pb-2 pt-6">
                <h3 className="text-center text-lg tracking-[0.18em] font-semibold">{tier.title}</h3>
              </div>

              <div className="mx-6 border-t border-white/10" />

              <ul className="px-6 py-6 space-y-2 text-sm text-neutral-300">
                {tier.features.map((f) => (
                  <li key={f} className="text-center">{f}</li>
                ))}
              </ul>

              <div className="px-6 pb-4 text-center">
                <div className="text-xl font-semibold">
                  {tier.title.startsWith("PLATINUM") ? `$${adj} Initial` : `$${adj}`}
                </div>
                {tier.title.startsWith("PLATINUM") && (
                  <div className="text-xs text-neutral-400">then $60 weekly / $90 biweekly</div>
                )}
              </div>

              <a
                href="#booking"
                onClick={() => onSelectPackage(label)}
                className="block rounded-b-2xl bg-[#0e2b34] px-6 py-4 text-center text-sm tracking-[0.3em] font-semibold hover:brightness-110 transition"
              >
                BOOK NOW
              </a>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Final pricing varies by condition. Maintenance plan available for repeat clients.
      </p>
    </section>
  );
}

/* =========================================================
   PRICING GUIDES (with Dealership + Fleet)
========================================================= */
function PricingGuidesSection({ onSelectPackage }: { onSelectPackage: (pkg: string) => void }) {
  type TabKey = "interior" | "ceramic" | "fleet";
  const [tab, setTab] = useState<TabKey>("interior");

  const interior = {
    subtitle: "INTERIOR PRICING GUIDE",
    tiers: [
      { name: "BRONZE", price: 75, rows: ["Trash Removal", "Wipe Down All Surfaces", "Quick Vacuum", "Windows Cleaned"] },
      { name: "SILVER", price: 100, rows: ["Trash Removal", "Wipe Down All Surfaces", "Vacuum", "Leather Cleaned", "Cloth Seats Shampooed", "Windows Cleaned"] },
      { name: "GOLD", price: 150, rows: ["Trash Removal", "Wipe Down All Surfaces", "Vacuum", "Steam Cleaning", "Leather Cleaned & Conditioned", "Cloth Seats Shampooed", "Carpets Shampooed", "Door Jambs Cleaned", "Windows Cleaned"] },
    ],
  };

  const ceramic = {
    subtitle: "PAINT CORRECTION & CERAMIC COATING",
    rows: [
      { label: "Sedan", price: 550 },
      { label: "SUV", price: 450 },
      { label: "Full Size SUV / Truck", price: 600 },
    ],
    includes: [
      "Gentle Hand Car Wash",
      "Clay Bar Treatment",
      "Iron Deposit Cleanse",
      "Paint Correction",
      "9 Year Ceramic Coating",
    ],
  };

  const fleet = {
    subtitle: "DEALERSHIP & FLEET CONTRACTS",
    description:
      "Perfect for dealerships, commercial fleets, rideshare vehicles, work trucks, rental fleets, and delivery cars. Volume discounts available.",
    basePrice: 80,
    includes: [
      "Exterior Wash + Wheels",
      "Full Interior Vacuum",
      "Dashboard + Console Wipe Down",
      "Windows Inside & Out",
      "Light Stain Removal",
      "Optional Add-Ons (Shampoo, Wax, Steam, Polish)",
    ],
    tiers: [
      { label: "5–10 Vehicles", note: "Starting at", price: 120 },
      { label: "11–25 Vehicles", note: "Starting at", price: 100 },
      { label: "26+ Vehicles", note: "Starting at", price: 80 },
    ],
  };

  return (
    <section id="price-guides" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold">Pricing Guides</h2>

      {/* Tabs */}
      <div className="mt-6 grid grid-cols-3 gap-3 md:w-[700px]">
        {[
          { key: "interior" as TabKey, label: "INTERIOR" },
          { key: "ceramic" as TabKey, label: "CERAMIC COATING" },
          { key: "fleet" as TabKey, label: "DEALERSHIP & FLEET" },
        ].map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                "rounded-lg px-5 py-3 text-sm font-medium border transition",
                active
                  ? "border-white bg-white/10 text-white"
                  : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Always-open content */}
      <div className="mt-6 rounded-2xl border border-white/15 bg-black/60 backdrop-blur p-4 md:p-6">

        {/* INTERIOR */}
        {tab === "interior" && (
          <div className="grid gap-6 md:grid-cols-3">
            {interior.tiers.map((t) => (
              <div key={t.name} className="rounded-xl border border-white/10">
                <div className="px-5 pt-5 text-center">
                  <h3 className="text-lg tracking-[0.18em] font-semibold">{t.name}</h3>
                </div>
                <div className="mx-5 my-4 border-t border-white/10" />
                <ul className="px-5 pb-4">
                  {t.rows.map((r) => (
                    <li
                      key={r}
                      className="flex items-center justify-between border-b border-white/10 py-2 last:border-b-0 text-sm text-neutral-300"
                    >
                      <span>{r}</span>
                      <span className="opacity-0">•</span>
                    </li>
                  ))}
                </ul>
                <div className="px-5 pb-4 text-center text-xl font-semibold">${t.price}</div>
                <a
                  href="#booking"
                  onClick={() => onSelectPackage(`Interior ${t.name} ($${t.price})`)}
                  className="block rounded-b-xl bg-white/10 px-5 py-3 text-center text-sm font-semibold hover:bg-white hover:text-black transition"
                >
                  BOOK NOW
                </a>
              </div>
            ))}
          </div>
        )}

        {/* CERAMIC COATING */}
        {tab === "ceramic" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10">
              <div className="px-5 pt-5 text-lg font-semibold tracking-wide">Pricing</div>
              <div className="mx-5 my-4 border-t border-white/10" />
              <ul className="px-5 pb-4">
                {ceramic.rows.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0 text-sm"
                  >
                    <span className="text-neutral-300">{r.label}</span>
                    <span className="font-medium">${r.price}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                onClick={() => onSelectPackage("Ceramic Coating – Request")}
                className="block rounded-b-xl bg-white/10 px-5 py-3 text-center text-sm font-semibold hover:bg-white hover:text-black transition"
              >
                BOOK NOW
              </a>
            </div>

            <div className="rounded-xl border border-white/10">
              <div className="px-5 pt-5 text-lg font-semibold tracking-wide">Includes</div>
              <div className="mx-5 my-4 border-t border-white/10" />
              <ul className="px-5 pb-5 space-y-2 text-sm text-neutral-300">
                {ceramic.includes.map((i) => (
                  <li key={i} className="border-b border-white/10 pb-2 last:border-b-0">{i}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* FLEET / DEALERSHIP */}
        {tab === "fleet" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 p-5">
              <h3 className="text-lg font-semibold tracking-wide">{fleet.subtitle}</h3>
              <p className="text-sm text-neutral-300 mt-2">{fleet.description}</p>
              <div className="mx-5 my-4 border-t border-white/10" />

              <ul className="px-2 pb-4 space-y-2 text-sm text-neutral-300">
                {fleet.includes.map((i) => (
                  <li key={i} className="border-b border-white/10 pb-2 last:border-b-0">
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-white/10 p-5">
              <h3 className="text-lg font-semibold tracking-wide">Fleet Pricing</h3>
              <div className="mx-5 my-4 border-t border-white/10" />

              <ul className="px-2 pb-4">
                {fleet.tiers.map((t) => (
                  <li
                    key={t.label}
                    className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0 text-sm"
                  >
                    <span className="text-neutral-300">{t.label}</span>
                    <span className="font-medium">
                      {t.note} ${t.price}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#booking"
                onClick={() => onSelectPackage("Fleet / Dealership Contract")}
                className="block rounded-b-xl bg-white/10 px-5 py-3 text-center text-sm font-semibold hover:bg-white hover:text-black transition"
              >
                CONTACT FOR CONTRACT
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
/* =========================================================
   PAGE
   ========================================================= */
export default function Home() {
  // Inquiry form (with honeypot)
  const [inq, setInq] = useState({ name: "", email: "", phone: "", vehicle: "", message: "", company: "" });
  const [inqBusy, setInqBusy] = useState(false);
  const [inqOK, setInqOK] = useState(false);
  const [inqErr, setInqErr] = useState<string | null>(null);

  // Booking form (with honeypot)
  const [bk, setBk] = useState({
    name: "", email: "", phone: "", vehicle: "",
    package: "Interior + Exterior", date: "", time: "", company: "",
  });
  const [bkBusy, setBkBusy] = useState(false);
  const [bkOK, setBkOK] = useState(false);
  const [bkErr, setBkErr] = useState<string | null>(null);

  // Footer year after mount (avoid SSR hydration nits)
  const [year, setYear] = useState<string>("");
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  function handleSelectPackage(pkg: string) {
    setBk((v) => ({ ...v, package: pkg }));
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (inq.company) return; // honeypot
    if (!validEmail(inq.email)) return setInqErr("Please enter a valid email.");
    setInqBusy(true); setInqErr(null);
    const payload = { name: inq.name, email: inq.email, phone: inq.phone, vehicle: inq.vehicle, message: inq.message };
const res = await fetch("/api/inquiry_alerts", {
  method: "POST",
  body: JSON.stringify(payload)
});
const { error } = await res.json();
    setInqBusy(false);
    if (error) return setInqErr(error.message);
    setInqOK(true);
    setInq({ name: "", email: "", phone: "", vehicle: "", message: "", company: "" });
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (bk.company) return; // honeypot
    if (!validEmail(bk.email)) return setBkErr("Please enter a valid email.");
    setBkBusy(true); setBkErr(null);
    const payload = { name: bk.name, email: bk.email, phone: bk.phone, vehicle: bk.vehicle, package: bk.package, date: bk.date, time: bk.time };
    const { error } = await supabase.from("bookings").insert([payload]);
    setBkBusy(false);
    if (error) return setBkErr(error.message);
    setBkOK(true);
    setBk({ name: "", email: "", phone: "", vehicle: "", package: "Interior + Exterior", date: "", time: "", company: "" });
  }

/* HERO (your existing HeroSlideshow goes here) */
    <HeroSlideshow onSelectPackage={handleSelectPackage} />
 /* Gallery – use JPEGs to keep consistent */
const gallery = [
  ["/before-after-mats.jpeg"],
  ["/before-after-seat.jpeg"],
  ["/before-after-trunk.jpeg"],
  ["/before-after-door.jpeg"],
  ["/Mold-removal.jpeg"],
  ["/interior.jpeg"],
];

// Lightbox state (place this near other useState hooks)
const [lightbox, setLightbox] = useState<string | null>(null);

useEffect(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") setLightbox(null);
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);

return (
  <main className={`${PALETTE.bg} ${PALETTE.text}`}>

    {/* NAV */}
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" prefetch={false} className="flex items-center gap-3">
          <SmartImg
            sources={["/logo-ac.png", "/logo-ac.jpeg"]}
            alt="AC Detailing & Cleaning"
            className="h-8 w-[140px] object-contain"
          />
          <span className="font-semibold tracking-tight">AC Detailing</span>
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          <a href="#services" className="hover:opacity-70">Services</a>
          <a href="#packages" className="hover:opacity-70">Packages</a>
          <a href="#price-guides" className="hover:opacity-70">Price Guides</a>
          <a href="#results" className="hover:opacity-70">Customer Results</a>
          <a href="#gallery" className="hover:opacity-70">Gallery</a>
          <a href="#reviews" className="hover:opacity-70">Reviews</a>
          <a href="#contact" className="hover:opacity-70">Contact</a>
        </nav>

        <a href="#booking" className="rounded-md px-4 py-2 text-sm border border-white hover:bg-white hover:text-black transition">
          Book Now
        </a>
      </div>
    </header>

    {/* ====== FULL-SIZE CLICKABLE GALLERY BEFORE HERO ====== */}
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-12">
      <Reveal><h2 className="text-2xl font-semibold">Gallery</h2></Reveal>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {gallery.map((srcs) => (
          <Reveal key={srcs[0]} delay={0.04}>
            <button
              onClick={() => setLightbox(srcs[0])}
              className="block w-full"
            >
              <SmartImg
                sources={srcs}
                alt=""
                className="h-40 w-full rounded-lg object-cover md:h-48 hover:opacity-80 transition"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {/* LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
            >
              <SmartImg
                sources={[lightbox]}
                alt="Expanded view"
                className="w-full h-full object-contain rounded-lg"
              />

              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 text-white text-lg bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>


      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal><h2 className="text-2xl font-semibold">Services</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { t: "Express Wash", d: "Foam contact wash, wheels, windows, quick interior tidy." },
            { t: "Interior + Exterior", d: "Deep interior clean (steam/shampoo) + hand wax for gloss." },
            { t: "Platinum Detail", d: "Decon & clay, one-step polish, trim/tire dress, full interior." },
          ].map((s) => (
            <Reveal key={s.t} delay={0.05}>
              <div className={`rounded-xl border p-6 hover:shadow-lg transition ${PALETTE.border}`}>
                <h3 className="font-medium">{s.t}</h3>
                <p className={`mt-2 text-sm ${PALETTE.subtext}`}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <PackagesSection onSelectPackage={handleSelectPackage} />

      {/* PRICING GUIDES (always open) */}
      <PricingGuidesSection onSelectPackage={handleSelectPackage} />

      {/* CUSTOMER RESULTS */}
      <section id="results" className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold tracking-wide text-center mb-14">
            Customer Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { srcs: ["/before-after-seat.jpeg"], caption: "Interior Seat Restoration" },
              { srcs: ["/before-after-mats.jpeg"], caption: "Floor Mat Deep Clean" },
              { srcs: ["/before-after-door.jpeg"], caption: "Door Panel Refresh" },
              { srcs: ["/before-after-trunk.jpeg"], caption: "Full Trunk Cleanout" },
              { srcs: ["/interior.jpeg"], caption: "Interior Refresh" },
              { srcs: ["/Mold-removal.jpeg"], caption: "Mold Removal" },
            ].map((card) => (
              <div key={card.caption} className="bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-white/10">
                <SmartImg sources={card.srcs} alt={card.caption} className="w-full h-64 object-cover" />
                <div className="p-4 text-center text-sm text-gray-300">{card.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-6xl px-6 py-12">
        <Reveal><h2 className="text-2xl font-semibold">Gallery</h2></Reveal>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((srcs) => (
            <Reveal key={srcs[0]} delay={0.04}>
              <SmartImg sources={srcs} alt="" className="h-40 w-full rounded-lg object-cover md:h-48" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="mx-auto max-w-6xl px-6 py-12">
        <Reveal><h2 className="text-2xl font-semibold">Reviews</h2></Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { q: "Interior looked brand new. Professional and punctual.", n: "Michael Z." },
            { q: "Carpet looked brand new and glass was crystal clear. Highly recommend.", n: "Eileen C." },
            { q: "Black paint has depth again, polish made a huge difference.", n: "Anthony L." },
  { q: "They came right to my driveway and made my SUV spotless inside and out.", n: "Sandy C." },
  { q: "Attention to detail was top-notch. The wax made my car look better than the dealership finish.", n: "Theodore L." },
  { q: "Great communication and results. Will definitely schedule regular cleanings.", n: "Karen C." },
          ].map((t) => (
            <Reveal key={t.n} delay={0.04}>
              <figure className="rounded-xl border border-white/20 p-5">
                <blockquote className="text-sm">“{t.q}”</blockquote>
                <figcaption className="mt-3 text-xs text-neutral-400">— {t.n}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal><h2 className="text-2xl font-semibold">Get a Free Quote</h2></Reveal>
        <form onSubmit={submitInquiry} className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Honeypot */}
          <input
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={inq.company}
            onChange={(e) => setInq((v) => ({ ...v, company: e.target.value }))}
            placeholder="Company"
          />
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" placeholder="Name" required value={inq.name} onChange={e=>setInq(v=>({...v,name:e.target.value}))}/>
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" type="email" placeholder="Email" required value={inq.email} onChange={e=>setInq(v=>({...v,email:e.target.value}))}/>
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" placeholder="Phone" value={inq.phone} onChange={e=>setInq(v=>({...v,phone:e.target.value}))}/>
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" placeholder="Vehicle (Make/Model/Year)" value={inq.vehicle} onChange={e=>setInq(v=>({...v,vehicle:e.target.value}))}/>
          <textarea className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40 md:col-span-2" rows={5} placeholder="Tell us what you need (odor removal, pet hair, spill, etc.)" required value={inq.message} onChange={e=>setInq(v=>({...v,message:e.target.value}))}/>
          <div className="md:col-span-2 flex items-center gap-4">
            <button disabled={inqBusy} className="rounded-md px-5 py-2.5 text-sm font-medium border border-white hover:bg-white hover:text-black transition">
              {inqBusy ? "Sending…" : "Send"}
            </button>
            {inqOK && <span className="text-sm text-emerald-400">Thanks! We’ll be in touch shortly.</span>}
            {inqErr && <span className="text-sm text-red-400">{inqErr}</span>}
          </div>
        </form>
      </section>

      {/* BOOKING */}
      <section id="booking" className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal><h2 className="text-2xl font-semibold">Schedule Your Detail</h2></Reveal>
        <form onSubmit={submitBooking} className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Honeypot */}
          <input
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={bk.company}
            onChange={(e) => setBk((v) => ({ ...v, company: e.target.value }))}
            placeholder="Company"
          />
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" placeholder="Full Name" required value={bk.name} onChange={e=>setBk(v=>({...v,name:e.target.value}))}/>
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" type="email" placeholder="Email" required value={bk.email} onChange={e=>setBk(v=>({...v,email:e.target.value}))}/>
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" placeholder="Phone (SMS)" value={bk.phone} onChange={e=>setBk(v=>({...v,phone:e.target.value}))}/>
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" placeholder="Vehicle (Make/Model/Year)" value={bk.vehicle} onChange={e=>setBk(v=>({...v,vehicle:e.target.value}))}/>
          <input className="rounded-md border border-white/20 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40" placeholder="Selected Package" value={bk.package} onChange={e=>setBk(v=>({...v,package:e.target.value}))}/>
          
          <div className="md:col-span-2 flex items-center gap-4">
            <button disabled={bkBusy} className="rounded-md px-5 py-2.5 text-sm font-medium border border-white hover:bg-white hover:text-black transition">
              {bkBusy ? "Sending…" : "Request Appointment"}
            </button>
            {bkOK && <span className="text-sm text-emerald-400">We’ll confirm by email/text.</span>}
            {bkErr && <span className="text-sm text-red-400">{bkErr}</span>}
          </div>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-top border-white/10">
        <div className="border-t border-white/10 py-10">
          <div className="mx-auto max-w-6xl px-6 text-sm text-neutral-400 flex flex-col items-center md:flex-row justify-between gap-4">
            <div>© {year || ""} AC Detailing & Cleaning</div>
            <div className="flex gap-6">
              <a href="#packages" className="hover:opacity-70">Packages</a>
              <a href="#price-guides" className="hover:opacity-70">Price Guides</a>
              <a href="#results" className="hover:opacity-70">Customer Results</a>
              <a href="#contact" className="hover:opacity-70">Contact</a>
              <a href="#booking" className="hover:opacity-70">Book</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
