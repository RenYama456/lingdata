import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const PORTAL_BG = "https://meez.design/web/media/ext/f54ef81ff2480262.png";
const CURTAIN_LEFT = "https://meez.design/web/media/ext/77b5ea17346d875a.png";
const CURTAIN_RIGHT = "https://meez.design/web/media/ext/fed3cdfefb123c9f.png";
const WORLD_BG = "https://meez.design/web/media/ext/eeb65729230090d5.jpg";
const BOTTOM_CLOUDS = "https://meez.design/web/media/ext/c7addfe9b4805b98.png";

const CARD_IMAGES = [
  "https://meez.design/web/media/ext/dcf05e43bb09d001.webp",
  "https://meez.design/web/media/ext/b43a03b6d695db7f.webp",
  "https://meez.design/web/media/ext/3baded4a485ca24b.webp",
];

interface ArcCard {
  title: string;
  desc: string;
  color: string;
}

const ARC_CARDS: ArcCard[] = [
  { title: "Hidden Realms", desc: "Luminous sanctuaries unseen by wandering eyes", color: "#f3cdd6" },
  { title: "Wild Solitudes", desc: "Dissolve into untamed horizons and deep calm", color: "#dcedc2" },
  { title: "Silent Havens", desc: "Remote escapes far beyond ordinary reach", color: "#c3e3f4" },
  { title: "Bespoke Quests", desc: "Journeys shaped around your vision and soul", color: "#f0e4c0" },
  { title: "Vivid Drifts", desc: "Surreal passages through breathtaking terrain", color: "#dcd2f2" },
  { title: "Mystic Crests", desc: "Timeless ridgelines wrapped in cloud and myth", color: "#f3cdd6" },
  { title: "Deep Currents", desc: "Glowing depths alive with uncharted wonder", color: "#c3e3f4" },
  { title: "Gilded Dusk", desc: "Amber horizons that stretch past all reason", color: "#f0e4c0" },
  { title: "Glassy Tides", desc: "Calm waters holding skies of pure stillness", color: "#dcedc2" },
];

const MAG = { world: 6, clouds: 9, portal: 7, curtainL: 14, curtainR: 14 };

const VIAODA = "'Viaoda Libre', serif";
const IMPRIMA = "'Imprima', sans-serif";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

function StarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <path
        d="M14 2l2.09 6.42H23l-5.45 3.96 2.09 6.42L14 14.84l-5.64 4.06 2.09-6.42L4.96 8.42h6.95L14 2z"
        fill="white"
        opacity="0.9"
      />
      <circle cx="14" cy="24" r="1.5" fill="white" opacity="0.6" />
      <circle cx="6" cy="6" r="1" fill="white" opacity="0.4" />
      <circle cx="22" cy="6" r="1" fill="white" opacity="0.4" />
    </svg>
  );
}

const navLinkStyle: CSSProperties = {
  fontFamily: IMPRIMA,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#fff",
  opacity: 0.9,
  textDecoration: "none",
  cursor: "pointer",
};

function ScrollChevron() {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "bobUp 1.8s ease-in-out infinite",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M3 5l4 4 4-4" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SceneCard({
  img,
  size,
  radius,
  children,
}: {
  img: string;
  size: number;
  radius: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#241318",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0.12) 75%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "44%",
          backdropFilter: "blur(9px)",
          WebkitBackdropFilter: "blur(9px)",
          maskImage: "linear-gradient(to top, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 55%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PlayContent({ circle, text }: { circle: number; text: number }) {
  return (
    <>
      <div
        style={{
          width: circle,
          height: circle,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M3 1.5l5.5 3.5L3 8.5z" fill="#1a0f14" />
        </svg>
      </div>
      <span style={{ fontFamily: IMPRIMA, fontSize: text, color: "#fff" }}>View Reel</span>
    </>
  );
}

function NumberContent({ num, text }: { num: number; text: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontFamily: VIAODA, fontSize: num, color: "#fff", lineHeight: 1 }}>32</span>
      <span style={{ fontFamily: IMPRIMA, fontSize: text, color: "rgba(255,255,255,0.85)" }}>
        World Patrons
      </span>
    </div>
  );
}

