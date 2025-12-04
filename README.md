# 📚 Bookland

Bookland est une plateforme web complète dédiée aux passionnés de lecture. Elle permet aux utilisateurs de gérer leur bibliothèque personnelle, suivre leurs progrès de lecture, créer des tâches de lecture, et interagir avec une communauté de lecteurs via un chat en temps réel.

## 🎯 À propos du projet

Bookland combine les fonctionnalités d'une bibliothèque numérique avec des outils de productivité et un réseau social pour les amateurs de livres. L'application offre une expérience utilisateur moderne et intuitive pour découvrir, organiser et partager des livres.

## ✨ Fonctionnalités principales

### 👤 Gestion des utilisateurs
- Inscription et connexion sécurisée avec JWT
- Authentification à deux facteurs (optionnel)
- Gestion des profils utilisateur
- Système de rôles (Utilisateur/Administrateur)

### 📖 Bibliothèque personnelle
- Ajout et organisation de livres par genres
- Téléchargement de fichiers PDF
- Recherche et filtrage de livres
- Gestion des collections personnelles

### ✅ Système de tâches (Todos)
- Création de tâches de lecture personnalisées
- Modèles de tâches réutilisables
- Suivi des tâches terminées/incomplètes
- Système de récompenses et badges

### ⏱️ Suivi du temps de lecture
- Chronomètre de lecture intégré
- Historique des sessions de lecture
- Statistiques de temps passé à lire
- Rapports périodiques

### 💬 Fonctionnalités sociales
- Publications et partages de livres
- Système de likes et commentaires
- Chat en temps réel entre utilisateurs
- Notifications push

### 👨‍💼 Panel d'administration
- Gestion des utilisateurs et livres
- Modération du contenu
- Analyse des statistiques
- Gestion des notifications

## 🛠️ Technologies utilisées

### Frontend
- **Angular 16** - Framework JavaScript moderne
- **TypeScript** - Langage typé pour plus de robustesse
- **Bootstrap 5** - Framework CSS responsive
- **RxJS** - Programmation réactive
- **WebSocket** - Communication temps réel

### Backend
- **Spring Boot 3.4.4** - Framework Java pour APIs REST
- **Spring Security** - Authentification et autorisation
- **Spring Data JPA** - Accès aux données
- **PostgreSQL** - Base de données relationnelle (Docker)
- **MySQL/MariaDB** - Base de données relationnelle (XAMPP/local)
- **JWT** - Tokens d'authentification sécurisés
- **Maven** - Gestion des dépendances

### Infrastructure
- **Docker** - Conteneurisation des services
- **Docker Compose** - Orchestration multi-conteneurs
- **Nginx** - Serveur web pour le frontend
- **pgAdmin** - Interface d'administration PostgreSQL
- **phpMyAdmin** - Interface d'administration MySQL/MariaDB (XAMPP)

## 🚀 Installation et exécution

### Prérequis
- Docker et Docker Compose installés
- Au moins 4 Go de RAM disponible
- Git pour cloner le repository

### Démarrage rapide avec Docker (Recommandé)

1. **Cloner le repository**
   ```bash
   git clone https://github.com/nedersaidi351/bookland.git
   cd bookland
   ```

2. **Lancer tous les services**
   ```bash
   docker-compose up -d --build
   ```

3. **Accéder à l'application**
   - **Application principale** : http://localhost:3000
   - **API Backend** : http://localhost:8080
   - **Interface d'administration DB** : http://localhost:5050
     - Email : `admin@bookland.com`
     - Mot de passe : `admin123`

### Installation manuelle (Alternative)

#### Configuration du backend
```bash
cd Backend/PFE
mvn clean install
mvn spring-boot:run
```

#### Configuration du frontend
```bash
cd front/bookland
npm install
ng serve
```

#### Base de données
Configurez PostgreSQL ou utilisez la configuration Docker incluse.

### Installation avec XAMPP (MySQL/MariaDB)

#### Prérequis
- XAMPP installé et démarré (Apache et MySQL)
- Java 17+
- Maven 3.6+
- Node.js 18+

#### Configuration de la base de données avec XAMPP

1. **Démarrer XAMPP**
   - Lancez XAMPP Control Panel
   - Démarrez les modules Apache et MySQL

2. **Créer la base de données**
   - Ouvrez phpMyAdmin : http://localhost/phpmyadmin
   - Créez une nouvelle base de données nommée `PFE`
   - Ou laissez l'application la créer automatiquement avec `createDatabaseIfNotExist=true`

