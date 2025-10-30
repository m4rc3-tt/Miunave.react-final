import { useState, useEffect, useRef } from "react";
import "./styles.css";
import Auth from "./components/Auth";

export default function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("tema") === "oscuro");
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isReproductorMinimized, setIsReproductorMinimized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/verify', {
      credentials: 'include'
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('No autenticado');
    })
    .then(data => setUser(data.user))
    .catch(() => setUser(null));
  }, []);
  

  const musicFiles = [
    "/musica/08  - YSY A x BHAVI ft. MILO J - FLECHAZO EN EL CENTRO (PROD. ONIRIA).mp3",
    "/musica/22. Hasta el Amanecer - Nicky Jam  Video Oficial - NickyJamTV.mp3",
    "/musica/2Pac - All Eyez On Me - Seven Hip-Hop.mp3",
    "/musica/2Pac - Hit 'Em Up (Dirty) (Music Video) HD - Seven Hip-Hop.mp3",
    "/musica/A las Nueve.mp3",
    "/musica/a-ha - Take On Me (Official Video) [4K] - a-ha.mp3",
    "/musica/ACDC - Back In Black (Official Video).mp3",
    "/musica/ACDC - Highway to Hell (Official Video).mp3",
    "/musica/ACDC - Thunderstruck (Official Video).mp3",
    "/musica/Andrés Calamaro - Flaca (Videoclip Oficial).mp3",
    "/musica/Antonio Rios - Nunca me Faltes.mp3",
    "/musica/AYAX - ZINEDINE (PROD. HUECO PRODS) VIDEOCLIP.mp3",
    "/musica/Baila Morena - Hector y Tito ft. Don Omar _ Glory ( Tiktok song, Lyrics Video) - LyricsForYou.mp3",
    "/musica/Balada Del Diablo y La Muerte.mp3",
    "/musica/Beyoncé - Crazy In Love ft. JAY Z - BeyoncéVEVO.mp3",
    "/musica/Bhavi ft. Ecko - Piso (Prod. by Omar Varela).mp3",
    "/musica/Big Poppa (2007 Remaster) - The Notorious B.I.G..mp3",
    "/musica/Billie Eilish - BIRDS OF A FEATHER (Official Music Video) - BillieEilishVEVO.mp3",
    "/musica/Billie Jean - Michael Jackson.mp3",
    "/musica/Blackened (Remastered).mp3",
    "/musica/Chaqueño Palavecino -  El Dedo En La Llaga.mp3",
    "/musica/Chic 'N' Stu.mp3",
    "/musica/Ciro y Los Persas  ASTROS  (Registro Oficial de la Grabación).mp3",
    "/musica/Daddy Yankee   Lo Que Paso Paso HQ - Neranjan manabharana.mp3",
    "/musica/Daddy Yankee - Gasolina - Music.mp3",
    "/musica/Dejenlá Que Llore.mp3",
    "/musica/Don Omar - Dile - Sonido Mix.mp3",
    "/musica/Dr. Dre - Still D.R.E. ft. Snoop Dogg - DrDreVEVO.mp3",
    "/musica/Dr. Dre - The Next Episode (Official Music Video) ft. Snoop Dogg, Kurupt, Nate Dogg - DrDreVEVO.mp3",
    "/musica/DUKI - GIVENCHY (Video Oficial).mp3",
    "/musica/DUKI - Goteo (Video Oficial).mp3",
    "/musica/DUKI - Rockstar (Video Oficial).mp3",
    "/musica/Duki - She Don't Give a FO (ft. Khea) Prod. by Omar Varela.mp3",
    "/musica/DUKI, Ysy A, C.R.O - Hijo de la Noche (Video Oficial).mp3",
    "/musica/Eazy E - Boyz-n-the-Hood (Music Video) - TheHipHopSyko.mp3",
    "/musica/Eazy E - No More Question's - TehRapChannel.mp3",
    "/musica/Eazy-Duz-It - Ruthless Records.mp3",
    "/musica/Eazy-E - Real Muthaphuckkin G's (Music Video) - Creative Hip-Hop.mp3",
    "/musica/ECKO - DORADO (Prod. by Omar Varela).mp3",
  ];

  const [playlists] = useState([
    {
      nombre: "Rock Clásico",
      portada: "https://s0.smartresize.com/wallpaper/963/312/HD-wallpaper-music-heavy-metal-1980s-cover-art-rock-music-rock-and-roll-thumbnail.jpg",
      gradient: "linear-gradient(to top, rgba(255, 0, 0, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /ACDC|Queen|Guns N' Roses|Kiss|Red Hot Chili|Survivor|Beatles|Rolling Stones|Evanescence/i.test(f)),
    },
    {
      nombre: "Pop Hits",
      portada: "https://previews.123rf.com/images/studioaccendo/studioaccendo2304/studioaccendo230406225/202236994-pop-art-comic-book-explosion-background-pop-art-comics-book-magazine-cover.jpg.jpg",
      gradient: "linear-gradient(to top, rgba(0, 123, 255, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /a-ha|Beyoncé|Billie Eilish|Harry Styles|Katy Perry|Lady Gaga|Bruno Mars|Mark Ronson|The Weeknd|Rihanna|Michael Jackson/i.test(f)),
    },
    {
      nombre: "Rock Nacional",
      portada: "https://cdn-images.dzcdn.net/images/talk/8000396a999b5073426a77512589d31d/500x500.jpg",
      gradient: "linear-gradient(to top, rgba(40, 167, 69, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /Andrés Calamaro|Ciro y Los Persas|Soda Stereo|Gustavo Cerati|Rata Blanca/i.test(f)),
    },
    {
      nombre: "Trap Argentino",
      portada: "https://i.pinimg.com/736x/82/86/b2/8286b254915c576c20b49b6bbc265ad9.jpg",
      gradient: "linear-gradient(to top, rgba(111, 66, 193, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /DUKI|Duki|YSY A|Bhavi|ECKO/i.test(f)),
    },
    {
      nombre: "Reggaetón Viejo",
      portada: "https://i1.sndcdn.com/avatars-Ja0cz1ZARCNmLw3B-20rHyw-t500x500.jpg",
      gradient: "linear-gradient(to top, rgba(255, 193, 7, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /Nicky Jam|Daddy Yankee|Don Omar|Tego Calderón/i.test(f)),
    },
    {
      nombre: "Rap 90s",
      portada: "https://i.pinimg.com/474x/7b/0b/79/7b0b79d10a0d054f9e4240dc4467b864.jpg",
      gradient: "linear-gradient(to top, rgba(108, 117, 125, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /2Pac|Notorious|Dr. Dre|Eazy E|Ice Cube|Eminem/i.test(f)),
    },
    {
      nombre: "Cumbia",
      portada: "https://img.freepik.com/vector-premium/ilustracion-texto-cumbia-dibujada-mano_23-2150777894.jpg",
      gradient: "linear-gradient(to top, rgba(220, 53, 69, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /Antonio Rios|Los Ángeles Azules|Dejenlá|Pibe Cantina|Chaqueño Palavecino/i.test(f)),
    },
    {
      nombre: "Heavy Metal Clasicos",
      portada: "https://images.cdn2.buscalibre.com/fit-in/360x360/f8/01/f801e5411aa5550906b439459ef42782.jpg",
      gradient: "linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)",
      canciones: musicFiles.filter((f) => /Blackened|Judas Priest|Metallica|Raining Blood|Rammstein|Painkiller|Master of Puppets/i.test(f)),
    },
  ]);

  const [canciones, setCanciones] = useState([]);
  const [playlistActiva, setPlaylistActiva] = useState(null);
  const [cancionesLocales, setCancionesLocales] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const progressContainerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("modo-oscuro", darkMode);
    document.body.classList.toggle("modo-claro", !darkMode);
    localStorage.setItem("tema", darkMode ? "oscuro" : "claro");
  }, [darkMode]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      if (progressRef.current) {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        progressRef.current.style.width = `${porcentaje}%`;
      }
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playSong = (index) => {
    if (!canciones.length) return;
    const newIndex = (index + canciones.length) % canciones.length;
    setCurrentIndex(newIndex);
    audioRef.current.src = canciones[newIndex];
    audioRef.current.play();
    setIsPlaying(true);
  };

  const prevSong = () => playSong(currentIndex - 1);
  const nextSong = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * canciones.length);
      playSong(randomIndex);
    } else {
      playSong(currentIndex + 1);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (isRepeat) playSong(currentIndex);
      else nextSong();
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentIndex, isRepeat, canciones]);

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressContainerRef.current) return;
    const ancho = progressContainerRef.current.offsetWidth;
    const clickX = e.nativeEvent.offsetX;
    audioRef.current.currentTime = (clickX / ancho) * audioRef.current.duration;
  };

  const sendMessage = (text) => {
    if (text.trim() !== "" && activeUser) {
      setMessages([...messages, { user: activeUser, text, propio: true }]);
    }
  };

  const [bass, setBass] = useState(0);
  const [mid, setMid] = useState(0);
  const [treble, setTreble] = useState(0);

  const audioCtxRef = useRef(null);
  const bassRef = useRef(null);
  const midRef = useRef(null);
  const trebleRef = useRef(null);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaElementSource(audioEl);

      const b = audioCtx.createBiquadFilter();
      b.type = "lowshelf";
      b.frequency.value = 60;

      const m = audioCtx.createBiquadFilter();
      m.type = "peaking";
      m.Q.value = Math.SQRT1_2;
      m.frequency.value = 1000;

      const t = audioCtx.createBiquadFilter();
      t.type = "highshelf";
      t.frequency.value = 12000;

      const gainNode = audioCtx.createGain();

      source.connect(b);
      b.connect(m);
      m.connect(t);
      t.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      bassRef.current = b;
      midRef.current = m;
      trebleRef.current = t;

      audioEl.addEventListener('play', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
      });
    }

    if (bassRef.current) bassRef.current.gain.value = bass;
    if (midRef.current) midRef.current.gain.value = mid;
    if (trebleRef.current) trebleRef.current.gain.value = treble;

    return () => {};
  }, [bass, mid, treble]);

  return (
    <div className={darkMode ? "modo-oscuro" : "modo-claro"}>
      <header>
        <h1 className="titulo">MiuNave</h1>
        <div className="header-buttons">
          <button className="theme-icon" onClick={() => setDarkMode(!darkMode)} title="Cambiar tema">
            {"⚙️"}
          </button>
          {user && (
            <span className="user-name">
              {user.nombre}
            </span>
          )}
        </div>
      </header>

      <main className="contenido">
        {activeSection === "inicio" && (
          <section id="inicio" className="seccion-activa">
            <h2 className="playlist-title">Playlists Populares</h2>
            <div className="playlists-grid">
              {playlists.map((pl, index) => (
                <div
                  key={index}
                  className="playlist-item"
                  style={{ backgroundImage: pl.gradient ? `${pl.gradient}, url(${pl.portada})` : `url(${pl.portada})` }}
                  role="button"
                  aria-label={`Reproducir ${pl.nombre}`}
                  tabIndex={0}
                  onClick={() => {
                    setPlaylistActiva(pl.nombre);
                    setCanciones(pl.canciones);
                    playSong(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setPlaylistActiva(pl.nombre);
                      setCanciones(pl.canciones);
                      playSong(0);
                    }
                  }}
                >
                  {/* Usamos la imagen como background (soporta links externos).
                      Eliminamos el <img> para evitar duplicados y que el link
                      se aplique directamente al contenedor circular.
                  */}
                  <button className="play-btn" aria-hidden="true">▶</button>
                  <span>{pl.nombre}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "buscar" && (
          <section id="buscar" className="seccion-activa buscadores">
            <h2>🔍 Buscador de Google</h2>
            <form
              id="googleForm"
              className="form-busqueda"
              action="https://www.google.com/search"
              method="GET"
              target="_blank"
            >
              <input
                id="googleInput"
                type="text"
                name="q"
                placeholder="Buscar en Google..."
                required
                className="input-busqueda"
              />
              <button type="submit" className="btn-buscar google-btn">Buscar</button>
            </form>

            <form
              id="youtubeForm"
              className="form-busqueda"
              action="https://www.youtube.com/results"
              method="get"
              target="_blank"
            >
              <input
                id="youtubeInput"
                type="text"
                name="search_query"
                placeholder="Buscar en YouTube..."
                required
                className="input-busqueda"
              />
              <button type="submit" className="btn-buscar youtube-btn">Buscar</button>
            </form>
          </section>
        )}

        {activeSection === "descargas" && (
          <section id="descargas" className="seccion-activa">
            <h2>Descargas</h2>
            <div id="cargaCanciones">
              <div className="descargas-acciones">
                <button className="boton-cargar boton-principal" onClick={() => {
                  const inp = document.querySelector('#cargaInput');
                  if (inp) inp.click();
                }}>
                  🎵 Cargar Canciones MP3
                </button>

                <a href="https://ytmp3.nu/" target="_blank" rel="noopener noreferrer" className="boton-principal">🎧 Convertir YouTube a MP3</a>

                <a href="https://www.snaptubeapp.com/" target="_blank" rel="noopener noreferrer" className="extra-btn">📂 Descargar SnapTube Android</a>

                <button className="boton-principal" onClick={() => alert('Funcionalidad de crear playlist en proceso')}>➕ Crear Playlist</button>
              </div>

              <input
                id="cargaInput"
                type="file"
                accept="audio/mp3"
                multiple
                hidden
                onChange={(e) => {
                  const archivos = Array.from(e.target.files);
                  const nuevas = archivos.map((file) => ({
                    nombre: file.name,
                    url: URL.createObjectURL(file),
                  }));
                  setCancionesLocales([...cancionesLocales, ...nuevas]);
                }}
              />
            </div>

            <ul id="listaMP3">
              <input
                type="text"
                className="barra-busqueda"
                placeholder="Buscar en canciones..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {cancionesLocales
                .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                .map((cancion, index) => (
                  <li key={index}>
                    <span onClick={() => {
                      setPlaylistActiva("Locales");
                      setCanciones(cancionesLocales.map((c) => c.url));
                      playSong(index);
                    }}
                    >
                      🎵 {cancion.nombre}
                    </span>
                    <button
                      className="btn-eliminar"
                      onClick={() =>
                        setCancionesLocales(cancionesLocales.filter((_, i) => i !== index))
                      }
                    >
                      🗑
                    </button>
                  </li>
                ))}
              {cancionesLocales.length === 0 && <li>No hay canciones cargadas</li>}
            </ul>
          </section>
        )}

        {activeSection === "chats" && (
          <section id="chats" className="seccion-activa">
            <h2>Chats</h2>
            <div className="chat-container">
              <div className="chat-list">
                <div className="chat-user" onClick={() => setActiveUser("Pipi")}><span>usuario1</span></div>
                <div className="chat-user" onClick={() => setActiveUser("Lucho")}><span>usuario2</span></div>
              </div>

              <div className="chat-window">
                <div className="chat-header">
                  {activeUser ? `Chat con ${activeUser}` : "Elegí un chat"}
                </div>

                <div className="chat-messages">
                  {messages
                    .filter(
                      (msg) =>
                        (activeUser === "Pipi" && (msg.sender === "Pipi" || msg.sender === "Lucho")) ||
                        (activeUser === "Lucho" && (msg.sender === "Pipi" || msg.sender === "Lucho"))
                    )
                    .map((msg, i) => (
                      <div
                        key={i}
                        className={`msg ${msg.sender === activeUser ? "own" : "other"}`}
                      >
                        {msg.text}
                      </div>
                    ))}
                </div>

                {activeUser && (
                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Escribí un mensaje..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const text = e.target.value.trim();
                          if (text) {
                            setMessages([...messages, { sender: activeUser, text }]);
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector(".chat-input input");
                        if (input && input.value.trim() !== "") {
                          setMessages([...messages, { sender: activeUser, text: input.value }]);
                          input.value = "";
                        }
                      }}
                    >
                      ➤
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === "perfil" && (
          <section id="perfil" className="seccion-activa">
            <h2>{user ? 'Mi Perfil' : 'Acceder'}</h2>
            {!user ? (
              <Auth onLogin={setUser} />
            ) : (
              <div className="perfil-container">
                <div className="perfil-info">
                  <h3>Bienvenido, {user.nombre}</h3>
                  <button 
                    className="btn-buscar"
                    onClick={() => {
                      fetch('http://localhost:4000/api/logout', {
                        method: 'POST',
                        credentials: 'include'
                      })
                      .then(() => setUser(null));
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </div>
                
                <div className="playlists-personales">
                  <h3>Mis Playlists</h3>
                  <button 
                    className="extra-btn"
                    onClick={() => {
                      const nombre = prompt('Nombre de la nueva playlist:');
                      if (nombre) {
                        // Aquí irá la lógica para crear playlist
                      }
                    }}
                  >
                    Crear Nueva Playlist
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {activeSection === "ecualizador" && (
          <section id="ecualizador" className="seccion-activa">
            <h2>Ecualizador</h2>

            <div className="ecualizador-controles">
              <div className="control-ecualizador">
                <label htmlFor="bass">Bajos (60Hz)</label>
                <input
                  id="bass"
                  type="range"
                  min="-30"
                  max="30"
                  value={bass}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setBass(v);
                    if (bassRef.current) bassRef.current.gain.value = v;
                  }}
                />
              </div>

              <div className="control-ecualizador">
                <label htmlFor="mid">Medios (1kHz)</label>
                <input
                  id="mid"
                  type="range"
                  min="-30"
                  max="30"
                  value={mid}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setMid(v);
                    if (midRef.current) midRef.current.gain.value = v;
                  }}
                />
              </div>

              <div className="control-ecualizador">
                <label htmlFor="treble">Agudos (12kHz)</label>
                <input
                  id="treble"
                  type="range"
                  min="-30"
                  max="30"
                  value={treble}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setTreble(v);
                    if (trebleRef.current) trebleRef.current.gain.value = v;
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {playlistActiva && (
        <div className={`mini-reproductor ${isReproductorMinimized ? 'minimized' : ''}`}>
          <div className="info">
            <strong>{playlistActiva}</strong>
            <span>{canciones[currentIndex]?.split("/").pop() || "Sin canción"}</span>
            <button className="toggle-minimize" onClick={() => setIsReproductorMinimized(!isReproductorMinimized)}>
              {isReproductorMinimized ? '🔼' : '🔽'}
            </button>
          </div>
          {!isReproductorMinimized && (
            <>
              <div ref={progressContainerRef} onClick={handleProgressClick} className="barra-progreso-container">
                <div ref={progressRef} className="barra-progreso"></div>
              </div>
              <div className="controles">
                <button onClick={() => setIsShuffle(!isShuffle)}>🔀</button>
                <button onClick={prevSong}>⏮️</button>
                <button onClick={togglePlay}>{isPlaying ? "⏸️" : "▶️"}</button>
                <button onClick={nextSong}>⏭️</button>
                <button onClick={() => setIsRepeat(!isRepeat)}>🔁</button>
                <div className="volume-control">
                  <button onClick={() => setVolume(volume === 0 ? 1 : 0)}>
                    {volume === 0 ? "🔇" : "🔊"}
                  </button>
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <nav className="botonera">
        <button className={`btn-nav ${activeSection === "inicio" ? "activo" : ""}`} onClick={() => setActiveSection("inicio")}>Inicio</button>
        <button className={`btn-nav ${activeSection === "buscar" ? "activo" : ""}`} onClick={() => setActiveSection("buscar")}>Buscar</button>
        <button className={`btn-nav ${activeSection === "descargas" ? "activo" : ""}`} onClick={() => setActiveSection("descargas")}>Descargas</button>
        <button className={`btn-nav ${activeSection === "chats" ? "activo" : ""}`} onClick={() => setActiveSection("chats")}>Chats</button>
        <button className={`btn-nav ${activeSection === "ecualizador" ? "activo" : ""}`} onClick={() => setActiveSection("ecualizador")}>Ecualizador</button>
        <button className={`btn-nav ${activeSection === "perfil" ? "activo" : ""}`} onClick={() => setActiveSection("perfil")}>
          {user ? '👤' : 'login'}
        </button>
      </nav>

      <audio ref={audioRef}></audio>
    </div>
  );
}