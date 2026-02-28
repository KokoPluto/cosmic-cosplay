import { useState, useRef } from "react";
import html2canvas from "html2canvas";

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
    party:  "/assets/hats/hat_party.PNG",
    crown:  "/assets/hats/hat_crown.PNG",  
    none:   null,
  },
};
const BACKGROUNDS = {
  space:   "linear-gradient(160deg, #1a1040 0%, #2d1b6e 40%, #1a0a3d 70%, #3d1060 100%)",
  nebula:  "linear-gradient(160deg, #0d0221 0%, #7c3aed 50%, #db2777 100%)",
  arctic:  "linear-gradient(160deg, #0ea5e9 0%, #bae6fd 50%, #e0f2fe 100%)",
  lava:    "linear-gradient(160deg, #1c0103 0%, #7f1d1d 40%, #f97316 100%)",
  jungle:  "linear-gradient(160deg, #052e16 0%, #166534 50%, #15803d 100%)",
};

// helper
function usePartSelector(part, initial) {
  const options = Object.keys(PARTS[part]);
  const [idx, setIdx] = useState(options.indexOf(initial));
  const prev = () => setIdx(i => (i - 1 + options.length) % options.length);
  const next = () => setIdx(i => (i + 1) % options.length);
  const value = options[idx];
  const src   = PARTS[part][value];
  return { value, src, prev, next };
}

