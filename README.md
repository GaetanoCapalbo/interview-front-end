# Test Tecnico - React Developer

## Benvenuto in Pixxa! 👋

Siamo [Pixxa](https://www.pixxa.it/), e questo è il nostro test per sviluppatori frontend. 

Abbiamo preparato una serie di task pratici che simulano situazioni reali che affrontiamo quotidianamente. **Non devi completarli tutti**: scegli liberamente quali affrontare in base alle tue competenze e al tempo che hai a disposizione.

### Tempistiche

Hai **7 giorni** dalla ricezione di questo test. Sappiamo che hai una vita oltre al codice, quindi gestisci il tempo come preferisci. Quello che conta è la qualità, non le ore.

### Cosa ci aspettiamo

Forka questa repo e trattala come un progetto vero. Lavora come faresti in un contesto professionale.

**Nota importante**: completa la sezione "Come Eseguire" in fondo a questo file. Se non riusciamo a far partire il tuo progetto, non possiamo valutarlo.

### Criteri di Valutazione

Guarderemo principalmente a:

* Come scrivi codice
* Pattern architetturali utilizzati
* Organizzazione del progetto
* Gestione del versioning (commit significativi, branch strategy)
* Test e documentazione

### AI e Strumenti Esterni

Parliamoci chiaro: ChatGPT, Copilot e simili sono ormai parte del nostro toolkit quotidiano. Li usiamo anche noi. Quindi sentiti libero di usarli.

Però.

Vogliamo vedere come *tu* ragioni, come risolvi i problemi, come prendi decisioni architetturali. Durante il colloquio tecnico ti chiederemo di spiegarci ogni scelta che hai fatto: dal perché hai strutturato il codice in un certo modo, a perché hai scelto quella libreria specifica.

In pratica: usa pure l'AI come assistente, ma assicurati di capire ogni singola riga di codice che scrivi. Il codice deve essere tuo.

### Note Pratiche

Troverai alcune funzionalità che ti risulteranno più familiari di altre. È normale. Concentrati su quello che sai fare meglio e, se vuoi, prova a spingerti un po' oltre.

I requisiti sono volutamente aperti: vogliamo vedere come interpreti le specifiche quando non sono cristalline (succede sempre nei progetti veri). Annota decisioni, dubbi, domande che faresti in un contesto lavorativo.

Il nostro stack è Typescript + React.
---   

## Il Progetto: EventiCampania

Devi sviluppare una web app per esplorare gli eventi in Campania. Pensa a qualcosa tipo Eventbrite, ma focalizzato sulla regione.

Gli utenti devono poter:
- Scorrere gli eventi disponibili
- Aggiungere nuovi eventi
- Lasciare feedback e valutazioni
- Cercare eventi per categoria, città, data

Non serve implementare login/registrazione o gestione utenti. Teniamo le cose semplici.

### Setup Tecnico

Nella cartella [server](./server) trovi un backend mock già pronto con API REST per eventi, categorie e interazioni.

Leggi il [README del server](./server/README.md) per:
- Istruzioni di avvio
- Endpoint API disponibili
- Esempi di chiamate

Il server include già alcuni eventi di esempio pronti all'uso.

### Task da Completare

Scegli quali task affrontare. Non c'è un ordine obbligatorio.

#### Task 1: Vista Lista Eventi

Implementa la pagina principale con la lista degli eventi. Ogni evento ha nome, immagine, luogo, data, categoria e altri dettagli che trovi nel data model del backend.

**Attenzione alle performance**: evita di renderizzare centinaia di eventi tutti insieme. Pensa a pagination, infinite scroll, o altre soluzioni che riducono il carico iniziale.

#### Task 2: Ricerca e Filtri

Aggiungi una search bar e filtri per:
- Categoria evento (usa le categorie dal backend)
- Località (ricerca testuale nel campo location)
- Periodo temporale (passati, in corso, futuri)

Bonus se implementi più filtri contemporaneamente e la ricerca è reattiva.

#### Task 3: Creazione Evento

Form per aggiungere un nuovo evento. Campi necessari:
- Nome evento
- Descrizione
- Luogo (campo libero: via, città, etc.)
- Data/orario
- Categoria (scelta da lista predefinita)
- Immagine (URL o upload opzionale)

Gestisci validazione e feedback all'utente. Considera l'UX anche per gli errori.

#### Task 4: Pagina Dettaglio e Interazioni

Pagina dedicata per ogni evento con tutte le info complete.

Gli utenti devono poter:
- Vedere descrizione estesa, luogo (non serve far vedere una mappa), orari 
- Segnare "Parteciperò" e vedere quante persone hanno confermato
- Salvare l'evento nei preferiti
- Lasciare una valutazione (stelle, voto numerico, quello che preferisci)

Gestisci gli aggiornamenti in modo reattivo senza dover ricaricare la pagina. Bonus se implementi condivisione social o export a calendario.

## Come Eseguire

...
