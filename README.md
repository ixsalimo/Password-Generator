# Password Generator

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](./LICENSE)

A lightweight, client-side password generator and manager. No accounts, no servers, no external dependencies — everything runs in the browser and stays on your device.

**[Live Demo →](https://ixsalimo.github.io/Password-Generator/)**

---

## Features

**Generation**
- Configurable length and character sets (uppercase, lowercase, numbers, symbols, spaces)
- Entropy-based password strength meter
- Show/hide toggle and one-click copy

**Management**
- Save, edit, and delete passwords via Local Storage
- Real-time search across saved passwords
- Timestamps stored with each entry

**Backup & Restore**
- Export all passwords — or just the current search results — to JSON
- Import from a JSON backup with automatic duplicate skipping

**Interface**
- Fully responsive layout
- Custom modal system (alert, confirm, prompt) — no `window.alert()`
- Zero runtime dependencies

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 6.0 |
| Bundler | Vite 8.0 |
| Markup | HTML5 |
| Styling | CSS3 |
| Storage | Web Storage API |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/ixsalimo/Password-Generator.git
cd Password-Generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Other commands

```bash
npm run build      # Production build → /dist
npm run preview    # Preview the production build locally
```

---

## License

Released under the [MIT License](./LICENSE).

---

## Author

[@ixsalimo](https://github.com/ixsalimo)