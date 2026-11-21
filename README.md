# B-Projekt — dachy i wynajem rusztowań

Kod strony https://b-projekt.pl — B-Projekt, Drwinia, Małopolska.

## Struktura

- `public/` — strona, style, skrypty, zdjęcia realizacji, `robots.txt`, `sitemap.xml` (adres kanoniczny: https://b-projekt.pl/ — zmienić, jeśli domena będzie inna).
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

Serwer wymaga sekretu środowiskowego `CONTACT_RECIPIENT` ustawionego w panelu hostingu (docelowo `kontakt@b-projekt.pl`). Wartości sekretów i adres odbiorcy nie są przechowywane w tym repozytorium. Formularz korzysta z FormSubmit; odbiorca wymaga aktywacji. Serwer sprawdza dane i pochodzenie żądania oraz nie zgłasza sukcesu, gdy dostawca odrzuca wysyłkę.

## Hosting i publikowanie

Obecna domena i hosting pozostają w ChatGPT Sites; strona (`public/`) jest przygotowana także pod Cloudflare Pages (katalog wyjściowy `public`). To repozytorium zawiera kopię źródeł z uruchomionej wersji, przygotowaną do dalszego rozwoju na GitHubie. Zmiana plików na GitHubie nie publikuje automatycznie strony. Automatyczne wdrażanie wymaga osobnej konfiguracji integracji z wybranym hostingiem.

Źródło migracji: commit `e8aaf57e9ca8ce5e0eecec18c0eaf1e90f1be44f` z repozytorium ChatGPT Sites. Migracja przenosi bieżące pliki; wcześniejsza historia pozostaje w repozytorium źródłowym.

Zdjęcia i materiały firmowe należą do ich właścicieli. Publiczny dostęp do kodu nie oznacza zgody na wykorzystywanie materiałów B-Projekt w innych projektach.

## Wdrożenie na Cloudflare (docelowo)

Formularz działa w Workerze, więc strona musi być wdrożona jako Worker, a nie jako czysty statyczny Pages: build `npm run build`, deploy `npx wrangler deploy` (Workers Builds połączone z repozytorium, gałąź `main`). Sekret: `CONTACT_RECIPIENT=kontakt@b-projekt.pl`. Domena `b-projekt.pl` jako Custom Domain Workera.

## Publikacja na GitHub Pages (statycznie)

Workflow `.github/workflows/pages.yml` publikuje katalog `public/` po każdym zapisie w `main`. W ustawieniach repo: Settings → Pages → Source: GitHub Actions. Plik `public/CNAME` zawiera domenę `b-projekt.pl`. Na hostingu statycznym formularz wysyła dane bezpośrednio przez FormSubmit na kontakt@b-projekt.pl (pierwsze zgłoszenie wymaga aktywacji adresu mailem). Uwaga: GitHub Pages dla prywatnych repozytoriów wymaga płatnego planu GitHub.
