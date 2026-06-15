# Questions & points à valider avec la cliente
*Sens Solidaire — Refonte du site web*
*Document évolutif — à compléter au fil du développement*

---

## Design & Identité visuelle

| # | Sujet | Question | Réponse cliente |
|---|---|---|---|
| D1 | **Logo navbar** | Fournir le logo en version blanche (SVG ou PNG fond transparent) pour la navbar transparente sur le Hero. | |
| D2 | **Couleur badge Service Civique** | Le badge Service Civique doit se distinguer du badge Volontariat (vert). Suggestion : bleu #1D6FA4. Tu valides ? et pour les autres badge? | |
| D3 | **Logos partenaires** | 18 logos dispersés sur le site actuel. Peux-tu les fournir tous en SVG ou PNG fond transparent regroupés ? + autres logos dnas les pages actions sur le terrains, les centraliser?| |

---

## Témoignages

| # | Sujet | Question | Réponse cliente |
|---|---|---|---|
| T1 | **Format des témoignages** | Le site intègre un formulaire de soumission de témoignages (prénom, mission associée, commentaire, case RGPD). Souhaites-tu conserver ce format, ou préfères-tu une autre approche (collecte manuelle, import depuis Google Forms, etc.) ? | |
| T2 | **Extraction depuis les rapports de mission** | Souhaites-tu que nous parcourions les rapports de mission existants pour en extraire des témoignages ? Si oui, note que cela nécessite obligatoirement le consentement écrit des volontaires concernés avant toute publication — les rapports de mission sont des documents personnels. Une solution serait de les recontacter par email pour leur demander leur accord explicite. | |

---

## Contenu & Structure

| # | Sujet | Question | Réponse cliente |
|---|---|---|---|
| C1 | **Section Missions Accueil** | Afficher les 5 destinations (Kenya, Sénégal, Sri Lanka, Pérou, Sumatra) ou les 3 types de missions ? Notre recommandation : par destination. +/- ajout service civique + congé + groupe jeune | |
| C2 | **Types de missions officiels** | Valider les types : Volontariat individuel / Groupe jeunes / Congé solidaire / Service civique. Impact sur les FilterChips et badges des cards. | |
| C3 | **Crop images galerie** | V1 : crop automatique au centre. V2 possible : outil recadrage dans le dashboard. Tu valides cette contrainte ? | |
| C4 | **Contenu pages** | Fournir les textes définitifs pour les pages : Accueil, À propos, Missions, Contact. Nous avons utilisé le contenu du site actuel comme base. | |
| C5 | **Photos missions** | Fournir des photos libres de droits ou autorisées pour chaque mission et action. Format recommandé : paysage, sujet centré, lumière naturelle. | |
| C6 | **Page Service Civique officielle** | La page officielle du Service Civique parle encore de la Côte d'Ivoire comme destination. Est-ce encore d'actualité ? Faut-il l'intégrer au site ou la retirer ? | |
| C7 | **Missions groupe jeunes** | Valider les destinations et le contenu pour la section Groupe jeunes. PDFs programme Kenya/Sénégal à fournir en haute qualité pour téléchargement. | |
| C8 | **Congé solidaire** | Valider le contenu de la section Congé solidaire. Y a-t-il un formulaire de contact spécifique ou un email dédié pour les entreprises ? | |
| C9 | **Tags thématiques missions** | Ajouter des tags thématiques sur les missions (faune_sauvage, environnement, développement_communautaire...) pour filtrage avancé. À valider avec la cliente avant implémentation. | |
| C10 | **Images missions** | Les images actuelles sont provisoires issues du site actuel. Fournir les photos définitives validées pour chaque mission et action terrain. | |
| C11 | **Lien officiel Congé solidaire** | Souhaites-tu qu'on ajoute un bouton lien vers la page officielle service-public.fr sur le congé solidaire, pour rassurer les employeurs ? Si oui, on l'intègre dans le bloc contact de cette section. | |
| C12 | **Intégration Buffer** | La cliente utilise déjà Buffer pour ses réseaux sociaux. Est-elle intéressée par une intégration dashboard → Buffer ? Au moment de la publication d'un article, un brouillon serait automatiquement créé dans Buffer avec le titre, l'image et le lien vers l'article. Elle n'aurait plus qu'à valider depuis Buffer pour publier sur tous ses réseaux → Si oui : récupérer la clé API Buffer dans son compte. | |