function ArcCardSlider({
  cards,
  rotationOffset,
  isMobile,
}: {
  cards: ArcCard[];
  rotationOffset: number;
  isMobile: boolean;
}) {
  const cardSpacingDeg = isMobile ? 12 : 9;
  const centerIndex = Math.floor(cards.length / 2);
  const arcRadius = isMobile ? 700 : 1100;
  const cardW = isMobile ? 160 : 220;
  const cardH = isMobile ? 175 : 230;
  const sliderH = isMobile ? 260 : 360;

  return (
    <div style={{ position: "relative", width: "100%", height: sliderH }}>
      {cards.map((card, i) => {
        const baseDeg = (i - centerIndex) * cardSpacingDeg;
        const deg = baseDeg - rotationOffset + centerIndex * cardSpacingDeg;
        const rad = (deg * Math.PI) / 180;
        const x = Math.sin(rad) * arcRadius;
        const y = arcRadius - Math.cos(rad) * arcRadius;
        return (
          <div
            key={card.title}
            style={{
              position: "absolute",
              bottom: -y + (isMobile ? 140 : 200),
              left: `calc(50% + ${x - cardW / 2}px)`,
              width: cardW,
              height: cardH,
              transform: `rotate(${deg}deg)`,
              transformOrigin: `${cardW / 2}px ${arcRadius}px`,
              borderRadius: isMobile ? 18 : 26,
              background: card.color,
              boxShadow: "0 8px 40px rgba(80,40,60,0.18)",
              padding: isMobile ? 14 : 18,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "1.5px solid rgba(80,50,60,0.3)",
                color: "rgba(80,50,60,0.6)",
                fontSize: 10,
                fontFamily: IMPRIMA,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: VIAODA, fontSize: isMobile ? 22 : 30, color: "#3a2530" }}>
              {card.title}
            </div>
            <div
              style={{
                fontFamily: IMPRIMA,
                fontSize: isMobile ? 12 : 15,
                color: "rgba(58,37,48,0.65)",
                marginTop: 6,
              }}
            >
              {card.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const curtainLRef = useRef<HTMLDivElement>(null);
  const curtainRRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const curtainsOpenRef = useRef(false);
  const entranceDoneRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [uiVisible, setUiVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const max = el.scrollHeight - window.innerHeight;
      const p = clamp(max > 0 ? window.scrollY / max : 0, 0, 1);
      progressRef.current = p;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const s = smoothRef.current;
      const m = mouseRef.current;
      s.x += (m.x - s.x) * 0.07;
      s.y += (m.y - s.y) * 0.07;

      const p = progressRef.current;
      const ep = easeInOut(p);

      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${-s.x * MAG.world}px, ${-s.y * MAG.world}px, 0) scale(${lerp(1, 1.18, ep)})`;
      }
      if (cloudsRef.current) {
        cloudsRef.current.style.transform = `translate3d(${-s.x * MAG.clouds}px, ${-s.y * MAG.clouds * 0.4}px, 0) scale(${lerp(1, 1.4, ep)})`;
      }
      if (portalRef.current) {
        portalRef.current.style.transform = `translate3d(${-s.x * MAG.portal}px, ${-s.y * MAG.portal}px, 0) scale(${lerp(1, 7.5, ep)})`;
      }

      const open = curtainsOpenRef.current;
      const done = entranceDoneRef.current;
      const shift = lerp(0, 150, ep);
      const cScale = lerp(1, 1.3, ep);
      if (curtainLRef.current) {
        const basePct = (open ? -62 : 0) - shift;
        const mx = done ? -s.x * MAG.curtainL : 0;
        const my = done ? -s.y * MAG.curtainL * 0.3 : 0;
        curtainLRef.current.style.transform = `translateX(calc(${basePct}% + ${mx}px)) translateY(${my}px) scale(${cScale})`;
      }
      if (curtainRRef.current) {
        const basePct = (open ? 62 : 0) + shift;
        const mx = done ? -s.x * MAG.curtainR : 0;
        const my = done ? -s.y * MAG.curtainR * 0.3 : 0;
        curtainRRef.current.style.transform = `translateX(calc(${basePct}% + ${mx}px)) translateY(${my}px) scale(${cScale})`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => {
      [curtainLRef, curtainRRef].forEach((r) => {
        if (r.current) r.current.style.transition = "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)";
      });
      curtainsOpenRef.current = true;
    }, 100);
    const t2 = setTimeout(() => setUiVisible(true), 600);
    const t3 = setTimeout(() => {
      [curtainLRef, curtainRRef].forEach((r) => {
        if (r.current) r.current.style.transition = "none";
      });
      entranceDoneRef.current = true;
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const scene1Opacity = clamp(1 - progress / 0.22, 0, 1);
  const scene2Opacity = clamp((progress - 0.68) / 0.16, 0, 1);
  const portalOpacity = progress < 0.65 ? 1 : clamp(1 - (progress - 0.65) / 0.2, 0, 1);
  const cloudsOpacity = lerp(0.7, 1, clamp(progress / 0.05, 0, 1));
  const arcSweepDeg = (ARC_CARDS.length - 1) * 10;
  const rotationOffset = lerp(0, arcSweepDeg, clamp((progress - 0.7) / 0.3, 0, 1));

  const fadeIn = (delay: number): CSSProperties => ({
    opacity: uiVisible ? 1 : 0,
    transform: uiVisible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
  });

  return (
    <div ref={containerRef} style={{ height: "480vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#0a0608",
        }}
      >
        {/* Layer 1: world background */}
        <div
          ref={worldRef}
          style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", willChange: "transform" }}
        >
          <img
            src={WORLD_BG}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Layer 2: bottom clouds */}
        <div
          ref={cloudsRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            transformOrigin: "50% 100%",
            opacity: cloudsOpacity,
            willChange: "transform",
            pointerEvents: "none",
          }}
        >
          <img src={BOTTOM_CLOUDS} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>

        {/* Layer 2.5: arc card slider */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 60 : 80,
            left: 0,
            right: 0,
            zIndex: 9,
            opacity: scene2Opacity,
            pointerEvents: "none",
          }}
        >
          <ArcCardSlider cards={ARC_CARDS} rotationOffset={rotationOffset} isMobile={isMobile} />
        </div>

        {/* Layer 3: portal frame */}
        <div
          ref={portalRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 15,
            transformOrigin: "52% 38%",
            opacity: portalOpacity,
            willChange: "transform",
            pointerEvents: "none",
          }}
        >
          <img
            src={PORTAL_BG}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Layer 3.5: bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            zIndex: 16,
            background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Layer 4L: curtain left */}
        <div
          ref={curtainLRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 16,
            transformOrigin: "left center",
            willChange: "transform",
            pointerEvents: "none",
          }}
        >
          <img
            src={CURTAIN_LEFT}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "right center",
              display: "block",
            }}
          />
        </div>

        {/* Layer 4R: curtain right */}
        <div
          ref={curtainRRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 16,
            transformOrigin: "right center",
            willChange: "transform",
            pointerEvents: "none",
          }}
        >
          <img
            src={CURTAIN_RIGHT}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "left center",
              display: "block",
            }}
          />
        </div>

        {/* Top fade gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "42vh",
            zIndex: 45,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Navigation */}
        <nav
          className="flex md:hidden"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 20px",
          }}
        >
          <span style={{ ...navLinkStyle, fontSize: 11 }}>Explore</span>
          <StarLogo />
          <span style={{ ...navLinkStyle, fontSize: 11 }}>Connect</span>
        </nav>
        <nav
          className="hidden md:flex"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            justifyContent: "space-between",
            alignItems: "center",
            padding: "22px 48px",
          }}
        >
          <div style={{ display: "flex", gap: 36 }}>
            {["Worlds", "Atelier", "Immersions"].map((item) => (
              <span key={item} style={navLinkStyle}>
                {item}
              </span>
            ))}
          </div>
          <StarLogo />
          <div style={{ display: "flex", gap: 36 }}>
            {["Craft", "Codex", "Connect"].map((item) => (
              <span key={item} style={navLinkStyle}>
                {item}
              </span>
            ))}
          </div>
        </nav>

        {/* Scene 1 UI */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            opacity: scene1Opacity,
            pointerEvents: scene1Opacity === 0 ? "none" : "auto",
          }}
        >
          {/* Mobile layout */}
          <div
            className="flex md:hidden flex-col items-center justify-center text-center"
            style={{
              position: "absolute",
              inset: 0,
              gap: 24,
              padding: "80px 24px 100px",
              ...fadeIn(0.3),
            }}
          >
            <h1 style={{ fontFamily: VIAODA, color: "#3b1a0a", fontWeight: 400 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(26px, 7vw, 42px)",
                  letterSpacing: "0.1em",
                }}
              >
                FALL <span style={{ color: "#6b2e0e", fontSize: "0.8em" }}>›</span>{" "}
                <em>INTO</em>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(52px, 16vw, 80px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                REVERIE
              </span>
            </h1>
            <p
              style={{
                fontFamily: IMPRIMA,
                fontSize: 15,
                lineHeight: 1.625,
                color: "#5c2d0e",
                maxWidth: 280,
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth
              dissolves.
            </p>
            <SceneCard img={CARD_IMAGES[0]} size={140} radius={22}>
              <PlayContent circle={26} text={13} />
            </SceneCard>
          </div>

          {/* Tablet layout */}
          <div
            className="hidden md:flex xl:hidden"
            style={{
              position: "absolute",
              inset: 0,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 28,
              padding: "80px 32px 96px",
              ...fadeIn(0.3),
            }}
          >
            <h1 style={{ fontFamily: VIAODA, color: "#3b1a0a", fontWeight: 400 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  letterSpacing: "0.1em",
                }}
              >
                FALL <span style={{ color: "#6b2e0e", fontSize: "0.8em" }}>›</span>{" "}
                <em>INTO</em>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(60px, 12vw, 86px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                REVERIE
              </span>
            </h1>
            <p
              style={{
                fontFamily: IMPRIMA,
                fontSize: 16,
                lineHeight: 1.625,
                color: "#5c2d0e",
                maxWidth: 400,
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth
              dissolves.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <SceneCard img={CARD_IMAGES[0]} size={140} radius={22}>
                <PlayContent circle={26} text={13} />
              </SceneCard>
              <SceneCard img={CARD_IMAGES[1]} size={140} radius={22}>
                <NumberContent num={28} text={13} />
              </SceneCard>
              <SceneCard img={CARD_IMAGES[2]} size={140} radius={22}>
                <PlayContent circle={26} text={13} />
              </SceneCard>
            </div>
          </div>

          {/* Desktop heading block */}
          <div
            className="hidden xl:block"
            style={{
              position: "absolute",
              top: "46%",
              left: 60,
              maxWidth: 440,
              transform: "translateY(-50%)",
              ...fadeIn(0.3),
            }}
          >
            <h1
              style={{
                fontFamily: VIAODA,
                color: "#fff",
                fontWeight: 400,
                textShadow: "0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(32px, 4.5vw, 54px)",
                  lineHeight: 1.1,
                  letterSpacing: "0.04em",
                }}
              >
                FALL <span style={{ color: "rgba(255,220,180,0.7)", fontSize: "0.8em" }}>›</span>{" "}
                <em>INTO</em>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(50px, 7.5vw, 88px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                }}
              >
                REVERIE
              </span>
            </h1>
            <p
              style={{
                fontFamily: IMPRIMA,
                fontSize: 18,
                lineHeight: 1.7,
                color: "rgba(255,245,235,0.88)",
                maxWidth: 300,
                marginTop: 20,
                textShadow: "0 1px 12px rgba(0,0,0,0.8)",
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth
              dissolves.
            </p>
          </div>

          {/* Desktop cards block */}
          <div
            className="hidden xl:flex"
            style={{
              position: "absolute",
              right: 40,
              top: "50%",
              gap: 12,
              ...fadeIn(0.55),
              transform: uiVisible ? "translateY(-50%)" : "translateY(calc(-50% + 24px))",
            }}
          >
            <SceneCard img={CARD_IMAGES[0]} size={158} radius={28}>
              <PlayContent circle={30} text={18} />
            </SceneCard>
            <SceneCard img={CARD_IMAGES[1]} size={158} radius={28}>
              <NumberContent num={36} text={18} />
            </SceneCard>
            <SceneCard img={CARD_IMAGES[2]} size={158} radius={28}>
              <PlayContent circle={30} text={18} />
            </SceneCard>
          </div>

          {/* Slider dots */}
          <div
            className="left-1/2 -translate-x-1/2 xl:left-[60px] xl:translate-x-0 bottom-[28px] xl:bottom-[40px]"
            style={{
              position: "absolute",
              display: "flex",
              gap: 6,
              alignItems: "center",
              ...fadeIn(0.8),
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 0 ? 28 : 14,
                  height: 4,
                  borderRadius: 2,
                  background: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          {/* Scroll cue (desktop only) */}
          <div
            className="hidden xl:flex"
            style={{
              position: "absolute",
              bottom: 36,
              left: 0,
              right: 0,
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              ...fadeIn(0.9),
            }}
          >
            <span
              style={{
                fontFamily: IMPRIMA,
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Descend
            </span>
            <ScrollChevron />
          </div>
        </div>

        {/* Scene 2 UI */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 46,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            opacity: scene2Opacity,
            pointerEvents: "none",
          }}
        >
          <div style={{ marginTop: isMobile ? "8vh" : "12vh", padding: "0 20px" }}>
            <h2
              style={{
                fontFamily: VIAODA,
                fontSize: isMobile ? "clamp(28px, 8vw, 44px)" : "clamp(38px, 6.5vw, 78px)",
                color: "#fff",
                fontWeight: 400,
                letterSpacing: "0.03em",
                lineHeight: 1.05,
                textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              }}
            >
              FORGE BEYOND THE REAL
            </h2>
            <p
              style={{
                fontFamily: IMPRIMA,
                fontSize: isMobile ? 14 : 20,
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
                maxWidth: isMobile ? 260 : 480,
                color: "rgba(255,255,255,0.82)",
                margin: "18px auto 0",
              }}
            >
              Singular voyages to astonishing destinations, shaped for those who seek beauty beyond
              the ordinary and the known.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