export default function App() {

  //state for each part
  const wings   = usePartSelector("wings",   "basic");
  const tail    = usePartSelector("tail",    "pig");
  const body    = usePartSelector("body",    "green");
  const ears    = usePartSelector("ears",    "green");
  const head    = usePartSelector("head",    "green");
  const eyes    = usePartSelector("eyes",    "basic");
  const glasses = usePartSelector("glasses", "star");
  const hat     = usePartSelector("hat",     "party");
  const [name, setName] = useState("NAME");
  const [bg, setBg] = useState("space");
  const sceneRef = useRef();

  const exportImage = async () => {
    const canvas = await html2canvas(sceneRef.current, {
      backgroundColor: null,
      scale: 2,
    });
    const url = canvas.toDataURL("image/png");
    window.open(url, "_blank");
  };

  const saveImage = async () => {
    const canvas = await html2canvas(sceneRef.current, {
      backgroundColor: null,
      scale: 2,
    });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `cosmic-cosplay-${Date.now()}.png`;
    a.click();
  };
  return (
    <div style={{
      minHeight: "100vh",
      background: BACKGROUNDS[bg],
      color: "white",
      fontFamily: "monospace",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* stars */}
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
        }}/>
      ))}

      {/* title */}
      <header style={{
        textAlign: "center",
        padding: "28px 20px 12px",
        position: "relative",
        zIndex: 1,
      }}>
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

      {/* main */}
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

        {/* L panel */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "160px",
          flexShrink: 0,
        }}>

          {/* Share */}
          <div style={{
            background: "rgba(150,180,255,0.15)",
            border: "2px solid rgba(150,180,255,0.3)",
            borderRadius: "12px",
            padding: "12px",
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: "#a0c4ff" }}>Share!</p>
            <div style={{
              background: "rgba(100,150,255,0.2)", borderRadius: "8px",
              padding: "8px", textAlign: "center", fontSize: "11px", color: "#a0c4ff",
            }}>
              🌐 See what others made!
            </div>
          </div>

          {/* Image */}
          <div style={{
            background: "rgba(150,180,255,0.15)",
            border: "2px solid rgba(150,180,255,0.3)",
            borderRadius: "12px",
            padding: "12px",
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: "#a0c4ff" }}>Image</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={exportImage} style={{
                flex: 1, padding: "8px 4px", borderRadius: "8px",
                border: "1px solid rgba(150,180,255,0.4)",
                background: "rgba(100,150,255,0.2)",
                color: "#a0c4ff", fontSize: "11px", cursor: "pointer",
              }}>📤 Export</button>
              <button onClick={saveImage} style={{
                flex: 1, padding: "8px 4px", borderRadius: "8px",
                border: "1px solid rgba(150,180,255,0.4)",
                background: "rgba(100,150,255,0.2)",
                color: "#a0c4ff", fontSize: "11px", cursor: "pointer",
              }}>💾 Save</button>
            </div>
          </div>
          {/* Background */}
          <div style={{
            background: "rgba(150,180,255,0.15)",
            border: "2px solid rgba(150,180,255,0.3)",
            borderRadius: "12px",
            padding: "12px",
          }}>
            <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: "#a0c4ff" }}>Background</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {Object.keys(BACKGROUNDS).map(key => (
                <button key={key} onClick={() => setBg(key)} style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: bg === key ? "2px solid #a0c4ff" : "1px solid rgba(150,180,255,0.3)",
                  background: bg === key ? "rgba(100,150,255,0.3)" : "rgba(100,150,255,0.1)",
                  color: bg === key ? "white" : "#a0c4ff",
                  fontSize: "11px", fontWeight: 700,
                  cursor: "pointer", textAlign: "left",
                  textTransform: "capitalize",
                }}>
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*Center */}
        <div ref={sceneRef} style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "500px",
          position: "relative",
        }}>

        {/* UFO + Name tag */}
        <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        position: "relative",  
        zIndex: 10,            
        }}>
        <div style={{ fontSize: "64px", lineHeight: 1 }}>🛸</div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={12}
          style={{
            background: "linear-gradient(90deg, #5b8cff, #7b6fff)",
            borderRadius: "20px", padding: "6px 24px",
            fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em",
            border: "2px solid rgba(255,255,255,0.3)", marginTop: "-8px",
            color: "white", textAlign: "center", outline: "none",
            width: "140px", cursor: "text",
          }}
        />
      </div>

          {/* Beam */}
          <div style={{
            width: 0, height: 0,
            borderLeft: "100px solid transparent",
            borderRight: "100px solid transparent",
            borderTop: "220px solid rgba(255,255,255,0.1)",
          }}/>

          {/* alien layers! */}
          
          <div style={{
            position: "relative",
            width: "275px",   
            height: "330px",  
            marginTop: "-180px",
          }}>
            <div style={{
              position: "absolute",
              width: "500px",
              height: "600px",
              transformOrigin: "top left",
              transform: "scale(0.55)",
            }}>

              {/* WINGS */}
              {wings.src && (
                <img src={wings.src} alt="wings" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translateY(100px)",
                }}/>
              )}

              {/* TAIL */}
              {tail.src && (
                <img src={tail.src} alt="tail" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translate(115px, 150px)",
                }}/>
              )}

              {/* BODY */}
              {body.src && (
                <img src={body.src} alt="body" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translateY(90px)",
                }}/>
              )}

              {/* EARS */}
              {ears.src && (
                <img src={ears.src} alt="ears" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translateY(-90px)",
                }}/>
              )}

              {/* HEAD */}
              {head.src && (
                <img src={head.src} alt="head" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translateY(-90px)",
                }}/>
              )}

              {/* EYES */}
              {eyes.src && (
                <img src={eyes.src} alt="eyes" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translateY(-90px)",
                }}/>
              )}

              {/* GLASSES */}
              {glasses.src && (
                <img src={glasses.src} alt="glasses" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translateY(-15px)",
                }}/>
              )}

              {/* HAT */}
              {hat.src && (
                <img src={hat.src} alt="hat" style={{
                  position: "absolute", width: "500px", height: "600px",
                  top: 0, left: 0, transform: "translateY(-250px)",
                }}/>
              )}

            </div>
          </div>

          {/* Planet */}
          <div style={{
            width: "320px", height: "80px",
            background: "linear-gradient(180deg, #4a7c3f, #2d5a27)",
            borderRadius: "50%",
            border: "3px solid rgba(100,200,100,0.3)",
            marginTop: "8px",
          }}/>

          {/* Nav arrows */}
          <div style={{
            position: "absolute", top: "50%", left: 0, right: 0,
            display: "flex", justifyContent: "space-between",
            pointerEvents: "none",
          }}>
            <button style={{
              background: "none", border: "none", color: "white",
              fontSize: "28px", cursor: "pointer", pointerEvents: "all", opacity: 0.7,
            }}>❮❮</button>
            <button style={{
              background: "none", border: "none", color: "white",
              fontSize: "28px", cursor: "pointer", pointerEvents: "all", opacity: 0.7,
            }}>❯❯</button>
          </div>
        </div>

        {/*R panel */}
        <div style={{
          width: "220px",
          background: "rgba(150,180,255,0.15)",
          border: "2px solid rgba(150,180,255,0.3)",
          borderRadius: "12px",
          padding: "12px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#a0c4ff" }}>
            Character
          </p>

          
          {[
            { label: "Wings",   part: wings   },
            { label: "Tail",    part: tail    },
            { label: "Body",    part: body    },
            { label: "Ears",    part: ears    },
            { label: "Head",    part: head    },
            { label: "Eyes",    part: eyes    },
            { label: "Glasses", part: glasses },
            { label: "Hat",     part: hat     },
          ].map(({ label, part }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(100,130,255,0.15)",
              borderRadius: "8px", padding: "6px 8px",
            }}>
              <span style={{ fontSize: "10px", color: "#a0c4ff", fontWeight: 700, minWidth: "48px" }}>
                {label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button onClick={part.prev} style={arrowStyle}>‹</button>
                <span style={{ fontSize: "9px", color: "white", minWidth: "36px", textAlign: "center" }}>
                  {part.value}
                </span>
                <button onClick={part.next} style={arrowStyle}>›</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const arrowStyle = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(150,180,255,0.3)",
  color: "white", width: "22px", height: "22px",
  borderRadius: "6px", cursor: "pointer",
  fontSize: "14px", display: "flex",
  alignItems: "center", justifyContent: "center",
};