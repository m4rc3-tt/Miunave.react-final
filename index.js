const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = '7d';

// Almacenamiento en memoria
const db = {
  users: [],
  playlists: [],
  playlistSongs: []
};

// Funciones auxiliares para el almacenamiento en memoria
const findUserByEmail = (email) => db.users.find(u => u.email === email);
const createUser = (userData) => {
  const id = Date.now();
  const user = { ...userData, id, created_at: new Date().toISOString() };
  db.users.push(user);
  return user;
};
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id INTEGER NOT NULL,
  song_path TEXT NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(playlist_id) REFERENCES playlists(id),
  PRIMARY KEY(playlist_id, song_path)
)`).run();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Puerto de Vite
  credentials: true
}));

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Rutas de autenticación
app.post('/api/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)')
      .run(nombre, email, hashedPassword);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(400).json({ message: 'Error al registrar usuario' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al iniciar sesión' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada' });
});

// Rutas de playlists
app.get('/api/playlists', authMiddleware, (req, res) => {
  try {
    const playlists = db.prepare(`
      SELECT p.*, COUNT(ps.song_path) as song_count 
      FROM playlists p 
      LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
      WHERE p.user_id = ?
      GROUP BY p.id
    `).all(req.user.id);
    
    res.json({ playlists });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener playlists' });
  }
});

app.post('/api/playlists', authMiddleware, (req, res) => {
  const { nombre } = req.body;
  try {
    const result = db.prepare(
      'INSERT INTO playlists (nombre, user_id) VALUES (?, ?)'
    ).run(nombre, req.user.id);
    
    res.status(201).json({ 
      playlist: {
        id: result.lastInsertRowid,
        nombre,
        user_id: req.user.id,
        song_count: 0
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Error al crear playlist' });
  }
});

app.post('/api/playlists/:id/songs', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { songPath } = req.body;

  try {
    // Verificar que la playlist pertenezca al usuario
    const playlist = db.prepare(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?'
    ).get(id, req.user.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    db.prepare(
      'INSERT OR IGNORE INTO playlist_songs (playlist_id, song_path) VALUES (?, ?)'
    ).run(id, songPath);

    res.status(201).json({ message: 'Canción agregada' });
  } catch (err) {
    res.status(400).json({ message: 'Error al agregar canción' });
  }
});

app.get('/api/playlists/:id/songs', authMiddleware, (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que la playlist pertenezca al usuario
    const playlist = db.prepare(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?'
    ).get(id, req.user.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    const songs = db.prepare(
      'SELECT song_path FROM playlist_songs WHERE playlist_id = ?'
    ).all(id);

    res.json({ songs: songs.map(s => s.song_path) });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener canciones' });
  }
});

app.delete('/api/playlists/:playlistId/songs/:songPath', authMiddleware, (req, res) => {
  const { playlistId, songPath } = req.params;

  try {
    // Verificar que la playlist pertenezca al usuario
    const playlist = db.prepare(
      'SELECT * FROM playlists WHERE id = ? AND user_id = ?'
    ).get(playlistId, req.user.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist no encontrada' });
    }

    db.prepare(
      'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_path = ?'
    ).run(playlistId, songPath);

    res.json({ message: 'Canción eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar canción' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});