---

## Fonctionnalités & Dashboard

| # | Sujet | Question | Réponse cliente |
|---|---|---|---|
| F1 | **Modération témoignages** | Les témoignages soumis par les visiteurs doivent-ils être validés avant publication ? Qui valide ? | |
| F2 | **Gestion des missions** | Qui crée et modifie les missions dans le dashboard ? Une seule personne ou plusieurs admins ? | |
| F3 | **Langue du site** | Le site doit-il être bilingue FR/EN pour le MVP ou uniquement en français ? | |
| F4 | **Recadrage images galerie** | V1 : crop automatique au centre. V2 : outil recadrage dans le dashboard. La V1 te convient-elle pour le lancement ? | |
| F5 | **Notifications admin** | Souhaites-tu recevoir un email quand un témoignage est soumis ou un formulaire de contact rempli ? | |
| F6 | **Gestion partenaires** | Les 18 logos partenaires doivent-ils être gérables depuis le dashboard (ajout/suppression) ou contenu fixe ? | |

---

## Contenu & Structure — Questions complémentaires

| # | Sujet | Question | Réponse cliente |
|---|---|---|---|
| C11 | **Ateliers adultes** | "Ateliers adultes" mentionnés sur le site — de quoi s'agit-il exactement ? | |
| C12 | **Sensibilisation développement durable** | Les ateliers de sensibilisation au développement durable sont-ils uniquement pour les écoles et lycées ? Couvrent-ils Nice / Annemasse / Genève ? | |
| C13 | **Ateliers pédagogiques** | Les ateliers pédagogiques concernent-ils uniquement les écoles, MJC, ludothèques ? Sur quelles antennes (Nice / Annemasse / Genève) ? | |
| C14 | **Correspondances scolaires** | Les correspondances scolaires sont-elles uniquement sur Nice ? | |
| C15 | **Éducation à la citoyenneté** | Les ateliers "éducation à la citoyenneté" — contenu et public cible à préciser. | |
| C16 | **Rapport de mission** | Le rapport de mission est-il obligatoire pour tous les volontaires ? Qui gère les témoignages courts présents sur la page d'accueil ? | |
| C17 | **Projets environnementaux** | Les projets environnementaux sont-ils réalisés dans le cadre des missions ou sont-ils des éléments indépendants ? Comment organiser leur affichage pour l'utilisateur : par thématique, par pays ? (certains projets couvrent plusieurs thématiques) | |
| C18 | **Congé solidaire** | Le congé solidaire au Kenya et au Sénégal suit-il la même organisation que les missions classiques — la seule différence étant que l'employeur finance pour plusieurs personnes ? | |
| C19 | **Côte d'Ivoire** | Plus de missions en Côte d'Ivoire mais toujours des actions en cours ? Que faire du contenu existant sur le site ? | |
| C20 | **Gestion des médias** | Qui aura accès pour gérer les médias dans le dashboard ? Quels types de médias (photos, vidéos, PDFs) ? | |
| C21 | **Logo & navbar** | Fournir le logo en version blanche + tous les éléments de la barre de navigation pour intégration finale. | |
| C22 | **Droits à l'image** | Vérification des droits à l'image sur toutes les photos utilisées sur le site — confirmer que les autorisations sont en ordre.  elle doit fournir les autorisations avant le lancement*.| |
| C23 | **Logos partenaires pages actions** | Des logos partenaires apparaissent en bas des pages "actions pour l'environnement" — faut-il les centraliser dans une seule section ou les garder par page ? | |


** *Atteinte au droit à l'image — toute personne reconnaissable sur une photo peut exiger le retrait et des dommages et intérêts
Droit d'auteur — le photographe peut poursuivre pour utilisation non autorisée de son œuvre** 

---

*Document créé le 4 juin 2026 — Mis à jour le 11 juin 2026*