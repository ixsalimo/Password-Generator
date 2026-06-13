# Password Generator

[![Version](https://img.shields.io/badge/Version-2.0.0-22c55e?style=flat&logo=github)](https://github.com/ixsalimo/Password-Generator)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](./LICENSE)

A lightweight, client-side password generator and manager. No accounts, no servers, no external dependencies — everything runs in the browser and stays on your device.

**[Live Demo →](https://ixsalimo.github.io/Password-Generator/)**

---

## Features

### 🔐 Secure Password Generation
- **Cryptographically Secure:** Uses the Web Crypto API (`window.crypto.getRandomValues`) to ensure true randomness, far superior to standard `Math.random()`.
- **Customizable Complexity:** Fine-tune generated passwords with toggleable character sets:
  - Uppercase Letters (A-Z)
  - Lowercase Letters (a-z)
  - Numbers (0-9)
  - Symbols (`!@#$%^&*()-_+=[]{}|;:'",.<>/?~`)
  - Spaces
- **Ambiguity Reduction:** Dedicated option to exclude visually similar characters (e.g., `o`, `0`, `O`, `|`, `L`, `I`, `l`, `1`, `i`) to prevent manual entry errors.
- **Length Control:** Generate passwords of any specified length.

### 📊 Password Strength Analysis
- **Real-time Entropy Calculation:** Instantly calculates the mathematical entropy of the generated password based on the active character sets and length.
- **Visual Feedback:** A color-coded strength bar provides immediate visual feedback (ranging from "Too Weak" to "Excellent") to ensure passwords meet your security requirements.

### 💾 Password Management & Storage
- **Local Storage Integration:** Save your generated passwords securely within your browser's local storage.
- **Descriptive Titles:** Add descriptive titles to your saved passwords for easy identification.
- **Filter & Search:** Quickly find specific passwords using the real-time search functionality across your saved items.
- **Edit & Rename:** Easily update the titles of saved passwords.
- **Delete with Safeguards:** Remove outdated or unwanted passwords with a confirmation dialog.
- **Visibility Toggle:** Keep your passwords hidden until you need them, preventing shoulder surfing.

### 📥 Backup, Restore & Portability
- **Export to JSON:** Download your entire library of saved passwords (or just your current search results) as a structured JSON file.
- **Import from Backup:** Easily restore your passwords from a previously exported JSON backup.
- **Intelligent Import:** Automatically skips duplicate entries to keep your library clean and organized.

### 🎨 UI/UX & Interactivity
- **One-Click Copy:** Rapidly copy generated or saved passwords directly to your clipboard.
- **Interactive Modals:** Custom built-in modal system for smooth alerts, confirmations, and renaming prompts without relying on browser-native blocking dialogs.
- **Fully Responsive Layout:** A clean, responsive interface designed to work flawlessly across devices and screen sizes.
- **Instant Status Alerts:** Real-time visual feedback for actions like copying, saving, or importing backup files.

### 🛡️ Privacy & Technical Advantages
- **Privacy-First Architecture:** All generation and storage happen strictly on the client side. No data is ever sent to or stored on an external server.
- **High Performance:** A lightweight, zero-dependency implementation resulting in near-instant load times and interaction rates.

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