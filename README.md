# ⚡ LinkPay — Plateforme de monétisation de liens

> Monétise tes liens avec 1 pub, 8 secondes d'attente. Pas de délai 24h.

---

## 🚀 Déploiement en 4 étapes

### Étape 1 — Supabase (base de données)

1. Va sur [supabase.com](https://supabase.com) et crée un compte gratuit
2. Crée un nouveau projet (retiens le mot de passe)
3. Va dans **SQL Editor** → colle tout le contenu de `supabase_schema.sql` → clique **Run**
4. Va dans **Settings → API** et copie :
   - `Project URL` → c'est ton `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → c'est ton `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → c'est ton `SUPABASE_SERVICE_ROLE_KEY`

### Étape 2 — Variables d'environnement

1. Copie le fichier `.env.example` en `.env.local` :
   ```bash
   cp .env.example .env.local
   ```
2. Remplis les 3 clés Supabase obtenues à l'étape 1
3. Mets ton URL Vercel dans `NEXT_PUBLIC_SITE_URL` (après déploiement)

### Étape 3 — GitHub

```bash
# Dans le dossier linkpay
git init
git add .
git commit -m "Initial commit"

# Crée un repo sur github.com, puis :
git remote add origin https://github.com/TON_USERNAME/linkpay.git
git push -u origin main
```

### Étape 4 — Vercel (hébergement gratuit)

1. Va sur [vercel.com](https://vercel.com) → "Add New Project"
2. Importe ton repo GitHub `linkpay`
3. Dans **Environment Variables**, ajoute les 4 variables de ton `.env.local`
4. Clique **Deploy** → ton site est en ligne en 2 minutes ! 🎉
5. Copie l'URL Vercel (ex: `https://linkpay.vercel.app`) et mets-la dans `NEXT_PUBLIC_SITE_URL` dans les variables Vercel

---

## 💰 Intégrer une vraie publicité

Dans le fichier `pages/l/[id].js`, cherche le commentaire :
```
REMPLACE CE BLOC PAR TON CODE PUBLICITAIRE RÉEL
```

### Option A — Google AdSense (recommandé)
1. Inscris-toi sur [adsense.google.com](https://adsense.google.com)
2. Ajoute ton site, attends la validation (quelques jours)
3. Remplace le bloc pub par :
```jsx
<ins className="adsbygoogle"
  style={{ display: 'block', width: '100%', height: 200 }}
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true" />
```
Et dans `_app.js`, ajoute dans `<Head>` :
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"></script>
```

### Option B — Adsterra (plus facile à accepter)
1. Inscris-toi sur [adsterra.com](https://adsterra.com)
2. Crée une bannière 728x90 ou 300x250
3. Colle le code dans le bloc pub

---

## 🛠 Développement local

```bash
npm install
npm run dev
# Ouvre http://localhost:3000
```

---

## 📁 Structure du projet

```
linkpay/
├── pages/
│   ├── index.js          ← Page d'accueil
│   ├── login.js          ← Connexion
│   ├── register.js       ← Inscription
│   ├── dashboard.js      ← Dashboard utilisateur
│   ├── l/[id].js         ← Page intermédiaire avec pub
│   └── api/
│       └── links/
│           ├── create.js ← API création de lien
│           └── click.js  ← API enregistrement des clics
├── components/
│   └── UI.js             ← Composants réutilisables
├── lib/
│   └── supabase.js       ← Client Supabase
├── styles/
│   └── globals.css       ← Styles globaux
├── supabase_schema.sql   ← Schéma base de données
└── .env.example          ← Template des variables d'env
```

---

## 💡 Prochaines fonctionnalités à ajouter

- [ ] Retrait automatique via PayPal Payouts API
- [ ] Stats avancées (graphiques de visites par jour)
- [ ] Personnalisation du timer (5s, 8s, 10s)
- [ ] Domaine custom (linkpay.io)
- [ ] Système de parrainage

---

## 📞 Support

Des questions ? Ouvre une issue sur GitHub.
