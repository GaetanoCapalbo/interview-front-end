# Server EventiCampania

Server Express con JSON Server per API RESTful e Multer per l'upload delle immagini. Fornisce endpoint per gestire eventi, rating e categorie.

## Setup

Installa Node.js e npm, poi:

```bash
npm install
npm start
```

Il server parte su `http://localhost:8080`.

## API Specification

Il file [openapi.yaml](./openapi.yaml) contiene le specifiche API in formato OpenAPI.
Puoi visualizzarlo su [Swagger Editor](https://editor.swagger.io/).

## Endpoints Principali

- `GET /events` - Lista eventi (con filtri per categoria, località, data)
- `GET /events?location_like=Napoli` - Filtra eventi per località
- `GET /events/:id` - Dettaglio evento
- `POST /events` - Crea nuovo evento (location è campo libero)
- `POST /upload` - Upload immagine evento
- `POST /events/:id/attendees` - Segna partecipazione
- `POST /events/:id/favorites` - Aggiungi ai preferiti
- `POST /events/:id/ratings` - Aggiungi valutazione
- `GET /categories` - Lista categorie
