# B-Projekt — dachy i wynajem rusztowań

Kod strony https://b-projekt.pl — B-Projekt, Drwinia, Małopolska.

## Struktura

- `public/` — strona, style, skrypty i zdjęcia realizacji.
- `worker/index.js` — serwer Cloudflare Worker i obsługa formularza `/api/contact`.
- `scripts/build.mjs` — samodzielny build bez zewnętrznych zależności.
- `.openai/hosting.json` — identyfikator obecnego projektu ChatGPT Sites.

## Budowanie

Wymagany Node.js 20 lub nowszy.

```sh
npm run build
```

Wynik: `dist/server/index.js`, moduł Cloudflare Workers z wbudowanymi zasobami strony. Katalog `dist/` jest generowany i nie jest przechowywany w tym repozytorium.

## Formularz

Serwer wymaga sekretu środowiskowego `CONTACT_RECIPIENT` ustawionego w panelu hostingu. Wartości sekretów i adres odbiorcy nie są przechowywane w tym repozytorium. Formularz korzysta z FormSubmit; odbiorca wymaga aktywacji. Serwer sprawdza dane i pochodzenie żądania oraz nie zgłasza sukcesu, gdy dostawca odrzuca wysyłkę.

## Hosting i publikowanie

Aktualna domena i hosting pozostają w ChatGPT Sites. To repozytorium zawiera kopię źródeł z uruchomionej wersji, przygotowaną do dalszego rozwoju na GitHubie. Zmiana plików na GitHubie nie publikuje automatycznie strony. Automatyczne wdrażanie wymaga osobnej konfiguracji integracji z wybranym hostingiem.

Źródło migracji: commit `e8aaf57e9ca8ce5e0eecec18c0eaf1e90f1be44f` z repozytorium ChatGPT Sites. Migracja przenosi bieżące pliki; wcześniejsza historia pozostaje w repozytorium źródłowym.

Zdjęcia i materiały firmowe należą do ich właścicieli. Publiczny dostęp do kodu nie oznacza zgody na wykorzystywanie materiałów B-Projekt w innych projektach.
