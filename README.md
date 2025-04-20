<h1 align="center" style="font-weight: bold;">Karhub Beer API 🍺</h1>

<p align="center">
 <a href="#technologies">Technologies</a> •
 <a href="#started">Getting Started</a> •
 <a href="#routes">API Endpoints</a> •
</p>

<p align="center">
    <b>API para cadastro, consulta, atualização e recomendação de estilos de cerveja, com integração ao Spotify para playlists temáticas.</b>
</p>

<h2 id="technologies">💻 Technologies</h2>

- Node.js
- Express
- MongoDB
- Mongoose
- Zod (validação de dados)
- Jest & Supertest (testes)
- mongodb-memory-server (testes de integração isolados)
- Pino (logs estruturados)
- Docker 
- Swagger (documentação)

<h2 id="started">🚀 Getting started</h2>

### Pre requisites

- [NodeJS](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) 

### Cloning

```bash
git clone https://github.com/seu-usuario/karhub.git
cd karhub
```

### Config .env variables (verifique se não tem nenhuma aplicação mongo rodando na porta 27017)

Use o arquivo `.env.example` como referência para criar o seu `.env`:

```ini
MONGODB_URI=mongodb://localhost:27017/karhub
PORT=3000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
LOG_LEVEL=info
```

### Instalando dependências

```bash
npm install
```

### Rodando com Docker (MongoDB)

```bash
docker-compose up -d
```

### Rodando o projeto localmente

```bash
npm run dev
```

### Testando a API Online

Você pode testar a API já em produção pelo seguinte link:

- **Base URL:** [https://karhub-projeto-backend.onrender.com](https://karhub-projeto-backend.onrender.com)

Todos os endpoints funcionam normalmente, e a API está conectada a um banco de dados MongoDB Atlas online (por conta de ser free tier do render pode demorar alguns segundos até iniciar a api).

---

### Rodando as seeds

```bash
npm run seed
```

### Rodando as migrations

> O projeto não utiliza migrations, apenas schemas do Mongoose. As collections são criadas automaticamente.

### Rodando os testes

#### Testes unitários

```bash
npm run test:unit
```

#### Testes de integração

```bash
npm run test:integration
```

> **Nota:** Os testes de integração usam a biblioteca `mongodb-memory-server` para isolar os testes e não afetar o banco de dados real/produção.

### Rodando o Swagger

Acesse a documentação interativa em [http://localhost:3000/docs](http://localhost:3000/docs) após iniciar a aplicação.

A documentação é gerada automaticamente a partir do arquivo `swagger.yaml`

---

<h2 id="routes">📍 API Endpoints</h2>

| route                      | description                                                      |
|----------------------------|------------------------------------------------------------------|
| <kbd>POST /beers</kbd>     | Cria uma nova cerveja                                            |
| <kbd>GET /beers</kbd>      | Lista todas as cervejas                                          |
| <kbd>GET /beers/:id</kbd>  | Busca cerveja por ID                                             |
| <kbd>PUT /beers/:id</kbd>  | Atualiza uma cerveja                                             |
| <kbd>DELETE /beers/:id</kbd>| Remove uma cerveja                                               |
| <kbd>POST /beers/recommendation</kbd> | Recomenda cerveja e playlist com a API do spotify baseada na temperatura |

#### Exemplo de request/response para POST /beers

**REQUEST**
```json
{
  "name": "Duff",
  "minTemp": 4,
  "maxTemp": 8
}
```

**RESPONSE**
```json
{
  "_id": "662e0e6f7e1e6e3a3e4f7b1a",
  "name": "Duff",
  "minTemp": 4,
  "maxTemp": 8
}
```

#### Exemplo de recomendação

**REQUEST**
```json
{
  "temperature": 6
}
```

**RESPONSE**
```json
{
    "beerStyle": "Pilsens",
    "playlist": {
        "name": "15 pilsens después",
        "tracks": [
            {
                "name": "KASSANDRA",
                "artist": "Quevedo",
                "url": "https://open.spotify.com/track/6mP16Mr2X3ZU2bNmWBUqzK"
            },
            {
                "name": "14 FEBREROS",
                "artist": "Quevedo",
                "url": "https://open.spotify.com/track/1qIUiG9nhThK6es9pFMlwO"
            },
            {
                "name": "GRAN VÍA",
                "artist": "Quevedo",
                "url": "https://open.spotify.com/track/2kQ1OvmMzs1xdlH020aJJh"
            },
            {
                "name": "CHAPIADORA.COM",
                "artist": "Quevedo",
                "url": "https://open.spotify.com/track/1iP7aZUNvyt2EtmpjSbtRz"
            },
            {
                "name": "HALO",
                "artist": "Quevedo",
                "url": "https://open.spotify.com/track/58ldPuiCULxm08TCZ8qX4D"
            }
        ]
    }
}
```

--- 

> **Logs:** O projeto utiliza a biblioteca `pino` para logs estruturados, facilitando análise e integração com ferramentas externas.
