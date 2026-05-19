// ============================================================
//  PokéZap — Handler de Comandos (Versão Corrigida para Nuvem)
// ============================================================

import { POKEMONS, ITENS, REGIOES, OWNER_NUMBER, RESTRICTED_POKEMON } from "./pokemon.js";
import { getJogador, salvarJogador, getDuelo, salvarDuelo, removerDuelo, listarJogadores } from "./db.js";
import { criarInstancia, calcularDano, barraHP, ganharXP, estaFainted, obterGolpes } from "./battle.js";
import fs from "fs";

// ── Utilitários ──────────────────────────────────────────────
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmt  = (n) => n.toLocaleString("pt-BR");

// Define dinamicamente onde o banco está rodando
const getDbPath = () => fs.existsSync("./data") ? "./data/db.json" : "./db.json";

function isOwner(numero) {
  return numero.replace(/\D/g, "") === OWNER_NUMBER.replace(/\D/g, "");
}

function nomePokemon(id) {
  return POKEMONS[id]?.nome || id;
}

function emojiPokemon(id) {
  return POKEMONS[id]?.emoji || "❓";
}

function pokemonDisponivel(id, numero) {
  const pkm = POKEMONS[id];
  if (!pkm) return false;
  if (pkm.restrito && !isOwner(numero)) return false;
  return true;
}

// ── Encontrar pokémon selvagem ────────────────────────────────
function sortearSelvagem(regiao) {
  const reg = REGIOES[regiao] || REGIOES["kanto"];
  const lista = reg.pokemon.filter((p) => !POKEMONS[p]?.restrito);
  const id = rand(lista);
  const pkm = POKEMONS[id];
  const nivel = Math.floor(Math.random() * 20) + 1;
  return { id, nivel, hpAtual: undefined, xp: 0 };
}

// ─────────────────────────────────────────────────────────────
//  COMANDOS
// ─────────────────────────────────────────────────────────────

