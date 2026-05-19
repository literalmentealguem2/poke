// ============================================================
//  PokéZap — Banco de Dados em Memória (JSON persistido)
// ============================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return { jogadores: {}, duelos: {} };
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")); }
  catch { return { jogadores: {}, duelos: {} }; }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// ── Jogador ─────────────────────────────────────────────────
export function getJogador(numero) {
  const db = loadDB();
  if (!db.jogadores[numero]) {
    db.jogadores[numero] = {
      numero,
      nome: numero,
      pokecoins: 500,
      bag: { pokebola: 5, pocao: 3 },
      time: [],          // até 6 pokémon
      caixas: [],        // pokémon extras
      insígnias: [],
      vitórias: 0,
      derrotas: 0,
      passos: 0,
      regiao: "kanto",
    };
    saveDB(db);
  }
  return db.jogadores[numero];
}

export function salvarJogador(jogador) {
  const db = loadDB();
  db.jogadores[jogador.numero] = jogador;
  saveDB(db);
}

// ── Duelos ───────────────────────────────────────────────────
export function getDuelo(id) {
  const db = loadDB();
  return db.duelos[id] || null;
}

export function salvarDuelo(id, duelo) {
  const db = loadDB();
  db.duelos[id] = duelo;
  saveDB(db);
}

export function removerDuelo(id) {
  const db = loadDB();
  delete db.duelos[id];
  saveDB(db);
}

export function listarJogadores() {
  const db = loadDB();
  return Object.values(db.jogadores);
}
