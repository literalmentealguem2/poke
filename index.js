// ============================================================
//  PokéZap Bot — index.js (Versão QR Code com Tela Web)
// ============================================================

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import qrcodeTerminal from "qrcode-terminal";
import qrcodePackage  from "qrcode"; // Importante: Para salvar o QR em imagem
import pino          from "pino";
import fs            from "fs";
import path          from "path";
import http          from "http"; 
import { fileURLToPath } from "url";
import { handleCommand } from "./commands.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let ultimoQR = null; // Armazena o código QR atual

// ── SERVIDOR WEB (Mostra o QR Code se o terminal quebrar) ────
const server = http.createServer(async (req, res) => {
  if (req.url === '/qr' || req.url === '/qr/') {
    if (!ultimoQR) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h3>O bot já está conectado ou o QR Code ainda não foi gerado. Olhe os logs!</h3>');
    }
    try {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write('<h2>Escaneie o QR Code abaixo para conectar o PokéZap:</h2>');
      // Transforma o código em uma imagem na tela da página web
      const qrImage = await qrcodePackage.toDataURL(ultimoQR);
      return res.end(`<img src="${qrImage}" style="width:300px;height:300px;"/>`);
    } catch (err) {
      res.writeHead(500);
      return res.end('Erro ao gerar imagem do QR Code.');
    }
  }

  // Página inicial padrão do Render
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('PokeZap Online! Acesse /qr se precisar escanear.');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`📡 Servidor ativo na porta ${PORT}. Link do QR: http://localhost:${PORT}/qr`);
});

const AUTH_DIR = path.join(__dirname, "auth_info");
const logger   = pino({ level: "silent" });

function banner() {
  console.clear();
  console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║    🌟  P O K É Z A P  B O T  🌟              ║
║                                              ║
║   O bot de Pokémon mais completo do Zap!     ║
║   Versão 1.0.0  |  by PokéZap Team           ║
║                                              ║
╚══════════════════════════════════════════════╝
`);
}

async function startBot() {
  banner();

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version }          = await fetchLatestBaileysVersion();

  console.log(`📦 Baileys versão: ${version.join(".")}`);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: true, // Sempre ativa o QR no terminal por padrão  
    auth: {
      creds: state.creds,
      keys:  makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: ["Chrome (Linux)", "Chrome", "1.0.0"], 
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
  });

  // ── Eventos de Conexão e QR Code ──────────────────────────
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      ultimoQR = qr; // Salva o QR atual para a página web
      console.log("\n📸 QR Code gerado! Se o terminal quebrar o desenho, acesse o link do seu site com '/qr' no final:\n");
      qrcodeTerminal.generate(qr, { small: true });
    }

    if (connection === "close") {
      ultimoQR = null;
      const code    = lastDisconnect?.error?.output?.statusCode;
      const motivo  = DisconnectReason[code] || code;
      const deveRec = code !== DisconnectReason.loggedOut;

      console.log(`\n❌ Conexão fechada: ${motivo}`);
      if (deveRec) {
        console.log("🔄 Tentando reconectar...\n");
        setTimeout(startBot, 5000);
      } else {
        console.log("🚫 Desconectado permanentemente.");
        process.exit(0);
      }
    }

    if (connection === "open") {
      ultimoQR = null; // Limpa o QR pois já logou
      console.log(`\n✅ Bot 100% Autenticado via QR Code!`);
      console.log("🟢 Pronto para responder no seu chat.");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // ── Handler de Mensagens ──────────────────────────────────
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      try {
        if (!msg.message) continue;

        const from   = msg.key.remoteJid;
        const numero = msg.key.participant ? msg.key.participant.split("@")[0] : from.split("@")[0];
        const texto  = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

        if (!texto.startsWith("!")) continue; 

        console.log(`📩 [${new Date().toLocaleTimeString("pt-BR")}] ${numero}: ${texto}`);
        await handleCommand(sock, msg, from, numero, texto);
      } catch (err) {
        console.error("Erro no comando:", err.message);
      }
    }
  });

  return sock;
}

if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

const dbPath = fs.existsSync("./data") ? "./data/db.json" : "./db.json";
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ jogadores: {}, duelos: {} }));
}

startBot().catch(console.error);