export async function handleCommand(sock, msg, from, numero, texto) {
  const jogador = getJogador(numero);
  const args = texto.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();

  // ── !start / !ajuda ──────────────────────────────────────
  if (cmd === "!start" || cmd === "!menu" || cmd === "!ajuda") {
    return sock.sendMessage(from, {
      text: `
╔══════════════════════════╗
║    🌟  *PokéZap Bot* 🌟    ║
╚══════════════════════════╝

Bem-vindo ao mundo Pokémon no WhatsApp!

*🎮 JOGO*
• !iniciar — Crie seu perfil
• !perfil — Veja seus dados
• !time — Veja seu time
• !explorar — Encontre pokémon selvagem
• !capturar <bola> — Capture o selvagem
• !fugir — Fuja do encontro

*⚔️ BATALHA*
• !duelo @user — Desafie alguém
• !aceitar — Aceite um duelo
• !atacar <golpe> — Ataque no duelo
• !trocar <nº> — Troque de pokémon

*🛒 LOJA*
• !loja — Veja itens disponíveis
• !comprar <item> — Compre um item
• !bag — Veja sua bag

*📊 POKÉDEX*
• !pokedex — Pokédex completa
• !info <pokemon> — Info de um pokémon
• !ranking — Top treinadores

*✨ ESPECIAL (apenas dono)*
• !dar <@user> <pokemon> — Dê um pokémon especial
• !pokecoins <@user> <qtd> — Dê PokeCoins

_Região atual: ${REGIOES[jogador.regiao]?.emoji} ${REGIOES[jogador.regiao]?.nome}_
_PokeCoins: ${fmt(jogador.pokecoins)} 💰_
`.trim(),
    });
  }

  // ── !iniciar ─────────────────────────────────────────────
  if (cmd === "!iniciar") {
    if (jogador.time.length > 0) {
      return sock.sendMessage(from, { text: "Você já tem um perfil! Use *!perfil* para ver seus dados. 😊" });
    }
    const iniciantes = ["bulbasaur", "charmander", "squirtle"];
    const escolhido = iniciantes[Math.floor(Math.random() * 3)];
    const pkm = POKEMONS[escolhido];
    jogador.time.push({ id: escolhido, nivel: 5, xp: 0, hpAtual: undefined });
    salvarJogador(jogador);
    return sock.sendMessage(from, {
      text: `
🎉 *Bem-vindo ao mundo Pokémon!*

Você recebeu um Pokémon inicial:

${pkm.emoji} *${pkm.nome}* — Nível 5
Tipo: ${pkm.tipo.join(" / ")}

Você também ganhou *500 PokéCoins* e *5 Poké Bolas*!

Use *!explorar* para encontrar pokémon selvagens.
Use *!ajuda* para ver todos os comandos.

_Boa sorte, Treinador!_ 🌟
`.trim(),
    });
  }

  // ── !perfil ───────────────────────────────────────────────
  if (cmd === "!perfil") {
    const alvo = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
      ? msg.message.extendedTextMessage.contextInfo.mentionedJid[0].split("@")[0]
      : numero;
    const j = getJogador(alvo);
    const timeStr = j.time.length
      ? j.time.map((p, i) => `  Scale: ${i + 1}. ${emojiPokemon(p.id)} ${nomePokemon(p.id)} (Nv.${p.nivel})`).join("\n")
      : "  Nenhum pokémon ainda";

    return sock.sendMessage(from, {
      text: `
👤 *Perfil do Treinador*
━━━━━━━━━━━━━━━━━
📱 Número: ${alvo}
💰 PokeCoins: ${fmt(j.pokecoins)}
🏆 Vitórias: ${j.vitórias} | Derrotas: ${j.derrotas}
🗺️ Região: ${REGIOES[j.regiao]?.emoji} ${REGIOES[j.regiao]?.nome}
🎖️ Insígnias: ${j.insígnias.length || 0}/8

*🐾 Time:*
${timeStr}
`.trim(),
    });
  }

  // ── !time ─────────────────────────────────────────────────
  if (cmd === "!time") {
    if (!jogador.time.length) {
      return sock.sendMessage(from, { text: "Você não tem pokémon no time! Use *!iniciar*." });
    }
    let txt = "🐾 *Seu Time Pokémon*\n━━━━━━━━━━━━━━\n";
    jogador.time.forEach((p, i) => {
      const base = POKEMONS[p.id];
      const inst = criarInstancia(p);
      txt += `\n${i + 1}. ${base.emoji} *${base.nome}* | Nv.${p.nivel} | XP: ${p.xp || 0}/${p.nivel * 100}\n`;
      txt += `   HP: ${barraHP(inst.hpAtual, inst.hpMax)}\n`;
      txt += `   Tipo: ${base.tipo.join(" / ")}\n`;
    });
    return sock.sendMessage(from, { text: txt });
  }

  // ── !explorar ─────────────────────────────────────────────
  if (cmd === "!explorar") {
    if (!jogador.time.length) return sock.sendMessage(from, { text: "Use *!iniciar* primeiro!" });
    if (jogador._selvagem) return sock.sendMessage(from, { text: "Há um pokémon selvagem na sua frente! Use *!capturar* ou *!fugir*." });

    const s = sortearSelvagem(jogador.regiao);
    const base = POKEMONS[s.id];
    const inst = criarInstancia(s);
    jogador._selvagem = s;
    salvarJogador(jogador);

    return sock.sendMessage(from, {
      text: `
🌿 *Um Pokémon selvagem apareceu!*

${base.emoji} *${base.nome}* — Nível ${s.nivel}
Tipo: ${base.tipo.join(" / ")}
HP: ${barraHP(inst.hpMax, inst.hpMax)}

Use *!capturar <bola>* para tentar capturar!
Use *!fugir* para escapar.

_Suas Poké Bolas: ${jogador.bag.pokebola || 0} ⚪ | ${jogador.bag.superbola || 0} 🔵 | ${jogador.bag.ultrabola || 0} 🟡_
`.trim(),
    });
  }

  // ── !capturar ─────────────────────────────────────────────
  if (cmd === "!capturar") {
    if (!jogador._selvagem) return sock.sendMessage(from, { text: "Não há pokémon selvagem! Use *!explorar*." });
    const bolaNome = args[1]?.toLowerCase() || "pokebola";
    const bola = ITENS[bolaNome];
    if (!bola || !bola.taxa) return sock.sendMessage(from, { text: `Bola inválida! Tente: pokebola, superbola, ultrabola, masterbola.` });
    if (!(jogador.bag[bolaNome] > 0)) return sock.sendMessage(from, { text: `Você não tem ${bola.nome}! Compre na *!loja*.` });

    jogador.bag[bolaNome]--;
    const s = jogador._selvagem;
    const base = POKEMONS[s.id];
    const sucesso = Math.random() < bola.taxa;

    if (sucesso) {
      if (jogador.time.length < 6) {
        jogador.time.push({ id: s.id, nivel: s.nivel, xp: 0, hpAtual: undefined });
      } else {
        jogador.caixas.push({ id: s.id, nivel: s.nivel, xp: 0, hpAtual: undefined });
      }
      jogador._selvagem = null;
      salvarJogador(jogador);
      return sock.sendMessage(from, {
        text: `✅ *Capturado!*\n\n${base.emoji} *${base.nome}* foi capturado com ${bola.emoji} ${bola.nome}!\n\n${jogador.time.length >= 6 ? "_(Enviado para a Caixa pois seu time está cheio)_" : "_(Adicionado ao seu time!)_"}`,
      });
    } else {
      jogador._selvagem = null;
      salvarJogador(jogador);
      return sock.sendMessage(from, { text: `❌ *Falhou!* ${base.nome} fugiu!\n\n${bola.emoji} Você usou ${bola.nome} em vão...` });
    }
  }

  // ── !fugir ────────────────────────────────────────────────
  if (cmd === "!fugir") {
    if (!jogador._selvagem) return sock.sendMessage(from, { text: "Não há nenhum pokémon selvagem." });
    const base = POKEMONS[jogador._selvagem.id];
    jogador._selvagem = null;
    salvarJogador(jogador);
    return sock.sendMessage(from, { text: `🏃 Você fugiu do ${base.emoji} *${base.nome}*!` });
  }

  // ── !loja ─────────────────────────────────────────────────
  if (cmd === "!loja") {
    let txt = "🛒 *Loja Pokémon*\n━━━━━━━━━━━━\n";
    for (const [key, item] of Object.entries(ITENS)) {
      if (item.preco >= 99999) continue;
      txt += `\n${item.emoji} *${item.nome}* — 💰 ${fmt(item.preco)}\n  _!comprar ${key}_\n`;
    }
    txt += `\n💰 Seu saldo: ${fmt(jogador.pokecoins)} PokéCoins`;
    return sock.sendMessage(from, { text: txt });
  }

  // ── !comprar ──────────────────────────────────────────────
  if (cmd === "!comprar") {
    const chave = args[1]?.toLowerCase();
    const item = ITENS[chave];
    if (!item) return sock.sendMessage(from, { text: "Item não encontrado! Use *!loja* para ver os itens disponíveis." });
    if (item.preco >= 99999) return sock.sendMessage(from, { text: "Este item não pode ser comprado na loja!" });
    if (jogador.pokecoins < item.preco) return sock.sendMessage(from, { text: `❌ PokéCoins insuficientes! Você tem ${fmt(jogador.pokecoins)} e precisa de ${fmt(item.preco)}.` });

    jogador.pokecoins -= item.preco;
    jogador.bag[chave] = (jogador.bag[chave] || 0) + 1;
    salvarJogador(jogador);
    return sock.sendMessage(from, { text: `✅ Você comprou ${item.emoji} *${item.nome}*!\n💰 Saldo restante: ${fmt(jogador.pokecoins)}` });
  }

  // ── !bag ──────────────────────────────────────────────────
  if (cmd === "!bag") {
    const itens = Object.entries(jogador.bag).filter(([, v]) => v > 0);
    if (!itens.length) return sock.sendMessage(from, { text: "Sua bag está vazia! Use *!loja* para comprar itens." });
    let txt = "🎒 *Sua Bag*\n━━━━━━━━━━\n";
    itens.forEach(([k, v]) => {
      const it = ITENS[k];
      txt += `\n${it?.emoji || "❓"} ${it?.nome || k}: ${v}x`;
    });
    return sock.sendMessage(from, { text: txt });
  }

  // ── !info <pokemon> ───────────────────────────────────────
  if (cmd === "!info") {
    const nomeBusca = args[1]?.toLowerCase();
    const pkm = POKEMONS[nomeBusca];
    if (!pkm) return sock.sendMessage(from, { text: "Pokémon não encontrado! Use *!pokedex* para ver todos." });
    if (pkm.restrito && !isOwner(numero)) {
      return sock.sendMessage(from, { text: `${pkm.emoji} *${pkm.nome}* é um Pokémon extremamente secreto e restrito. 🔒` });
    }
    const golpes = obterGolpes(pkm);
    return sock.sendMessage(from, {
      text: `
${pkm.emoji} *${pkm.nome}* — Nº ${pkm.id}
━━━━━━━━━━━━━━━━━
🏷️ Tipo: ${pkm.tipo.join(" / ")}
❤️ HP:  ${pkm.danoinfinito ? "∞" : pkm.hp}
⚔️ ATK: ${pkm.danoinfinito ? "∞" : pkm.atk}
🛡️ DEF: ${pkm.danoinfinito ? "∞" : pkm.def}
✨ SPA: ${pkm.danoinfinito ? "∞" : pkm.spa}
🌀 SPD: ${pkm.danoinfinito ? "∞" : pkm.spd}
💨 SPE: ${pkm.danoinfinito ? "∞" : pkm.spe}

💥 Golpes: ${golpes.join(", ")}

${pkm.descricao ? `📖 _${pkm.descricao}_` : ""}
${pkm.lore ? `\n📜 *Lore:* _${pkm.lore}_` : ""}
${pkm.restrito ? "\n🔐 *RESTRITO — Apenas o dono do bot pode ter este Pokémon!*" : ""}
`.trim(),
    });
  }

  // ── !pokedex ──────────────────────────────────────────────
  if (cmd === "!pokedex") {
    const meuIds = new Set([...jogador.time.map((p) => p.id), ...jogador.caixas.map((p) => p.id)]);
    let txt = "📖 *PokéDex PokéZap*\n━━━━━━━━━━━━━━\n";
    const publicos = Object.entries(POKEMONS).filter(([, p]) => !p.restrito);
    publicos.forEach(([id, pkm]) => {
      const visto = meuIds.has(id);
      txt += `\n${pkm.emoji} ${visto ? `*${pkm.nome}*` : `???`} (#${pkm.id}) ${visto ? "✅" : "⬜"}`;
    });
    txt += `\n\n_Capturados: ${[...meuIds].filter((id) => !POKEMONS[id]?.restrito).length}/${publicos.length}_`;
    return sock.sendMessage(from, { text: txt });
  }

  // ── !ranking ──────────────────────────────────────────────
  if (cmd === "!ranking") {
    const todos = listarJogadores()
      .filter((j) => j.vitórias > 0 || j.time.length > 0)
      .sort((a, b) => b.vitórias - a.vitórias)
      .slice(0, 10);

    let txt = "🏆 *Ranking de Treinadores*\n━━━━━━━━━━━━━━━━\n";
    const medalhas = ["🥇", "🥈", "🥉"];
    todos.forEach((j, i) => {
      const pkm = j.time[0] ? `${emojiPokemon(j.time[0].id)}` : "❓";
      txt += `\n${medalhas[i] || `${i + 1}.`} ${pkm} ${j.numero} — ${j.vitórias}V/${j.derrotas}D`;
    });
    if (!todos.length) txt += "\nAinda não há treinadores ranqueados!";
    return sock.sendMessage(from, { text: txt });
  }

  // ── !duelo @user ──────────────────────────────────────────
  if (cmd === "!duelo") {
    if (!jogador.time.length) return sock.sendMessage(from, { text: "Você precisa ter pokémon para duelar!" });
    const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mencionado) return sock.sendMessage(from, { text: "Mencione um usuário! Ex: *!duelo @alguém*" });
    const alvoNum = mencionado.split("@")[0];
    const alvo = getJogador(alvoNum);
    if (!alvo.time.length) return sock.sendMessage(from, { text: "Esse treinador não tem pokémon!" });
    const dueloId = [numero, alvoNum].sort().join("_");
    if (getDuelo(dueloId)) return sock.sendMessage(from, { text: "Já há um duelo pendente entre vocês!" });

    salvarDuelo(dueloId, {
      id: dueloId,
      desafiante: numero,
      desafiado: alvoNum,
      status: "pendente",
      turno: numero,
      pkm1: 0, pkm2: 0,
    });
    return sock.sendMessage(from, {
      text: `⚔️ @${numero} desafiou @${alvoNum} para um duelo Pokémon!\n\n@${alvoNum}, use *!aceitar* para aceitar o desafio!`,
      mentions: [mencionado, `${numero}@s.whatsapp.net`],
    });
  }

  // ── !aceitar ──────────────────────────────────────────────
  if (cmd === "!aceitar") {
    // Procura duelo onde o jogador é desafiado usando o caminho de banco correto
    const db = JSON.parse(fs.readFileSync(getDbPath(), "utf-8"));
    const duelo = Object.values(db.duelos || {}).find(
      (d) => d.desafiado === numero && d.status === "pendente"
    );
    if (!duelo) return sock.sendMessage(from, { text: "Não há desafio pendente para você!" });

    const j1 = getJogador(duelo.desafiante);
    const j2 = getJogador(duelo.desafiado);
    const p1 = criarInstancia(j1.time[0]);
    const p2 = criarInstancia(j2.time[0]);

    duelo.status = "ativo";
    duelo.hp1 = p1.hpMax;
    duelo.hp2 = p2.hpMax;
    salvarDuelo(duelo.id, duelo);

    return sock.sendMessage(from, {
      text: `
⚔️ *DUELO INICIADO!*
━━━━━━━━━━━━━━
@${duelo.desafiante}: ${p1.emoji} *${p1.nome}* (Nv.${j1.time[0].nivel})
HP: ${barraHP(p1.hpMax, p1.hpMax)}

VS

@${duelo.desafiado}: ${p2.emoji} *${p2.nome}* (Nv.${j2.time[0].nivel})
HP: ${barraHP(p2.hpMax, p2.hpMax)}

É o turno de @${duelo.turno}!
Use *!atacar <golpe>* para atacar.
Golpes disponíveis: ${p1.golpes.join(", ")}
`.trim(),
      mentions: [`${duelo.desafiante}@s.whatsapp.net`, `${duelo.desafiado}@s.whatsapp.net`],
    });
  }

  // ── !atacar ───────────────────────────────────────────────
  if (cmd === "!atacar") {
    let dueloBuscado = null;
    try {
      const db = JSON.parse(fs.readFileSync(getDbPath(), "utf-8"));
      dueloBuscado = Object.values(db.duelos || {}).find(
        (d) => d.status === "ativo" && (d.desafiante === numero || d.desafiado === numero) && d.turno === numero
      );
    } catch {}
    if (!dueloBuscado) return sock.sendMessage(from, { text: "Não é seu turno ou não há duelo ativo!" });

    const oponente = dueloBuscado.desafiante === numero ? dueloBuscado.desafiado : dueloBuscado.desafiante;
    const j1 = getJogador(numero);
    const j2 = getJogador(oponente);
    const at = criarInstancia(j1.time[dueloBuscado.desafiante === numero ? dueloBuscado.pkm1 : dueloBuscado.pkm2]);
    const def = criarInstancia(j2.time[dueloBuscado.desafiante === numero ? dueloBuscado.pkm2 : dueloBuscado.pkm1]);

    const golpe = args.slice(1).join(" ") || at.golpes[0];
    const { dano, critico } = calcularDano(at, def, golpe);

    if (dueloBuscado.desafiante === numero) {
      dueloBuscado.hp2 = Math.max(0, (dueloBuscado.hp2 || def.hpMax) - dano);
    } else {
      dueloBuscado.hp1 = Math.max(0, (dueloBuscado.hp1 || def.hpMax) - dano);
    }

    const hp1Atual = dueloBuscado.hp1 ?? at.hpMax;
    const hp2Atual = dueloBuscado.hp2 ?? def.hpMax;

    let txt = `
💥 *${at.emoji} ${at.nome}* usou *${golpe}*!
${critico ? "✨ *ACERTO CRÍTICO!*\n" : ""}Causou *${at.danoinfinito ? "∞" : dano}* de dano!

${at.emoji} ${at.nome}: ${barraHP(hp1Atual, at.hpMax)}
${def.emoji} ${def.nome}: ${barraHP(hp2Atual, def.hpMax)}
`.trim();

    const hpOponente = dueloBuscado.desafiante === numero ? dueloBuscado.hp2 : dueloBuscado.hp1;

    if (hpOponente <= 0) {
      j1.vitórias++;
      j2.derrotas++;
      const xpGanho = (j2.time[0]?.nivel || 1) * 50;
      ganharXP(j1.time[0], xpGanho);
      salvarJogador(j1);
      salvarJogador(j2);
      removerDuelo(dueloBuscado.id);
      txt += `\n\n🏆 *@${numero} VENCEU o duelo!*\n+${xpGanho} XP para ${at.nome}!`;
      return sock.sendMessage(from, { text: txt, mentions: [`${numero}@s.whatsapp.net`] });
    }

    dueloBuscado.turno = oponente;
    salvarDuelo(dueloBuscado.id, dueloBuscado);
    txt += `\n\nAgora é a vez de @${oponente}! Use *!atacar <golpe>*.`;
    return sock.sendMessage(from, { text: txt, mentions: [`${oponente}@s.whatsapp.net`] });
  }

  // ── !curar ────────────────────────────────────────────────
  if (cmd === "!curar") {
    const pocaoChave = args[1]?.toLowerCase() || "pocao";
    const pocao = ITENS[pocaoChave];
    if (!pocao?.cura) return sock.sendMessage(from, { text: "Item inválido para cura! Use: pocao, superpocao, hiperpocao, pocaomaxima." });
    if (!(jogador.bag[pocaoChave] > 0)) return sock.sendMessage(from, { text: `Você não tem ${pocao.nome}! Compre na *!loja*.` });

    const idx = parseInt(args[2]) - 1 || 0;
    const pkm = jogador.time[idx];
    if (!pkm) return sock.sendMessage(from, { text: "Pokémon não encontrado no seu time!" });
    const base = POKEMONS[pkm.id];
    const inst = criarInstancia(pkm);
    const hpAntes = pkm.hpAtual ?? inst.hpMax;
    pkm.hpAtual = Math.min(inst.hpMax, hpAntes + pocao.cura);
    jogador.bag[pocaoChave]--;
    salvarJogador(jogador);
    return sock.sendMessage(from, {
      text: `💊 *${base.nome}* recuperou ${pkm.hpAtual - hpAntes} HP!\nHP: ${barraHP(pkm.hpAtual, inst.hpMax)}`,
    });
  }

  // ── !regiao <nome> ────────────────────────────────────────
  if (cmd === "!regiao") {
    const nova = args[1]?.toLowerCase();
    if (!REGIOES[nova]) {
      return sock.sendMessage(from, {
        text: `Regiões disponíveis:\n${Object.entries(REGIOES).map(([k, r]) => `• ${r.emoji} *${r.nome}* — !regiao ${k}`).join("\n")}`,
      });
    }
    jogador.regiao = nova;
    salvarJogador(jogador);
    return sock.sendMessage(from, { text: `🗺️ Você viajou para ${REGIOES[nova].emoji} *${REGIOES[nova].nome}*!` });
  }

  // ── !miauzapinho — info especial ──────────────────────────
  if (cmd === "!miauzapinho") {
    const pkm = POKEMONS["miauzapinho"];
    if (isOwner(numero)) {
      return sock.sendMessage(from, {
        text: `
${pkm.emoji} *MiauZapinho* — Pokémon Exclusivo do Bot!
━━━━━━━━━━━━━━━━━━━━━
${pkm.descricao}

📜 *Lore:*
_${pkm.lore}_

⚔️ Golpes Exclusivos:
${pkm.golpes_exclusivos.map((g) => `• ${g}`).join("\n")}

🔐 Apenas você (dono) pode dar este Pokémon para alguém!
Use: *!dar @user miauzapinho*
`.trim(),
      });
    }
    return sock.sendMessage(from, {
      text: `${pkm.emoji} *MiauZapinho* — Um gato verde misterioso que habita o WhatsApp...\n\n_Dizem que apenas o lendário dono do bot conhece sua localização real._ 🔐`,
    });
  }

  // ══════════════════════════════════════════════════════════
  //  COMANDOS DO DONO (owner-only)
  // ══════════════════════════════════════════════════════════

  if (cmd === "!dar") {
    if (!isOwner(numero)) return sock.sendMessage(from, { text: "❌ Apenas o dono do bot pode usar este comando!" });
    const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const pokemonDar = args[2]?.toLowerCase();
    if (!mencionado || !pokemonDar) return sock.sendMessage(from, { text: "Use: *!dar @user pokemon*\nEx: !dar @alguém arceus" });
    if (!POKEMONS[pokemonDar]) return sock.sendMessage(from, { text: "Pokémon não encontrado!" });
    const alvoNum = mencionado.split("@")[0];
    const alvo = getJogador(alvoNum);
    const nivel = parseInt(args[3]) || 50;
    if (alvo.time.length < 6) alvo.time.push({ id: pokemonDar, nivel, xp: 0 });
    else alvo.caixas.push({ id: pokemonDar, nivel, xp: 0 });
    salvarJogador(alvo);
    const pkm = POKEMONS[pokemonDar];
    return sock.sendMessage(from, {
      text: `✅ *${pkm.emoji} ${pkm.nome}* (Nv.${nivel}) foi dado para @${alvoNum}!`,
      mentions: [mencionado],
    });
  }

  if (cmd === "!pokecoins") {
    if (!isOwner(numero)) return sock.sendMessage(from, { text: "❌ Apenas o dono do bot pode usar este comando!" });
    const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const qtd = parseInt(args[2]);
    if (!mencionado || isNaN(qtd)) return sock.sendMessage(from, { text: "Use: *!pokecoins @user quantidade*" });
    const alvoNum = mencionado.split("@")[0];
    const alvo = getJogador(alvoNum);
    alvo.pokecoins += qtd;
    salvarJogador(alvo);
    return sock.sendMessage(from, {
      text: `💰 *${fmt(qtd)} PokéCoins* foram adicionados para @${alvoNum}! Total: ${fmt(alvo.pokecoins)}`,
      mentions: [mencionado],
    });
  }

  if (cmd === "!broadcast") {
    if (!isOwner(numero)) return;
    const mensagem = args.slice(1).join(" ");
    return sock.sendMessage(from, { text: `📢 *Anúncio do Bot:*\n\n${mensagem}` });
  }

  if (cmd === "!resetar") {
    if (!isOwner(numero)) return;
    const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mencionado) return sock.sendMessage(from, { text: "Mencione o usuário!" });
    const alvoNum = mencionado.split("@")[0];
    const alvo = getJogador(alvoNum);
    alvo.time = []; alvo.caixas = []; alvo.pokecoins = 500; alvo.vitórias = 0; alvo.derrotas = 0;
    salvarJogador(alvo);
    return sock.sendMessage(from, { text: `🔄 Perfil de @${alvoNum} foi resetado!`, mentions: [mencionado] });
  }
}