3. **Configuration de l'application**
   - Le fichier `Backend/PFE/src/main/resources/application.yml` est déjà configuré pour MySQL
   - Vérifiez les paramètres :
     ```yaml
     spring:
       datasource:
         url: jdbc:mysql://localhost:3306/PFE
         username: root
         password: ""  # Mot de passe vide par défaut
     ```
   - Si votre MySQL a un mot de passe, modifiez la ligne `password`

4. **Lancer le backend**
   ```bash
   cd Backend/PFE
   mvn spring-boot:run
   ```
   Le backend sera accessible sur http://localhost:8088

5. **Lancer le frontend**
   ```bash
   cd front/bookland
   npm install
   ng serve
   ```
   Le frontend sera accessible sur http://localhost:4200

#### Accès aux services avec XAMPP
- **Application principale** : http://localhost:4200
- **API Backend** : http://localhost:8088
- **phpMyAdmin** : http://localhost/phpmyadmin
  - Utilisateur : `root`
  - Mot de passe : (vide par défaut)
  - Base de données : `PFE`

## 🐳 Instructions Docker

Le projet utilise Docker Compose pour une configuration simple :

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: jwt_security
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  backend:
    build: ./Backend/PFE
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  frontend:
    build: ./front/bookland
    ports:
      - "3000:80"
    depends_on:
      - backend

  pgadmin:
    image: dpage/pgadmin4
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@bookland.com
      PGADMIN_DEFAULT_PASSWORD: admin123
```

### Commandes Docker utiles
```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose up -d --build

# Supprimer les volumes (⚠️ perte des données)
docker-compose down -v
```

## 📡 Points de terminaison API

### Authentification
- `POST /api/v1/auth/register` - Inscription utilisateur
- `POST /api/v1/auth/authenticate` - Connexion utilisateur
- `POST /api/v1/auth/refresh-token` - Rafraîchir le token JWT
- `POST /api/v1/auth/verify` - Vérification 2FA

### Gestion des utilisateurs
- `GET /api/users` - Liste des utilisateurs (Admin)
- `GET /api/users/{id}` - Détails d'un utilisateur
- `PUT /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

### Gestion des livres
- `GET /api/books` - Liste des livres
- `POST /api/books` - Ajouter un livre
- `GET /api/books/{id}` - Détails d'un livre
- `PUT /api/books/{id}` - Modifier un livre
- `DELETE /api/books/{id}` - Supprimer un livre

### Publications sociales
- `GET /api/posts` - Liste des publications
- `POST /api/posts` - Créer une publication
- `GET /api/posts/{id}` - Détails d'une publication
- `PUT /api/posts/{id}` - Modifier une publication
- `DELETE /api/posts/{id}` - Supprimer une publication
- `POST /api/posts/{id}/like` - Aimer une publication

### Tâches de lecture
- `GET /api/todos` - Liste des tâches
- `POST /api/todos` - Créer une tâche
- `PUT /api/todos/{id}` - Modifier une tâche
- `DELETE /api/todos/{id}` - Supprimer une tâche
- `GET /api/todo-templates` - Modèles de tâches

### Chat et notifications
- `GET /api/chat/messages` - Messages du chat
- `POST /api/chat/messages` - Envoyer un message
- `GET /api/notifications` - Notifications utilisateur
- `POST /api/notifications` - Créer une notification

### Suivi du temps
- `GET /api/time-logs` - Logs de temps
- `POST /api/time-logs` - Créer un log de temps
- `PUT /api/time-logs/{id}` - Modifier un log

### Téléchargement de fichiers
- `POST /api/files/upload` - Télécharger un fichier
- `GET /api/files/{filename}` - Télécharger un fichier

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Navigateur    │    │   Frontend      │    │   Backend       │
│   Utilisateur   │◄──►│   Angular       │◄──►│   Spring Boot   │
│                 │    │   (Port 3000)   │    │   (Port 8080)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   API REST      │    │   PostgreSQL    │
│   (Chat temps   │    │   (HTTP/JSON)   │    │   Base de        │
│    réel)        │    │                 │    │   données       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Composants principaux

1. **Frontend Angular** : Interface utilisateur moderne et responsive
2. **Backend Spring Boot** : API RESTful avec authentification JWT
3. **Base de données PostgreSQL** : Stockage persistant des données
4. **WebSocket** : Communication temps réel pour le chat
5. **Docker** : Conteneurisation pour un déploiement facile

### Flux de données

1. L'utilisateur interagit avec l'interface Angular
2. Le frontend envoie des requêtes HTTP à l'API Spring Boot
3. Le backend traite les données et interagit avec PostgreSQL
4. Les réponses sont renvoyées au frontend pour mise à jour de l'UI
5. Le chat utilise WebSocket pour une communication bidirectionnelle

---


