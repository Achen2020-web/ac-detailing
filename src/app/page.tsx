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

/* ---------------- Smart image wrapper ---------------- */
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
  const [failed, setFailed] = useState(false);
  const src = sources[idx];

  if (!src || failed) {
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
          else setFailed(true);
        }}
      />
    </div>
  );
}

/* ---------------- Reveal helper ---------------- */
function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------- HERO slideshow ---------------- */
const heroSlides = [
  ["/soap-sunset.jpeg"],
  ["/polish-black.jpeg"],
  ["/gold-wheels.jpeg"],
  ["/red-mustang.jpeg"],
];

function HeroSlideshow({ onSelectPackage }: { onSelectPackage: (pkg: string) => void }) {
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
          transition={{ duration: 1.3 }}
          className="absolute inset-0"
        >
          <SmartImg
            sources={heroSlides[i]}
            alt="Detailing showcase"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
        <h1 className="max-w-4xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[0.95]">
          VEHICLE DETAILING
          <br /> IN MINNEAPOLIS
        </h1>
        <p className="mt-4 max-w-xl text-white/80">
          Premium mobile detailing with showroom-grade results — right at your driveway.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#booking"
            className="rounded-md px-6 py-3 text-sm font-medium bg-white text-black hover:opacity-90 transition"
            onClick={() => onSelectPackage("General Booking")}
          >
            Book Today
          </a>

          <a
            href="#packages"
            className="rounded-md px-6 py-3 text-sm font-medium border border-white/30 hover:bg-white hover:text-black transition"
          >
            View Packages
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Packages Section ---------------- */
function PackagesSection({ onSelectPackage }: { onSelectPackage: (pkg: string) => void }) {
  const sizes = [
    { key: "2-door", label: "2 DOOR", adj: 0 },
    { key: "4-door", label: "4 DOOR", adj: 20 },
    { key: "suv", label: "SUV", adj: 40 },
    { key: "large", label: "LARGE", adj: 60 },
  ];

  const [size, setSize] = useState(sizes[0]);

  const tiers = [
    {
      title: "BRONZE",
      price: 150,
      features: ["Hand Wash", "Interior Wipe Down", "Quick Vacuum", "Windows"],
    },
    {
      title: "SILVER",
      price: 200,
      features: [
        "Hand Wash",
        "Vacuum",
        "Leather / Upholstery Clean",
        "Windows",
      ],
    },
    {
      title: "GOLD",
      price: 250,
      features: [
        "Hand Wash + Wax",
        "Steam Cleaning",
        "Carpet & Seat Shampoo",
        "Trim & Tire Dressing",
      ],
    },
  ];

  return (
    <section id="packages" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-3xl font-extrabold tracking-tight">Detailing Packages</h2>

      {/* size controls */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {sizes.map((s) => (
          <button
            key={s.key}
            onClick={() => setSize(s)}
            className={`px-4 py-2 rounded-lg border ${
              size.key === s.key
                ? "bg-white text-black"
                : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => {
          const price = t.price + size.adj;
          return (
            <div key={t.title} className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur">
              <div className="px-6 py-4 text-center">
                <h3 className="tracking-[0.18em] font-semibold">{t.title}</h3>
              </div>
              <ul className="px-6 py-4 space-y-2 text-sm text-neutral-300">
                {t.features.map((f) => (
                  <li key={f} className="text-center">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="px-6 pb-4 text-center text-xl font-semibold">${price}</div>
              <a
                href="#booking"
                onClick={() => onSelectPackage(`${t.title} - ${size.label} ($${price})`)}
                className="block rounded-b-2xl bg-[#0e2b34] px-6 py-3 text-center text-sm tracking-[0.3em] font-semibold hover:brightness-110 transition"
              >
                BOOK NOW
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
export default function Home() {
  /* inquiry form */
  const [inq, setInq] = useState({ name: "", email: "", phone: "", vehicle: "", message: "", company: "" });
  const [inqBusy, setInqBusy] = useState(false);
  const [inqOK, setInqOK] = useState(false);
  const [inqErr, setInqErr] = useState<string | null>(null);

  /* booking form */
  const [bk, setBk] = useState({ name: "", email: "", phone: "", vehicle: "", package: "Interior + Exterior", company: "" });
  const [bkBusy, setBkBusy] = useState(false);
  const [bkOK, setBkOK] = useState(false);
  const [bkErr, setBkErr] = useState<string | null>(null);

  function validEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  function handleSelectPackage(pkg: string) {
    setBk((v) => ({ ...v, package: pkg }));
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (inq.company) return;
    if (!validEmail(inq.email)) return setInqErr("Invalid email");
    setInqBusy(true);
    const { error } = await supabase.from("customer_inquiries").insert([inq]);
    setInqBusy(false);
    if (error) return setInqErr(error.message);
    setInq({ name: "", email: "", phone: "", vehicle: "", message: "", company: "" });
    setInqOK(true);
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (bk.company) return;
    if (!validEmail(bk.email)) return setBkErr("Invalid email");
    setBkBusy(true);
    const payload = { name: bk.name, email: bk.email, phone: bk.phone, vehicle: bk.vehicle, package: bk.package };
    const { error } = await supabase.from("bookings").insert([payload]);
    setBkBusy(false);
    if (error) return setBkErr(error.message);
    setBk({ name: "", email: "", phone: "", vehicle: "", package: "Interior + Exterior", company: "" });
    setBkOK(true);
  }

  /* year */
  const [year, setYear] = useState("");
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  return (
    <main className={`${PALETTE.bg} ${PALETTE.text}`}>
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <SmartImg sources={["/logo-ac.png"]} alt="AC Detailing & Cleaning" className="h-8 w-[140px] object-contain" />
          </Link>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#packages">Packages</a>
            <a href="#reviews">Reviews</a>
            <a href="#contact">Contact</a>
            <a href="#booking">Book</a>
          </nav>
          <a href="#booking" className="border px-4 py-2 rounded hover:bg-white hover:text-black">Book Now</a>
        </div>
      </header>

      {/* HERO */}
      <HeroSlideshow onSelectPackage={handleSelectPackage} />

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold">Services</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          {[
            { t: "Express Wash", d: "Foam wash + interior wipe + wheels." },
            { t: "Full Interior + Exterior", d: "Deep clean, shampoo, and wax." },
            { t: "Platinum Showroom", d: "Paint correction, polish, and full interior restoration." },
          ].map((s) => (
            <Reveal key={s.t}>
              <div className="border border-white/15 p-6 rounded-xl bg-black/40">
                <h3 className="font-medium">{s.t}</h3>
                <p className="text-sm text-neutral-400 mt-2">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <PackagesSection onSelectPackage={handleSelectPackage} />

      {/* REVIEWS */}
      <section id="reviews" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal><h2 className="text-2xl font-semibold">Reviews</h2></Reveal>
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {[
            { q: "Interior looked brand new. Professional and punctual.", n: "Michael Z." },
            { q: "Carpet looked brand new and glass was crystal clear. Highly recommend.", n: "Eileen C." },
            { q: "Black paint has depth again—polish made a huge difference.", n: "Anthony L." },
            { q: "They came right to my driveway and made my SUV spotless inside and out.", n: "Sandy C." },
            { q: "Attention to detail was top-notch. The wax made my car look better than the dealership finish.", n: "Theodore L." },
            { q: "Great communication and results. Will definitely schedule regular cleanings.", n: "Karen C." },
          ].map((r) => (
            <Reveal key={r.n}>
              <figure className="border border-white/20 p-5 rounded-xl">
                <blockquote className="text-sm">“{r.q}”</blockquote>
                <figcaption className="text-xs text-neutral-400 mt-3">— {r.n}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold">Get a Free Quote</h2>
        <form onSubmit={submitInquiry} className="mt-6 grid gap-3 md:grid-cols-2">
          <input className="hidden" value={inq.company} onChange={(e)=>setInq({...inq,company:e.target.value})}/>
          <input required placeholder="Name" className="form-input" value={inq.name} onChange={e=>setInq({...inq,name:e.target.value})}/>
          <input required type="email" placeholder="Email" className="form-input" value={inq.email} onChange={e=>setInq({...inq,email:e.target.value})}/>
          <input placeholder="Phone" className="form-input" value={inq.phone} onChange={e=>setInq({...inq,phone:e.target.value})}/>
          <input placeholder="Vehicle" className="form-input" value={inq.vehicle} onChange={e=>setInq({...inq,vehicle:e.target.value})}/>
          <textarea required placeholder="What do you need?" className="form-input md:col-span-2" value={inq.message} onChange={e=>setInq({...inq,message:e.target.value})}/>
          <button className="border rounded px-5 py-2 hover:bg-white hover:text-black" disabled={inqBusy}>
            {inqBusy ? "Sending..." : "Send"}
          </button>
          {inqOK && <span className="text-emerald-400 text-sm">Thanks! We'll reach out shortly.</span>}
          {inqErr && <span className="text-red-400 text-sm">{inqErr}</span>}
        </form>
      </section>

      {/* BOOKING */}
      <section id="booking" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-2xl font-semibold">Schedule Your Detail</h2>
        <form onSubmit={submitBooking} className="mt-6 grid gap-3 md:grid-cols-2">
          <input className="hidden" value={bk.company} onChange={e=>setBk({...bk,company:e.target.value})}/>
          <input required placeholder="Full Name" className="form-input" value={bk.name} onChange={e=>setBk({...bk,name:e.target.value})}/>
          <input required type="email" placeholder="Email" className="form-input" value={bk.email} onChange={e=>setBk({...bk,email:e.target.value})}/>
          <input placeholder="Phone (SMS)" className="form-input" value={bk.phone} onChange={e=>setBk({...bk,phone:e.target.value})}/>
          <input placeholder="Vehicle" className="form-input" value={bk.vehicle} onChange={e=>setBk({...bk,vehicle:e.target.value})}/>
          <input placeholder="Package" className="form-input" value={bk.package} onChange={e=>setBk({...bk,package:e.target.value})}/>
          <button className="border rounded px-5 py-2 hover:bg-white hover:text-black" disabled={bkBusy}>
            {bkBusy ? "Sending..." : "Request Appointment"}
          </button>
          {bkOK && <span className="text-emerald-400 text-sm">We’ll confirm by email/text.</span>}
          {bkErr && <span className="text-red-400 text-sm">{bkErr}</span>}
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-sm text-neutral-400 text-center">
        © {year} AC Detailing & Cleaning — Mobile Auto Detailing in Minneapolis
      </footer>
    </main>
  );
}

/* ---------------- Tailwind helper class ---------------- */
declare module "react" {
  interface HTMLAttributes<T> {
    className?: string;
  }
}
