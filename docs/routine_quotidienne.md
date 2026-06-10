# Aide-mémoire quotidien
## Sens Solidaire — Routine de travail journalière
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*

*Chaque jour de développement suit la même routine. Ce document regroupe les commandes à lancer dans l'ordre, selon ce sur quoi vous travaillez.*

---

## 🟢 MATIN — Commandes de démarrage (dans l'ordre)

```bash
sudo service postgresql start     # 1. Démarrer PostgreSQL — toujours en premier
```

**Gwen (dev-front)**
```bash
git checkout dev-front             # 2. Se placer sur ta branche
git fetch origin                   # 3. Télécharger les changements distants
git merge origin/dev               # 4. Intégrer le travail d'Alison
cd ~/sens-solidaire/frontend && npm run dev   # 5. Lancer le frontend (Terminal 1)
cd ~/sens-solidaire/backend && npm run dev    # 6. Lancer le backend (Terminal 2)
```

**Alison (dev-back)**
```bash
git checkout dev-back              # 2. Se placer sur ta branche
git fetch origin                   # 3. Télécharger les changements distants
git merge origin/dev               # 4. Intégrer le travail de Gwen
cd ~/sens-solidaire/frontend && npm run dev   # 5. Lancer le frontend (Terminal 1)
cd ~/sens-solidaire/backend && npm run dev    # 6. Lancer le backend (Terminal 2)
```

---

## 🔴 SOIR — Commandes de fin de journée (dans l'ordre)

```bash
git add .                          # 1. Ajouter les fichiers modifiés
git commit -m "type : description" # 2. Commiter avec un message clair
git push                           # 3. Pusher sur GitHub
```

**Gwen (dev-front)**
```bash
git checkout dev                   # 4. Se placer sur la branche d'intégration
git merge dev-front                # 5. Merger ton travail dans dev
git push                           # 6. Pusher dev sur GitHub
git checkout dev-front             # 7. Revenir sur ta branche de travail
```

**Alison (dev-back)**
```bash
git checkout dev                   # 4. Se placer sur la branche d'intégration
git merge dev-back                 # 5. Merger ton travail dans dev
git push                           # 6. Pusher dev sur GitHub
git checkout dev-back              # 7. Revenir sur ta branche de travail
```

> ✏️ Ne pas oublier : mettre à jour le journal de bord dans `/docs` et noter ce qui reste à faire pour demain.

---

## ⚡ 2A. Travailler SANS Docker (développement pur — plus rapide)

| Commande | Quand / pourquoi |
|---|---|
| **— Terminal 1 — Frontend (Gwen) —** | |
| `cd ~/sens-solidaire/frontend` | Se placer dans le dossier frontend |
| `npm run dev` | Lance React + Vite sur localhost:5173 |
| **— Terminal 2 — Backend (les deux) —** | |
| `cd ~/sens-solidaire/backend` | Se placer dans le dossier backend |
| `npm run dev` | Lance Express + Nodemon sur localhost:3000 |

✔ Utiliser ce mode pour : écrire du code, créer des composants, travailler sur les APIs, tester sans intégration complète.

---

## 🐳 2B. Travailler AVEC Docker (test intégration complète)

| Commande | Quand / pourquoi |
|---|---|
| `cd ~/sens-solidaire` | Se placer à la racine du projet |
| `docker compose up -d` | Lance les 3 services en arrière-plan (moins de RAM) |
| `docker compose logs -f` | Voir les logs en temps réel si besoin de debug |
| `docker compose down` | Arrête tous les services quand tu as terminé |
| `docker compose up --build -d` | Rebuild les images après un changement de Dockerfile |

✔ Utiliser ce mode pour : tester le flux complet front ↔ back ↔ BDD, vérifier les APIs, préparer une démo.

---

## 🗄️ 3. Base de données — selon les besoins

| Commande | Quand / pourquoi |
|---|---|
| `cd ~/sens-solidaire/backend` | Se placer dans le dossier backend |
| `npx prisma db push` | Synchronise le schéma Prisma avec la BDD (après modif schema.prisma) |
| `npx prisma studio --port 5555 --browser none` | Ouvre l'interface visuelle BDD sur localhost:5555 |
| `npx prisma generate` | Régénère le Prisma Client après modification du schéma |
| `npx prisma db seed` | Remplit la BDD avec les données de test |

---

## 🔀 4. Git — convention des messages de commit

| Préfixe | Usage |
|---|---|
| `feat : nom de la fonctionnalité` | Nouvelle fonctionnalité |
| `fix : description du bug corrigé` | Correction de bug |
| `style : modification CSS/UI` | Changement visuel sans impact fonctionnel |
| `bdd : modification schéma ou seed` | Changement base de données |
| `docs : mise à jour documentation` | Documentation, journal, README |
| `docker : modification Docker` | Dockerfile ou docker-compose |
| `chore : merge branche` | Merge de branche |

---

## 🌙 5. Fin de journée — checklist commune

- [ ] Commiter et pusher tout le travail du jour
- [ ] Merger sa branche (`dev-front` ou `dev-back`) → `dev` et pusher
- [ ] Arrêter Docker si ouvert : `docker compose down`
- [ ] Vérifier que les terminaux ne tournent plus (Ctrl+C si besoin)
- [ ] Rédiger ou mettre à jour le journal de bord
- [ ] Mettre à jour le journal dans `/docs` et pusher
- [ ] Noter ce qui reste à faire pour le lendemain