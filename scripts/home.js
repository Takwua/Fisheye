import { obtenirDonnées, GestionDonnees, Photographe } from './data.js';


// Carte d'un photographe
class cartePhotographe {
    constructor(photographer) {
        this.photographer = photographer;
    }

    render() {
        const { id, nom, portrait, ville, pays, description, prix } = this.photographer;
        const article = document.createElement('article');
        article.innerHTML = `
            <a href="photographer.html?id=${id}" role="link" aria-label="Voir le profil de ${nom}">
                <img class="photographe-miniature" src="./assets/images/photographers/thumbnails/${portrait}" alt="${nom}">
                <h2 class="photographe-nom">${nom}</h2>
            </a>
            <p class="photographe-location">${ville}, ${pays}</p>
            <p class="photographe-description">${description}</p>
            <span class="photographe-prix">${prix}€/jour</span>
        `;
        return article;
    }
}


// Sélection de la section pour les photographes
const photographeSection = document.querySelector(".contenu-photographe");
const gestionPhotographe = new GestionDonnees("./data/photographers.json");

const afficherPhotographe = async () => {
    try {
        const data = await gestionPhotographe.get();
        const photographes = data.photographe.map(data => new Photographe(data));
        photographes.forEach(photographe => {
            const carte = new cartePhotographe(photographe);
            photographeSection.appendChild(carte.render());
        });
    } catch (error) {
        console.error("Erreur lors de l'affichage des photographes :", error.message);
    }
};

afficherPhotographe(); // Appel de la fonction pour afficher les photographes