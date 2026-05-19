// ============================================================
//  PokéZap — Dados dos Pokémon
// ============================================================

export const OWNER_NUMBER = "5518991307363"; // Dono do bot

// Pokémon especiais restritos ao dono
export const RESTRICTED_POKEMON = ["arceus", "miauzapinho"];

export const POKEMONS = {
  // ── Geração 1 ──────────────────────────────────────────────
  bulbasaur:   { id: 1,   nome: "Bulbasaur",   tipo: ["Grama","Veneno"],   hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45, emoji: "🌿" },
  charmander:  { id: 4,   nome: "Charmander",  tipo: ["Fogo"],             hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65, emoji: "🔥" },
  squirtle:    { id: 7,   nome: "Squirtle",    tipo: ["Água"],             hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43, emoji: "💧" },
  pikachu:     { id: 25,  nome: "Pikachu",     tipo: ["Elétrico"],         hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90, emoji: "⚡" },
  mewtwo:      { id: 150, nome: "Mewtwo",      tipo: ["Psíquico"],         hp: 106,atk: 110,def: 90, spa: 154,spd: 90, spe: 130,emoji: "🔮" },
  mew:         { id: 151, nome: "Mew",         tipo: ["Psíquico"],         hp: 100,atk: 100,def: 100,spa: 100,spd: 100,spe: 100,emoji: "✨" },
  eevee:       { id: 133, nome: "Eevee",       tipo: ["Normal"],           hp: 55, atk: 55, def: 50, spa: 45, spd: 65, spe: 55, emoji: "🦊" },
  gengar:      { id: 94,  nome: "Gengar",      tipo: ["Fantasma","Veneno"],hp: 60, atk: 65, def: 60, spa: 130,spd: 75, spe: 110,emoji: "👻" },
  snorlax:     { id: 143, nome: "Snorlax",     tipo: ["Normal"],           hp: 160,atk: 110,def: 65, spa: 65, spd: 110,spe: 30, emoji: "😴" },
  charizard:   { id: 6,   nome: "Charizard",   tipo: ["Fogo","Voador"],    hp: 78, atk: 84, def: 78, spa: 109,spd: 85, spe: 100,emoji: "🐉" },
  blastoise:   { id: 9,   nome: "Blastoise",   tipo: ["Água"],             hp: 79, atk: 83, def: 100,spa: 85, spd: 105,spe: 78, emoji: "🐢" },
  venusaur:    { id: 3,   nome: "Venusaur",    tipo: ["Grama","Veneno"],   hp: 80, atk: 82, def: 83, spa: 100,spd: 100,spe: 80, emoji: "🌺" },

  // ── Geração 2 ──────────────────────────────────────────────
  chikorita:   { id: 152, nome: "Chikorita",   tipo: ["Grama"],            hp: 45, atk: 49, def: 65, spa: 49, spd: 65, spe: 45, emoji: "🌱" },
  cyndaquil:   { id: 155, nome: "Cyndaquil",   tipo: ["Fogo"],             hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65, emoji: "🦔" },
  totodile:    { id: 158, nome: "Totodile",    tipo: ["Água"],             hp: 50, atk: 65, def: 64, spa: 44, spd: 48, spe: 43, emoji: "🐊" },
  lugia:       { id: 249, nome: "Lugia",       tipo: ["Psíquico","Voador"],hp: 106,atk: 90, def: 130,spa: 90, spd: 154,spe: 110,emoji: "🌊" },
  hooh:        { id: 250, nome: "Ho-Oh",       tipo: ["Fogo","Voador"],    hp: 106,atk: 130,def: 90, spa: 110,spd: 154,spe: 90, emoji: "🌈" },
  umbreon:     { id: 197, nome: "Umbreon",     tipo: ["Sombrio"],          hp: 95, atk: 65, def: 110,spa: 60, spd: 130,spe: 65, emoji: "🌑" },
  espeon:      { id: 196, nome: "Espeon",      tipo: ["Psíquico"],         hp: 65, atk: 65, def: 60, spa: 130,spd: 95, spe: 110,emoji: "🌸" },

  // ── Geração 3 ──────────────────────────────────────────────
  treecko:     { id: 252, nome: "Treecko",     tipo: ["Grama"],            hp: 40, atk: 45, def: 35, spa: 65, spd: 55, spe: 70, emoji: "🦎" },
  torchic:     { id: 255, nome: "Torchic",     tipo: ["Fogo"],             hp: 45, atk: 60, def: 40, spa: 70, spd: 50, spe: 45, emoji: "🐥" },
  mudkip:      { id: 258, nome: "Mudkip",      tipo: ["Água"],             hp: 50, atk: 70, def: 50, spa: 50, spd: 50, spe: 40, emoji: "🐸" },
  gardevoir:   { id: 282, nome: "Gardevoir",   tipo: ["Psíquico","Fada"],  hp: 68, atk: 65, def: 65, spa: 125,spd: 115,spe: 80, emoji: "👗" },
  rayquaza:    { id: 384, nome: "Rayquaza",    tipo: ["Dragão","Voador"],  hp: 105,atk: 150,def: 90, spa: 150,spd: 90, spe: 95, emoji: "🌀" },
  lucario:     { id: 448, nome: "Lucario",     tipo: ["Lutador","Aço"],    hp: 70, atk: 110,def: 70, spa: 115,spd: 70, spe: 90, emoji: "🐺" },

  // ── Geração 4 ──────────────────────────────────────────────
  turtwig:     { id: 387, nome: "Turtwig",     tipo: ["Grama"],            hp: 55, atk: 68, def: 64, spa: 45, spd: 55, spe: 31, emoji: "🐢" },
  chimchar:    { id: 390, nome: "Chimchar",    tipo: ["Fogo"],             hp: 44, atk: 58, def: 44, spa: 58, spd: 44, spe: 61, emoji: "🐒" },
  piplup:      { id: 393, nome: "Piplup",      tipo: ["Água"],             hp: 53, atk: 51, def: 53, spa: 61, spd: 56, spe: 40, emoji: "🐧" },
  dialga:      { id: 483, nome: "Dialga",      tipo: ["Aço","Dragão"],     hp: 100,atk: 120,def: 120,spa: 150,spd: 100,spe: 90, emoji: "⏳" },
  palkia:      { id: 484, nome: "Palkia",      tipo: ["Água","Dragão"],    hp: 90, atk: 120,def: 100,spa: 150,spd: 120,spe: 100,emoji: "🌌" },
  giratina:    { id: 487, nome: "Giratina",    tipo: ["Fantasma","Dragão"],hp: 150,atk: 100,def: 120,spa: 100,spd: 120,spe: 90, emoji: "👁️" },

  // ── ARCEUS — Apenas o dono pode dar/usar ───────────────────
  arceus: {
    id: 493,
    nome: "Arceus",
    tipo: ["Normal"],
    hp: 999999,
    atk: 999999,
    def: 999999,
    spa: 999999,
    spd: 999999,
    spe: 999999,
    emoji: "🌟",
    especial: true,
    descricao: "O Deus Pokémon. Criador de todos os universos. Dano INFINITO — invencível em batalha!",
    restrito: true,
    danoinfinito: true,
  },

  // ── MIAUZAPINHO — Pokémon exclusivo do bot ─────────────────
  miauzapinho: {
    id: 9999,
    nome: "MiauZapinho",
    tipo: ["Normal", "Fantasma"],
    hp: 500,
    atk: 420,
    def: 380,
    spa: 450,
    spd: 360,
    spe: 480,
    emoji: "🐱",
    especial: true,
    descricao: "O gato verde do WhatsApp! Nascido nas profundezas do Zap, é absurdamente forte e rarísimo. Apenas o dono do bot pode tê-lo ou concedê-lo!",
    restrito: true,
    danoinfinito: false,
    golpes_exclusivos: ["MiauRelâmpago", "ZapGarra", "FantasmaVerde", "PataDoInfinito"],
    lore: "Conta a lenda que MiauZapinho surgiu no dia em que o primeiro WhatsApp foi enviado. Desde então, vaga pelo mundo digital, guardando mensagens perdidas e atormentando spam.",
  },
};

