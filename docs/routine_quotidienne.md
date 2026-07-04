# Routine quotidienne — Sens Solidaire

## 🌅 Matin — Démarrage

1. **Lancer Docker Desktop** (Windows) — attendre que Docker soit complètement démarré

2. **Récupérer les dernières modifications de l'équipe** :
```bash
cd ~/sens-solidaire
git checkout dev
git pull origin dev
git checkout dev-front
git merge dev
```

3. **Démarrer les conteneurs** :
```bash
cd ~/sens-solidaire
docker-compose up -d
```

✅ Le site est accessible sur http://localhost:5173
✅ L'API est accessible sur http://localhost:3000
✅ PostgreSQL tourne dans Docker — pas besoin de le démarrer séparément
⚠️ Ne jamais lancer npm run dev manuellement quand Docker est en route

---

4. **Lancer le tunnel ngrok** (dans un terminal séparé) :
```bash
ngrok http 5173
```

⚠️ L'URL ngrok change à chaque relance de ngrok (pas à chaque redémarrage Docker).
✅ URL actuelle : `https://couch-stray-twistable.ngrok-free.dev`
✅ Partager cette URL à Alison et à la cliente pour accès externe
⚠️ Si l'URL change, mettre à jour `allowedHosts` dans `vite.config.js` :
```javascript
allowedHosts: ['nouvelle-url.ngrok-free.dev']
```
Puis redémarrer Docker : `docker compose down && docker compose up`

**Second tunnel backend** (second compte ngrok, si besoin) :
```bash
ngrok http 3000 --config ~/.config/ngrok/ngrok2.yml
```

---

## 🌙 Soir — Fermeture

1. **Arrêter les conteneurs** :
```bash
cd ~/sens-solidaire
docker-compose down
```
2. **Fermer Docker Desktop** (Windows)

---

## 📝 Fin de session — Git

1. **Commit sur dev-front** :
```bash
git add .
git commit -m "feat: ..."
git push origin dev-front
```
2. **Merge dans dev** :
```bash
git checkout dev
git merge dev-front
git push origin dev
git checkout dev-front
```