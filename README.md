# CodePrez 🎤💻

**CodePrez** est une application de présentation interactive de code. Elle permet de visualiser, tester et commenter du code en live comme un·e pro du pitch technique.

---

## 🚀 Fonctionnalités attendues

- 📂 Affichage et navigation dans une structure de projet (fichiers/dossiers)
- 🧠 Aperçu du contenu de fichiers de code avec coloration syntaxique
- ✍️ Annotation/commentaire sur des lignes de code
- ⚡ Exécution ou simulation de scripts (selon le langage visé)
- 🎯 Possibilité de créer des "slides" à partir de bouts de code

---

## 🖥️ Lancer l'interface (Node.js)
```bash
npm run dev
```
## Tester les fonction
```bash
node ./testarchive.js ../../example-presentation

node ./testextract.js  ./archive/outpit.codeprez

node ./testparse ../../example-presentation


```

### Prérequis

- Node.js >= 18
- npm

### Installation

```bash
git clone https://github.com/ton-user/codeprez.git
cd codeprez
npm install