// Golpes disponíveis por tipo
export const GOLPES = {
  Fogo:     ["Lança-Chamas", "Investida de Fogo", "Explosão Solar", "Rajada Ígnea"],
  Água:     ["Hidrobomba", "Surfar", "Cachoeira", "Bolhas D'água"],
  Grama:    ["Raio Solar", "Folha Navalha", "Liofilização", "Pétala Dança"],
  Elétrico: ["Trovão", "Eletrobola", "Descarga", "Zap Selvagem"],
  Psíquico: ["Psíquico", "Futuro Ataque", "Troca Poder", "Confusão Mental"],
  Normal:   ["Investida", "Hiper Raio", "Explosão", "Golpe Duplo"],
  Fantasma: ["Bola-Sombra", "Perseguição", "Golpe Fantasma", "Noite Sombria"],
  Dragão:   ["Garra Dragão", "Pulso Dragão", "Dança Dragão", "Raiva Dracônica"],
  Lutador:  ["Soco de Aura", "Chute de Karatê", "Chute Baixo", "Rajada de Punhos"],
  Aço:      ["Garra Metal", "Meteoro Ferro", "Voz Metálica", "Cabeçada de Ferro"],
  Sombrio:  ["Mordida", "Crunch", "Ataque Rascante", "Golpe Sombrio"],
  Voador:   ["Voar", "Ráfaga Aérea", "Picada", "Asa de Aço"],
  Veneno:   ["Ácido", "Gás Venenoso", "Bomba de Sludge", "Tóxico"],
  Fada:     ["Voz Encantada", "Moonblast", "Pisada de Fada", "Pó de Fada"],
  Gelo:     ["Feixe de Gelo", "Bola de Neve", "Ventania Gelada", "Nevasca"],
  Pedra:    ["Lança-Pedras", "Enrolar", "Avalanche", "Escorregão de Pedra"],
  Terra:    ["Terremoto", "Escavação", "Furacão de Areia", "Ataque de Lama"],
  Inseto:   ["Mordida de Bug", "Furo de Bug", "Frenesi de Bug", "Canção Prateada"],
};

