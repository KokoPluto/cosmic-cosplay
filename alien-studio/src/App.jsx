import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";


const PARTS = {
  wings: {
    none: null,
    basic: "/assets/accessories/wings_basic.PNG",
  },
  tail: {
    none: null,
    pig:  "/assets/accessories/tail_pig.PNG",
  },
  body: {
    green:  "/assets/bodies/body_basic_green.PNG",
    blue:   "/assets/bodies/body_basic_blue.PNG",
    cyan:   "/assets/bodies/body_basic_cyan.PNG",
    pink:   "/assets/bodies/body_basic_pink.PNG",
    red:    "/assets/bodies/body_basic_red.PNG",
    yellow: "/assets/bodies/body_basic_yellow.PNG",
  },
  ears: {
    green:  "/assets/ears/ears_basic_green.PNG",
    blue:   "/assets/ears/ears_basic_blue.PNG",
    cyan:   "/assets/ears/ears_basic_cyan.PNG",
    pink:   "/assets/ears/ears_basic_pink.PNG",
    red:    "/assets/ears/ears_basic_red.PNG",
    yellow: "/assets/ears/ears_basic_yellow.PNG",
  },
  head: {
    green:  "/assets/heads/head_basic_green.PNG",
    blue:   "/assets/heads/head_basic_blue.PNG",
    cyan:   "/assets/heads/head_basic_cyan.PNG",
    pink:   "/assets/heads/head_basic_pink.PNG",
    red:    "/assets/heads/head_basic_red.PNG",
    yellow: "/assets/heads/head_basic_yellow.PNG",
  },
  eyes: {
    basic:   "/assets/eyes/eye_basic.PNG",
    big:     "/assets/eyes/eye_big.PNG",
    dot:     "/assets/eyes/eye_dot.PNG",
    stressed:"/assets/eyes/eye_stressed.PNG",
    brow:    "/assets/eyes/eye_brow.PNG",
    happy:   "/assets/eyes/eye_happy.PNG",
    robot:   "/assets/eyes/eye_robot.PNG",
    wonky:   "/assets/eyes/eye_wonky.PNG",
    blue:    "/assets/eyes/eye_blue.PNG",
    brown:   "/assets/eyes/eye_brown.PNG",
  },
  glasses: {
    none: null,
    star: "/assets/accessories/glasses_star.PNG",
  },
  hat: {
    none:  null,
    party: "/assets/hats/hat_party.PNG",
    crown: "/assets/hats/hat_crown.PNG",
  },
};

const BACKGROUNDS = [
  { key: "space",  label: "Space",  image: "linear-gradient(160deg, #1a1040 0%, #2d1b6e 40%, #1a0a3d 70%, #3d1060 100%)" },
  { key: "galaxy", label: "Galaxy", image: "url('/assets/backgrounds/galaxy_background.PNG')" },
  { key: "nebula", label: "Nebula", image: "linear-gradient(160deg, #0d0221 0%, #7c3aed 50%, #db2777 100%)" },
  { key: "arctic", label: "Arctic", image: "linear-gradient(160deg, #0ea5e9 0%, #bae6fd 50%, #e0f2fe 100%)" },
  { key: "lava",   label: "Lava",   image: "linear-gradient(160deg, #1c0103 0%, #7f1d1d 40%, #f97316 100%)" },
  { key: "jungle", label: "Jungle", image: "linear-gradient(160deg, #052e16 0%, #166534 50%, #15803d 100%)" },
];

function usePartSelector(part, initial) {
  const options = Object.keys(PARTS[part]);
  const [idx, setIdx] = useState(options.indexOf(initial));
  const prev = () => setIdx(i => (i - 1 + options.length) % options.length);
  const next = () => setIdx(i => (i + 1) % options.length);
  const value = options[idx];
  const src = PARTS[part][value];
  return { value, src, prev, next, set: setIdx, idx, options };
}

