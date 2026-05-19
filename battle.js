// ============================================================
//  PokéZap — Motor de Batalha
// ============================================================

import { POKEMONS, GOLPES, OWNER_NUMBER } from "./pokemon.js";

// Cria uma instância de batalha de um pokémon do time
export function criarInstancia(pkmEntry) {
  const base = POKEMONS[pkmEntry.id];
  if (!base) return null;
  return {
    id: pkmEntry.id,
    nome: base.nome,
    emoji: base.emoji,
    nivel: pkmEntry.nivel || 1,
    hpMax: base.hp + pkmEntry.nivel * 3,
    hpAtual: pkmEntry.hpAtual ?? (base.hp + pkmEntry.nivel * 3),
    atk: base.atk + Math.floor(pkmEntry.nivel * 1.5),
    def: base.def + Math.floor(pkmEntry.nivel * 1.2),
    tipo: base.tipo,
    danoinfinito: base.danoinfinito || false,
    golpes: obterGolpes(base),
  };
}

export function obterGolpes(base) {
  const todos = [];
  base.tipo.forEach((t) => {
    const lista = GOLPES[t] || [];
    todos.push(...lista.slice(0, 2));
  });
  // Golpes exclusivos do MiauZapinho
  if (base.golpes_exclusivos) todos.push(...base.golpes_exclusivos);
  return todos.slice(0, 4);
}

// Calcula dano de um ataque
export function calcularDano(atacante, defensor, golpeNome) {
  if (atacante.danoinfinito) return 999999; // Arceus: dano infinito

  const base = atacante.atk * 2;
  const variacao = 0.85 + Math.random() * 0.15;
  const critico = Math.random() < 0.1 ? 1.5 : 1;
  const dano = Math.max(1, Math.floor((base / defensor.def) * variacao * critico));
  return { dano, critico: critico > 1 };
}

// Verifica se um pokémon está fainted
export function estaFainted(pkm) {
  return pkm.hpAtual <= 0;
}

// Formata barra de HP visual
export function barraHP(atual, max) {
  const pct = Math.max(0, Math.min(1, atual / max));
  const total = 10;
  const cheios = Math.round(pct * total);
  const emoji = pct > 0.5 ? "🟩" : pct > 0.2 ? "🟨" : "🟥";
  return emoji.repeat(cheios) + "⬛".repeat(total - cheios) + ` ${atual}/${max}`;
}

// Ganha XP e sobe de nível
export function ganharXP(pkmEntry, xpGanho) {
  if (!pkmEntry.xp) pkmEntry.xp = 0;
  pkmEntry.xp += xpGanho;
  const xpProximo = pkmEntry.nivel * 100;
  let subiu = false;
  while (pkmEntry.xp >= xpProximo) {
    pkmEntry.xp -= xpProximo;
    pkmEntry.nivel = (pkmEntry.nivel || 1) + 1;
    subiu = true;
  }
  // Restaura um pouco de HP após subir de nível
  if (subiu) pkmEntry.hpAtual = undefined;
  return subiu;
}