// Itens do jogo
export const ITENS = {
  pokebola:     { nome: "Poké Bola",      emoji: "⚪", taxa: 0.30, preco: 100 },
  superbola:    { nome: "Super Bola",     emoji: "🔵", taxa: 0.50, preco: 300 },
  ultrabola:    { nome: "Ultra Bola",     emoji: "🟡", taxa: 0.75, preco: 600 },
  masterbola:   { nome: "Master Bola",    emoji: "🟣", taxa: 1.00, preco: 99999 },
  pocao:        { nome: "Poção",          emoji: "💊", cura: 20,   preco: 150 },
  superpocao:   { nome: "Super Poção",    emoji: "💉", cura: 50,   preco: 400 },
  hiperpocao:   { nome: "Hiper Poção",    emoji: "🧪", cura: 200,  preco: 1200 },
  pocaomaxima:  { nome: "Poção Máxima",   emoji: "🏺", cura: 9999, preco: 4500 },
  escapecorda:  { nome: "Corda de Fuga",  emoji: "🪢", preco: 200 },
  incenso:      { nome: "Incenso",        emoji: "🕯️", raro: true, preco: 2000 },
};

// Regiões onde pokémon selvagens aparecem
export const REGIOES = {
  kanto:   { nome: "Kanto",   emoji: "🗾", pokemon: ["bulbasaur","charmander","squirtle","pikachu","eevee","gengar","snorlax","mewtwo","mew"] },
  johto:   { nome: "Johto",   emoji: "🌄", pokemon: ["chikorita","cyndaquil","totodile","lugia","hooh","umbreon","espeon"] },
  hoenn:   { nome: "Hoenn",   emoji: "🏝️", pokemon: ["treecko","torchic","mudkip","gardevoir","rayquaza"] },
  sinnoh:  { nome: "Sinnoh",  emoji: "⛰️", pokemon: ["turtwig","chimchar","piplup","dialga","palkia","giratina","lucario"] },
};
