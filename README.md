# 🌟 PokéZap Bot — Bot de WhatsApp Pokémon

O bot de WhatsApp mais completo sobre Pokémon, com batalhas, capturas, loja, PokéDex e muito mais!

---

## 📋 Requisitos

- **Node.js** 18 ou superior
- **npm** 8+
- Uma conta WhatsApp ativa

---

## ⚙️ Instalação

```bash
# 1. Entre na pasta
cd pokezap

# 2. Instale as dependências
npm install

# 3. Inicie o bot (escolha um método abaixo)
```

---

## 🚀 Como iniciar

### Método 1 — QR Code (mais fácil)
```bash
node index.js
```
Vai aparecer um QR Code no terminal. Escaneie com seu WhatsApp:
> **WhatsApp → Configurações → Dispositivos conectados → Conectar dispositivo**

---

### Método 2 — Código de pareamento (--pair)
```bash
node index.js --pair 5518991307363
```
Substitua `5518991307363` pelo seu número **com código do país e DDD**, sem espaços ou símbolos.

Após rodar, um **código de 8 dígitos** vai aparecer no terminal. Digite-o no WhatsApp:
> **WhatsApp → Configurações → Dispositivos conectados → Conectar dispositivo → Digite o código**

---

## 🎮 Comandos do Bot

### Geral
| Comando | Descrição |
|---------|-----------|
| `!start` / `!menu` | Mostra o menu principal |
| `!iniciar` | Cria seu perfil e recebe um Pokémon inicial |
| `!perfil [@user]` | Vê seu perfil ou de outro treinador |
| `!time` | Vê os pokémon do seu time |
| `!ranking` | Top 10 treinadores |

### Captura
| Comando | Descrição |
|---------|-----------|
| `!explorar` | Encontra um pokémon selvagem na sua região |
| `!capturar <bola>` | Tenta capturar o selvagem (pokebola / superbola / ultrabola / masterbola) |
| `!fugir` | Foge do pokémon selvagem |

### Batalha
| Comando | Descrição |
|---------|-----------|
| `!duelo @user` | Desafia um treinador |
| `!aceitar` | Aceita um duelo pendente |
| `!atacar <golpe>` | Ataca no duelo |

### Loja & Itens
| Comando | Descrição |
|---------|-----------|
| `!loja` | Mostra itens à venda |
| `!comprar <item>` | Compra um item |
| `!bag` | Vê sua bag |
| `!curar <pocao> [nº]` | Usa poção no pokémon |

### PokéDex
| Comando | Descrição |
|---------|-----------|
| `!pokedex` | Vê todos os pokémon disponíveis |
| `!info <pokemon>` | Informações detalhadas de um pokémon |
| `!miauzapinho` | Informações sobre o pokémon exclusivo do bot |

### Regiões
| Comando | Descrição |
|---------|-----------|
| `!regiao <nome>` | Viaja para outra região (kanto / johto / hoenn / sinnoh) |

---

## 👑 Comandos Exclusivos do Dono (5518991307363)

| Comando | Descrição |
|---------|-----------|
| `!dar @user <pokemon> [nivel]` | Dá qualquer pokémon para alguém (incluindo Arceus e MiauZapinho!) |
| `!pokecoins @user <qtd>` | Dá PokéCoins para alguém |
| `!resetar @user` | Reseta o perfil de um jogador |
| `!broadcast <mensagem>` | Envia anúncio no grupo |

---

## ✨ Pokémon Especiais

### 🌟 Arceus
- **Dano INFINITO** — invencível em batalha!
- Apenas o **dono do bot** pode ter ou dar este pokémon
- Use `!dar @user arceus` para conceder a alguém

### 🐱 MiauZapinho
- Pokémon **exclusivo do PokéZap**, criado especialmente para este bot!
- Um gato verde nascido nas profundezas do WhatsApp
- Estatísticas absurdamente altas + golpes exclusivos
- Apenas o **dono do bot** pode ter ou dar este pokémon
- Golpes exclusivos: MiauRelâmpago, ZapGarra, FantasmaVerde, PataDoInfinito

---

## 📁 Estrutura do Projeto

```
pokezap/
├── index.js          ← Arquivo principal (inicie por aqui)
├── commands.js       ← Todos os comandos do bot
├── package.json      ← Dependências
├── data/
│   ├── pokemon.js    ← Dados de pokémon, itens e regiões
│   ├── battle.js     ← Motor de batalha
│   ├── db.js         ← Banco de dados (JSON)
│   └── db.json       ← Arquivo de dados (criado automaticamente)
└── auth_info/        ← Sessão do WhatsApp (criada automaticamente)
```

---

## ⚠️ Avisos

- Nunca compartilhe a pasta `auth_info/` — ela contém sua sessão
- O bot responde apenas a mensagens que começam com `!`
- Para reiniciar do zero, apague a pasta `auth_info/`
- O arquivo `data/db.json` é o banco de dados — faça backup regularmente

---

## 🛠️ Problemas comuns

**Bot não conecta:**
- Verifique se o número no `--pair` está correto (com DDI+DDD, sem caracteres especiais)
- Delete a pasta `auth_info` e tente novamente

**Erro de dependências:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

*PokéZap Bot — Feito com ❤️ para treinadores Pokémon do WhatsApp!*
