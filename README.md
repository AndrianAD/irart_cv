# irart_cv — портфоліо / візитка (Astro + GitHub Pages)

**Живий сайт (не цей README):** [https://andrianad.github.io/irart_cv/](https://andrianad.github.io/irart_cv/)  
Якщо бачиш саме цей текст як «сайт» — ти на сторінці **репозиторію** на GitHub (`github.com/.../irart_cv`), а не на GitHub Pages. Відкрий посилання вище.

Односторінковий сайт-візитка з категоріями робіт, lightbox (PhotoSwipe), плавними появами блоків і підтримкою `prefers-reduced-motion`.

## Локальна розробка

```bash
cd шлях/до/irart_cv
npm install
npm run dev
```

Збірка превʼю:

```bash
npm run build
npm run preview
```

## Як додати або переставити фото

1. Поклади файл у `public/` — зазвичай у підпапку категорії, наприклад `public/galleries/portrait/my-shot.jpg`.
2. Відкрий [`src/data/portfolio.json`](src/data/portfolio.json).
3. У потрібній категорії знайди масив `items` і:
   - **додай** обʼєкт `{ "file": "galleries/portrait/my-shot.jpg", "alt": "Короткий опис для доступності" }` — **розміри файлу для lightbox підставляються самі** з зображення; `width`/`height` у JSON не потрібні. Таких записів може бути **будь-яка кількість** (сітка сама додасть рядки);
   - **зміни порядок** — перетягни блоки в JSON (порядок у масиві = порядок на сайті).
4. Опційно: `"layout": "feature"` — велика клітинка в сітці (на десктопі).
5. Опційно: `"caption": "Підпис у lightbox"`.

Шлях у `file` вказуй **без** `public/`: все з `public/` доступне з кореня сайту.

Рекомендація: експортуй JPEG/WebP для вебу (наприклад ширина 1600–2400 px), не комить RAW.

## Нові категорії (розділи)

У `portfolio.json` додай новий обʼєкт у масив `categories` з полями `id`, `title`, `intro`, `items`. Навігація в шапці формується автоматично з цього масиву.

Опційно: `"grid": "instagram"` — три рівні колонки та квадратні превʼю (як сітка в Instagram). Зараз так зроблено для секції «Портрет».

## Контент і hero

- Тексти сайту, контакти, абзаци «Про фотографа» — у тому ж [`src/data/portfolio.json`](src/data/portfolio.json).
- Зображення за шляхом `heroImage` (у репо за замовчуванням `galleries/hero/hero.jpg`) поклади у `public/` за вказаним шляхом. Демо-JPEG у `public/galleries/` завантажені з [Lorem Picsum](https://picsum.photos/) — заміни на свої знімки, коли буде потрібно.

## GitHub Pages (через GitHub Actions)

1. Залий репозиторій на GitHub.
2. **Settings → Pages → Build and deployment → Source**: вибери **GitHub Actions** (не «Deploy from a branch»).
3. У файлі [`astro.config.mjs`](astro.config.mjs) вкажи реальний `site`:
   - для репозиторію `username.github.io`: `site: 'https://username.github.io'`, `base` не потрібен (дефолт `/`);
   - для **проєктного** репо: `site: 'https://username.github.io'` і розкоментуй `base: '/назва-репозиторію/'`.
4. Після push у гілку `main` workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) збере сайт і опублікує його.

Документація Astro: [Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/).

## Стек

- [Astro](https://astro.build/) (static)
- [PhotoSwipe 5](https://photoswipe.com/) (lightbox)

## Без Node (альтернатива)

Якщо потрібен лише статичний хостинг без збірки, можна вручну згенерувати HTML з того ж `portfolio.json` — у цьому репозиторії основний сценарій саме **Astro + Actions**.
