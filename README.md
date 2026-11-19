# b-projekt

Strona B-Projekt — dachy i wynajem rusztowań (Drwinia, Małopolska).

Statyczna strona bez kroku budowania: cały kod jest w `public/index.html`, zdjęcia w `public/assets/` (format WebP, max 1600 px).

## Ustawienia Cloudflare Pages

| Pole | Wartość |
| --- | --- |
| Production branch | `main` |
| Framework | None |
| Build command | `exit 0` |
| Build output directory | `public` |

## Do uzupełnienia przed publikacją

- **Formularz kontaktowy**: w `public/index.html` zmień `action="#"` na adres obsługi formularza (np. FormSubmit z adresem e-mail firmy). Dopóki jest `#`, formularz nie wysyła danych i pokazuje numer telefonu.
- **Domena**: po wyborze adresu dodaj `<link rel="canonical">`, pełny adres w `og:image`/`og:url` oraz `sitemap.xml` i `robots.txt`.

## Zdjęcia

Oryginały zostają na Dysku Google (`40_B_PROJEKT`). W repozytorium są tylko zmniejszone wersje wybranych zdjęć.
