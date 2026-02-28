import html2canvas from "html2canvas";
import { useState, useRef, useEffect } from "react";

const PARTS = {
  wings: {
    basic: "/assets/accessories/wings_basic.PNG",
    none:  null,
  },
  tail: {
    pig:  "/assets/accessories/tail_pig.PNG",
    none: null,
  },
  body: {
    green: "/assets/bodies/body_basic_green.PNG",
  },
  ears: {
    green: "/assets/ears/ears_basic_green.PNG",
  },
  head: {
    green: "/assets/heads/head_basic_green.PNG",
  },
  eyes: {
    basic: "/assets/eyes/eye_basic.PNG",
  },
  glasses: {
    star: "/assets/accessories/glasses_star.PNG",
    none: null,
  },
  hat: {
    party: "/assets/hats/hat_party.PNG",
    crown: "/assets/hats/hat_crown.PNG",
    none:  null,
  },
};

const BACKGROUNDS = [
  { key: "space",  label: "Space",  image: "linear-gradient(160deg, #1a1040 0%, #2d1b6e 40%, #1a0a3d 70%, #3d1060 100%)" },
  { key: "galaxy", label: "Galaxy", image: "url('/assets/backgrounds/galaxy_background.PNG')" },
  { key: "nebula", label: "Nebula", image: "linear-gradient(160deg, #0d0221 0%, #7c3aed 50%, #db2777 100%)" },
  //{ key: "arctic", label: "Arctic", image: "linear-gradient(160deg, #0ea5e9 0%, #bae6fd 50%, #e0f2fe 100%)" },
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
  const wings   = usePartSelector("wings",   "basic");
  const tail    = usePartSelector("tail",    "pig");
  const body    = usePartSelector("body",    "green");
  const ears    = usePartSelector("ears",    "green");
  const head    = usePartSelector("head",    "green");
  const eyes    = usePartSelector("eyes",    "basic");
  const glasses = usePartSelector("glasses", "star");
  const hat     = usePartSelector("hat",     "party");

  const [name, setName] = useState("NAME");
  const [bgIdx, setBgIdx] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const sceneRef = useRef();
  const [mouthOpen, setMouthOpen] = useState(false);
  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const [recording, setRecording] = useState(false);

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

    // store stream for the record button to use
    streamRef.current = stream;
  });
}, []);

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

    {/* Main layout — 3 columns */}
    <div style={{
      display: "flex",
      flexDirection: "row",
      gap: "16px",
      padding: "0 24px 24px",
      maxWidth: "1200px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
      alignItems: "flex-start",
    }}>

      {/* Left panel */}
      <div style={{ display: capturing ? "none" : "flex", flexDirection: "column", gap: "12px", width: "280px", flexShrink: 0 }}>
  
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
        <img src="/assets/backgrounds/spaceship.PNG" alt="spaceship" style={{ width: "550px", height: "300px", objectFit: "contain", position: "relative", zIndex: 10 }} />

        {/* Beam */}
        <div style={{
          width: "200px",
          height: "220px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 100%)",
          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
          filter: "blur(8px)",
          marginTop: "-10px",
        }}/>

        {/* Alien layers */}
        <div style={{ position: "relative", width: "300px", height: "430px", marginTop: "-300px" }}>
          <div style={{ position: "absolute", width: "500px", height: "700px", transformOrigin: "top left", transform: "scale(0.55)" }}>
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
        width: "280px",
        flexShrink: 0,
        ...panelStyle,
        display: capturing ? "none" : "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <p style={labelStyle}>Character</p>
        {parts.map(({ label, part, key }) => (
          <div key={key}>
            <span style={{ fontSize: "9px", color: "#a0c4ff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {label}
            </span>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
              {part.options.map((opt, i) => {
                const src = PARTS[key][opt];
                const isSelected = part.idx === i;
                return (
                  <button key={opt} onClick={() => part.set(i)} title={opt} style={{
                    width: "48px", height: "48px",
                    borderRadius: "8px",
                    border: isSelected ? "2px solid #a0c4ff" : "1px solid rgba(150,180,255,0.25)",
                    background: isSelected ? "rgba(100,150,255,0.35)" : "rgba(100,130,255,0.1)",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", padding: 0, flexShrink: 0,
                  }}>
                    {src
                      ? <img src={src} alt={opt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      : <span style={{ fontSize: "16px", color: "rgba(160,196,255,0.5)" }}>✕</span>
                    }
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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

function layer(transform) {
  return { position: "absolute", width: "500px", height: "600px", top: 0, left: 0, transform };
}