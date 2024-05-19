// Fonction pour récupérer les données d'une URL
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur : ${response.status} - ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error.message);
        throw error;
    }
};

// API pour interagir avec les données
class DataHandler {
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
class Photographer {
    constructor(details) {
        this.name = details.name;
        this.id = details.id;
        this.city = details.city;
        this.country = details.country;
        this.tagline = details.tagline;
        this.price = details.price;
        this.portrait = details.portrait;
    }
}

// Carte d'un photographe
class PhotographerCard {
    constructor(photographer) {
        this.photographer = photographer;
    }

    render() {
        const article = document.createElement('article');
        article.innerHTML = `
            <a href="photographer.html?id=${this.photographer.id}" role="link" aria-label="View Profile of ${this.photographer.name}">
                <img class="photographer-thumbnail" src="./assets/images/photographers/thumbnails/${this.photographer.portrait}" alt="${this.photographer.name}">
                <h2 class="photographer-name">${this.photographer.name}</h2>
            </a>
            <p class="photographer-location">${this.photographer.city}, ${this.photographer.country}</p>
            <p class="photographer-tagline">${this.photographer.tagline}</p>
            <span class="photographer-price">${this.photographer.price}€/day</span>
        `;
        return article;
    }
}

// Sélection de la section pour les photographes
const photographersSection = document.querySelector(".main_photographers");
const photographersDataHandler = new DataHandler("./data/photographers.json");

const displayPhotographers = async () => {
    try {
        const data = await photographersDataHandler.get(); // Correction de la méthode appelée
        const photographers = data.photographers.map(details => new Photographer(details));
        photographers.forEach(photographer => {
            const card = new PhotographerCard(photographer);
            photographersSection.appendChild(card.render());
        });
    } catch (error) {
        console.error("Erreur lors de l'affichage des photographes :", error.message);
    }
};

displayPhotographers(); // Appel de la fonction pour afficher les photographes