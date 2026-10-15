# GOLDMINE archive demonstration

A responsive static replica of the public-facing GOLDMINE website, focused on its Home, Search, Browse and Support experiences. The site uses representative local sample records; it does not connect to the live archive, an API, a database, account services or remote document storage.

**Live demo:** <https://rushgrimes.github.io/goldmine_test/>

## Run locally

Serve this directory with any static web server (for example, `python -m http.server 8000`) and open `http://localhost:8000`. The site is also suitable for static hosting such as GitHub Pages.

## Demo features

- Navigate Home, Search, Browse and Support, plus the privacy and site usage pages.
- Search sample records by keywords, exact phrases, collection and county; sort and paginate results.
- Browse a nested, expandable GOLDMINE-style folder tree, navigate with back/forward/up and breadcrumbs, switch grid/list views, search sample records, preview them and add selected files or folders to the download list.
- Download a locally generated demonstration text file or CSV catalogue of selected records.
- Manage the cookie preference banner; only the selected preference is stored in local browser storage.

Search results, previews, file sizes and downloads are illustrative. They are not official records and do not contain the original GSI imagery. Signing in and account services are intentionally not connected.
