# Eventi Campania — Frontend Documentation

## Panoramica
Eventi Campania è una SPA React progettata per scoprire, creare, modificare e gestire eventi in Campania. 

Include:
- Lista eventi con ricerca, filtri per categoria, luogo e periodo temporale
- Dettagli evento con interazioni di partecipazione, preferiti e valutazioni
- Creazione, modifica ed eliminazione eventi, con supporto all’upload immagini
- Persistenza client-side per interazioni per-utente (presenze, preferiti, valutazioni)



## Tech Stack
- React 19 con React Router 7
- React Query (TanStack Query) per fetch e caching
- react-hook-form + Zod per gestione e validazione form
- date-fns (locale: it) per formattazione date
- UI: componenti di shadcn(ui folder) e componenti custom
- Icone: lucide-react


## Struttura del Progetto
```
client/
  src/
    components/
      events/
        EventCard.tsx
        EventsGrid.tsx
        PaginationControls.tsx
        LoadingState.tsx
        ErrorState.tsx
        EmptyState.tsx
        EventForm.tsx
        StarRating.tsx
        FacebookShare.tsx
      ui/
        alert.tsx
        button.tsx
        calendar.tsx
        card.tsx
        field.tsx
        form.tsx
        input.tsx
        label.tsx
        popover.tsx
        select.tsx
        separator.tsx
        textarea.tsx
    hooks/
      useEvents.ts
      useEvent.ts
      useEventMutations.ts
      useCategories.ts
    lib/
      api.ts  // helper fetch e chiamate REST
      utils.ts
    pages/
      HomePage.tsx
      EventListPage.tsx
      EventDetailsPage.tsx
      CreateEventPage.tsx
      EditEventPage.tsx
    App.tsx

```

## Routing
Le route sono definite in App.tsx:
- "/" → Home
- "/events" → Lista eventi con filtri e paginazione
- "/events/:id" → Dettagli evento
- "/events/new" → Creazione evento
- "/events/:id/edit" → Modifica evento

I link di navigazione sono disponibili da Navbar.tsx e da azioni contestuali (es. “Modifica Evento” nella pagina dettagli).


## Data Fetching
React Query è utilizzato per tutti i fetch:

- useEvents(params) — elenca eventi con parametri (paginazione, ricerca, categoria, luogo, periodo).
- useEvent(id) — recupera un singolo evento.
- useCategories() — elenca le categorie.
- Mutazioni in useEventMutations.ts — creare, aggiornare, eliminare, toggle partecipazione, toggle preferiti, invio valutazioni, upload immagini.

## Filters & URL Sync (EventListPage)
La pagina lista offre:

- Testo di ricerca (con debounce)
- Select categoria
- Luogo (con debounce)
- Periodo temporale: tutti | passati | oggi | futuri

Dettagli chiave:

- Input con debounce (300ms) per evitare chiamate eccessive.
- La pagina mantiene sempre il layout e i filtri, evitando “reflash” durante loading/error.
- I filtri e la pagina corrente sono sincronizzati nell’URL tramite useSearchParams, così da avere link condivisibili e persistenti.

## Forms (Create/Edit) and Validazione
Il componente riutilizzabile EventForm.tsx centralizza UI e gestione immagini per creazione e modifica. Riceve:

-form: istanza react-hook-form tipizzata
- isLoading: disabilita input/bottoni durante l’invio
- onSubmit(values): handler submit
- submitLabel: etichetta bottone (“Crea Evento” / “Salva Modifiche”)
-uploadImage(file): funzione per upload immagini (definita in lib/api.ts)

La validazione è gestita tramite schemi Zod (campi obbligatori: name, description, location, date, time, categoryId, imageUrl).
Il campo imageUrl usa type="text" per permettere sia URL assoluti che percorsi relativi del server tipo /uploads/....

## Immagini
Due modi per associare un’immagine:
1)Upload tramite input file (usa endpoint multer; restituisce il percorso/URL del file).
2)Incollare un URL o un path relativo /uploads/....

Il componente mostra un’anteprima e garantisce che il campo imageUrl sia valorizzato prima dell’invio.

## Interazioni nella Pagina Dettagli Evento
Nella pagina dettagli, l’utente può:

- Segnare “Partecipo” e vedere il conteggio partecipanti
- Aggiungere ai preferiti
Lasciare una valutazione

Poiché il server potrebbe  supporta DELETE:

- L’app applica optimstic update dove possibile
- Conserva i toggle dell’utente in localStorage
- Esegue refetch per sincronizzare lo stato, pur sapendo che i contatori del server potrebbero non decrementare correttamente

Chiavi localStorage:

- eventiCampania_attendance
- eventiCampania_favorites
- eventiCampania_ratings


## API Layer (`lib/api.ts`)
Helper centralizzati per tutte le chiamate REST:

- fetchEvents, fetchCategories, fetchEvent
- createEvent, updateEvent, deleteEvent
- uploadImage (FormData + file) via multer
- I metodi “remove” per partecipazione/preferiti sono no-op sicuri se il backend non ha DELETE, semplificando la logica UI.

CreateEventData e UpdateEventData richiedono image: string per evitare invii senza immagine.


## Stati di Errore, Loading e Vuoto

Componenti dedicati:

- LoadingState — skeleton/spinner
- ErrorState — messaggio errore con retry
- EmptyState — nessun risultato / messaggio dedicato

La lista eventi mantiene sempre filtri + layout, cambiando solo l’area contenuti per un UX stabile.


## Esecuzione App
Da  `client/`:
```
npm install
npm run dev      # avvia server di sviluppo Vite
```


## Limitazioni Note

- Le Rich social previews (Open Graph) richiedono HTML SSR con tag OG e un URL pubblico. Il solo client (soprattutto in localhost) non produce Rich social previews.

- Limitazioni server: alcune risorse non supportano DELETE; la UI gestisce la rimozione lato client tramite localStorage, e i contatori potrebbero non riflettere le rimozioni.


## Miglioramenti Futuri
- Estrarre i filtri lista e la sidebar dettagli in componenti dedicati.
- Migliorare accessibilità (etichette ARIA, gestione focus).
- Aggiungere test e2e (Playwright) per i flussi critici.
- Migliorare gestione errori e strategie di retry nelle mutazioni.
- Introdurre feature flags per UI sperimentali.


## Note per i Contributori

- Preferire componenti colocati per coesione; promuoverli in components/ solo se riutilizzati.
- Mantenere prop semplici e tipizzati; evitare prop drilling profondo raggruppando input correlati.
- Seguire lo stile esistente: nomi espliciti, early return, nesting minimo, commenti essenziali.


