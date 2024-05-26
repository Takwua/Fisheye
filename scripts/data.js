// Fonction pour récupérer les données d'une URL

export async function obtenirDonnées(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur : ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.message);
        throw error;
    }
}

export class GestionDonnees {
    constructor(url) {
        this.url = url;
    }

    async get() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) throw new Error(`Erreur : ${response.status} - ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des données via l'API :", error.message);
            throw error;
        }
    }
}

// Représentation d'un photographe
export class Photographe {
    constructor(data) {
        this.nom = data.nom;
        this.id = data.id;
        this.ville = data.ville;
        this.pays = data.pays;
        this.description = data.description;
        this.prix = data.prix;
        this.portrait = data.portrait;
    }
}

// Classe de base pour les médias
export class Media {
    constructor(data) {
        this.id = data.id; // ID unique du média
        this.photographeId = data.photographeId; // ID du photographe associé
        this.titre = data.titre; // Titre du média
        this.likes = data.likes; // Nombre de likes du média
        this.date = data.date; // Date de création du média
        this.prix = data.price; // Prix du média
        this.alt = data.alt; // Texte alternatif
    }
}

// Classe pour les images, héritant de Media
export class Image extends Media {
    constructor(data) {
        super(data);
        this.image = data.image; // Nom du fichier image
    }
}

// Classe pour les vidéos, héritant de Media
export class Video extends Media {
    constructor(data) {
        super(data);
        this.video = data.video; // Nom du fichier vidéo
    }
}

// Fabrique de médias qui crée des instances de Image ou de Video selon le type de données
export class MediasFactory {
    constructor(data) {
        // Si le champ "image" existe, créer un objet Image
        if (data.image) {
            return new Image(data);
        }
        // Si le champ "video" existe, créer un objet Video
        else if (data.video) {
            return new Video(data);
        }
        // Si aucun champ correspondant, déclencher une erreur
        else {
            throw new Error('Type de média inconnu');
        }
    }
}