export default function App() {
  const wings   = usePartSelector("wings",   "none");
  const tail    = usePartSelector("tail",    "none");
  const body    = usePartSelector("body",    "green");
  const ears    = usePartSelector("ears",    "green");
  const head    = usePartSelector("head",    "green");
  const eyes    = usePartSelector("eyes",    "basic");
  const glasses = usePartSelector("glasses", "none");
  const hat     = usePartSelector("hat",     "none");

  const [page, setPage] = useState("body");

  function ItemGrid({ partObj, selector }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
    }}>
      {Object.entries(partObj).map(([key, src], i) => {
        const selected = selector.idx === i;

        return (
          <div
            key={key}
            onClick={() => selector.set(i)}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "6px",

              // ✅ SAME STYLE YOU USED BEFORE
              border: selected
                ? "2px solid white"
                : "1px solid rgba(150,180,255,0.3)",

              background: selected
                ? "rgba(255,255,255,0.25)"
                : "rgba(100,130,255,0.2)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {src ? (
              <img
                src={src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              // ✅ NULL OPTION (X button)
              <span style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.6)"
              }}>
                ✕
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

  function renderPage() {
  if (page === "body") {
    return (
      <div>
        <p style={labelStyle}>Body</p>
        <ItemGrid partObj={PARTS.body} selector={body} />
      </div>
    );
  }

  if (page === "ears") {
    return (
      <div>
        <p style={labelStyle}>Ears</p>
        <ItemGrid partObj={PARTS.ears} selector={ears} />
      </div>
    );
  }

  if (page === "eyes") {
    return (
      <div>
        <p style={labelStyle}>Eyes</p>
        <ItemGrid partObj={PARTS.eyes} selector={eyes} />

        <p style={{ fontSize: "12px", marginTop: "8px" }}>
          Glasses
        </p>
        <ItemGrid partObj={PARTS.glasses} selector={glasses} />
      </div>
    );
  }

  if (page === "wings") {
    return (
      <div>
        <p style={labelStyle}>Wings</p>
        <ItemGrid partObj={PARTS.wings} selector={wings} />
      </div>
    );
  }

  if (page === "hat") {
    return (
      <div>
        <p style={labelStyle}>Hat</p>
        <ItemGrid partObj={PARTS.hat} selector={hat} />
      </div>
    );
  }

  if (page === "tail") {
    return (
      <div>
        <p style={labelStyle}>Tail</p>
        <ItemGrid partObj={PARTS.tail} selector={tail} />
      </div>
    );
  }

  return null;
}

function PageButton({ pageKey, emoji, page, setPage }) {
  const selected = page === pageKey;

  return (
    <div
      onClick={() => setPage(pageKey)}
      style={{
        fontSize: "24px",
        cursor: "pointer",
        textAlign: "center",
        padding: "8px",
        borderRadius: "10px",
        background: selected
          ? "rgba(255,255,255,0.2)"
          : "transparent",
        border: selected
          ? "2px solid #fff"
          : "2px solid transparent",
        transition: "0.15s",
      }}
    >
      {emoji}
    </div>
  );
}


  const [name, setName] = useState("NAME");
  const [bgIdx, setBgIdx] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const sceneRef = useRef();
  const streamRef = useRef(null);
  const recorderRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const volume = data.reduce((a, b) => a + b) / data.length;
        setMouthOpen(volume > 10);
        requestAnimationFrame(tick);
      };
      tick();
      streamRef.current = stream;
    });
  }, []);

  const startRecording = () => {
    if (!streamRef.current) return;
    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;
    let chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      if (blob.size < 5000) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = 1.5;
      audio.preservesPitch = false;
      audio.play();
    };
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const prevBg = () => setBgIdx(i => (i - 1 + BACKGROUNDS.length) % BACKGROUNDS.length);
  const nextBg = () => setBgIdx(i => (i + 1) % BACKGROUNDS.length);
  const currentBg = BACKGROUNDS[bgIdx];

  const exportImage = async () => {
    setCapturing(true);
    await new Promise(r => setTimeout(r, 50));
    const canvas = await html2canvas(sceneRef.current, { backgroundColor: null, scale: 2 });
    setCapturing(false);
    window.open(canvas.toDataURL("image/png"), "_blank");
  };

  const saveImage = async () => {
    setCapturing(true);
    await new Promise(r => setTimeout(r, 50));
    const canvas = await html2canvas(sceneRef.current, { backgroundColor: null, scale: 2 });
    setCapturing(false);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `cosmic-cosplay-${Date.now()}.png`;
    a.click();
  };

  const parts = [
    { label: "Wings",   part: wings,   key: "wings"   },
    { label: "Tail",    part: tail,    key: "tail"    },
    { label: "Body",    part: body,    key: "body"    },
    { label: "Ears",    part: ears,    key: "ears"    },
    { label: "Head",    part: head,    key: "head"    },
    { label: "Eyes",    part: eyes,    key: "eyes"    },
    { label: "Glasses", part: glasses, key: "glasses" },
    { label: "Hat",     part: hat,     key: "hat"     },
  ];

  return (
    <div ref={sceneRef} style={{
      minHeight: "100vh",
      backgroundImage: currentBg.image,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
      fontFamily: "monospace",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Stars */}
      {[...Array(40)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(Math.sin(i * 137.5) * 0.5 + 0.5) * 100}%`,
          top:  `${(Math.cos(i * 97.3)  * 0.5 + 0.5) * 100}%`,
          width:  i % 5 === 0 ? "6px" : "3px",
          height: i % 5 === 0 ? "6px" : "3px",
          background: "white",
          borderRadius: "50%",
          opacity: 0.3 + (i % 4) * 0.15,
          pointerEvents: "none",
        }}/>
      ))}

      {/* Title */}
      <header style={{ textAlign: "center", padding: "28px 20px 12px", position: "relative", zIndex: 1 }}>
        <h1 style={{
          fontSize: "clamp(28px, 6vw, 56px)",
          fontWeight: 900,
          letterSpacing: "0.15em",
          color: "white",
          margin: 0,
          textShadow: "0 0 30px rgba(180,100,255,0.8)",
          fontFamily: "Centauri, monospace",
        }}>
          ✦ COSMIC COSPLAY ✦
        </h1>
      </header>

      {/* Main layout */}
      <div style={{
        display: "flex",
        gap: "16px",
        padding: "0 24px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        alignItems: "flex-start",
      }}>

        {/* Left panel */}
        <div style={{ display: capturing ? "none" : "flex", flexDirection: "column", gap: "12px", width: "220px", flexShrink: 0 }}>

          <div style={panelStyle}>
            <p style={labelStyle}>Share!</p>
            <div style={{ background: "rgba(100,150,255,0.2)", borderRadius: "8px", padding: "8px", textAlign: "center", fontSize: "11px", color: "#a0c4ff" }}>
              🌐 See what others made!
            </div>
          </div>

          <div style={panelStyle}>
            <p style={labelStyle}>Image</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={exportImage} style={btnStyle}>📤 Export</button>
              <button onClick={saveImage}   style={btnStyle}>💾 Save</button>
            </div>
          </div>

          <div style={panelStyle}>
            <p style={labelStyle}>Speak</p>
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              style={{
                ...btnStyle,
                width: "100%",
                background: recording ? "rgba(255,80,80,0.4)" : "rgba(100,150,255,0.2)",
                border: recording ? "1px solid rgba(255,80,80,0.6)" : "1px solid rgba(150,180,255,0.4)",
              }}
            >
              {recording ? "🔴 Recording..." : "🎙️ Hold to Speak"}
            </button>
          </div>

          <div style={panelStyle}>
            <p style={labelStyle}>Name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={12}
              style={{
                background: "linear-gradient(90deg, #5b8cff, #7b6fff)",
                borderRadius: "20px", padding: "6px 24px",
                fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "white", textAlign: "center", outline: "none",
                width: "100%", cursor: "text", boxSizing: "border-box",
              }}
            />
          </div>

        </div>

        {/* Center scene */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "500px",
          position: "relative",
        }}>
          {/* Spaceship */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            top: "0px",
            zIndex: 10,
          }}>
            <img className="floating"
              src="/assets/backgrounds/spaceship.PNG"
              alt="spaceship"
              style={{ width: "550px", height: "300px", objectFit: "contain" }}
            />
          </div>

          {/* Beam */}
          <div className="floating" style={{
            position: "absolute",
            top: "150px",
            width: "200px",
            height: "220px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 100%)",
            clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
            filter: "blur(8px)",
          }}/>

          {/* Alien layers */}
          <div style={{ position: "absolute", top: "200px", width: "275px", height: "330px" }}>
            <div style={{ position: "absolute", width: "500px", height: "600px", transformOrigin: "top left", transform: "scale(0.55)" }}>
              {wings.src   && <img src={wings.src}   alt="wings"   style={layer("translateY(100px)")}     />}
              {tail.src    && <img src={tail.src}    alt="tail"    style={layer("translate(115px,150px)")} />}
              {body.src    && <img src={body.src}    alt="body"    style={layer("translateY(90px)")}       />}
              {ears.src    && <img src={ears.src}    alt="ears"    style={layer("translateY(-90px)")}      />}
              {head.src    && <img src={head.src}    alt="head"    style={layer("translateY(-90px)")}      />}
              {eyes.src    && <img src={eyes.src}    alt="eyes"    style={layer("translateY(-90px)")}      />}

              {/* Placeholder mouth */}
              <div style={{
                position: "absolute",
                width: mouthOpen ? "40px" : "30px",
                height: mouthOpen ? "20px" : "6px",
                background: "#1a0a2e",
                borderRadius: mouthOpen ? "0 0 20px 20px" : "4px",
                top: mouthOpen ? "340px" : "348px",
                left: "230px",
                transition: "all 0.05s ease",
                border: "2px solid black",
              }}/>

              {glasses.src && <img src={glasses.src} alt="glasses" style={layer("translateY(-15px)")}     />}
              {hat.src     && <img src={hat.src}     alt="hat"     style={layer("translateY(-250px)")}    />}
            </div>
          </div>

          {/* Earth */}
          <img className="rotating"
            src="/assets/backgrounds/earth.PNG"
            alt="earth"
            style={{
              position: "absolute",
              bottom: "-150%",
              width: "100vw",
              zIndex: -5,
              pointerEvents: "none",
            }}
          />

          {/* BG nav arrows */}
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0,
            display: "flex", justifyContent: "space-between",
            pointerEvents: "none",
          }}>
            <button onClick={prevBg} style={{ background: "none", border: "none", color: "white", fontSize: "28px", cursor: "pointer", pointerEvents: "all", opacity: 0.7 }}>❮❮</button>
            <button onClick={nextBg} style={{ background: "none", border: "none", color: "white", fontSize: "28px", cursor: "pointer", pointerEvents: "all", opacity: 0.7 }}>❯❯</button>
          </div>
        </div>
        

        {/* Right panel */}
        <div style={{
  display: capturing ? "none" : "flex",
  flexDirection: "row",
  gap: "0px",
   ...panelStyle, // 👈 THIS gives it the nice background
  padding: "0",
}}>
{/* SIDE TABS */}
  <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px 6px",
    background: "rgba(80,100,200,0.25)",
    borderRadius: "16px 0 0 16px",
  }}>
    {[
      { key: "body", label: "🧍" },
      { key: "ears", label: "👂" },
      { key: "eyes", label: "👀" },
      { key: "wings", label: "🪽" },
      { key: "hat", label: "🎩" },
      { key: "tail", label: "🐾" },
    ].map(tab => {
      const active = page === tab.key;

      return (
        <div
          key={tab.key}
          onClick={() => setPage(tab.key)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "28px",

            background: active
              ? "rgba(255,255,255,0.25)"
              : "transparent",

            border: active
              ? "2px solid white"
              : "2px solid transparent",

            transition: "0.2s",
          }}
        >
          {tab.label}
        </div>
      );
    })}
  </div> 
  {renderPage()}
      </div>
    </div>
    </div> 
  );
}

const panelStyle = {
  background: "rgba(150,180,255,0.15)",
  border: "2px solid rgba(150,180,255,0.3)",
  borderRadius: "12px",
  padding: "12px",
};

const labelStyle = {
  margin: "0 0 8px",
  fontSize: "25px",
  fontWeight: 700,
  color: "#a0c4ff",
};

const btnStyle = {
  flex: 1, padding: "8px 4px", borderRadius: "8px",
  border: "1px solid rgba(150,180,255,0.4)",
  background: "rgba(100,150,255,0.2)",
  color: "#a0c4ff", fontSize: "11px", cursor: "pointer",
};

const arrowStyle = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(150,180,255,0.3)",
  color: "white", width: "24px", height: "24px",
  borderRadius: "6px", cursor: "pointer",
  fontSize: "16px", display: "flex",
  alignItems: "center", justifyContent: "center",
};

function layer(transform) {
  return { position: "absolute", width: "500px", height: "600px", top: 0, left: 0, transform };
}