/* // Filtres
const filtresTemplate = `
    <section class="contenu">
        <div class="contenu-filtres">
            <h2>Trier par</h2>
            <div class="section-filtres">
                <div class="menu-deroulant">
                    <button class="bouton-menu-deroulant" type="button" role="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="filter_options" aria-label="Trier par">
                        <span id="filtre-courrant">Titre</span>
                        <span class="fa-solid fa-chevron-up" aria-hidden="true"></span>
                    </button>
                    <ul class="contenu-menu-deroulant" aria-hidden="true">
                        <li role="option">
                            <button type="button" tabindex="-1" aria-label="Trier par titre">Titre</button>
                        </li>
                        <li role="option">
                            <button type="button" tabindex="-1" aria-label="Trier par popularité">Popularité</button>
                        </li>
                        <li role="option">
                            <button type="button" tabindex="-1" aria-label="Trier par date">Date</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="contenu-medias"></div>
    </section>
`;

// Formulaire
const formulaireTemplate = `
    <div class="formulaire-wrapper wrapper" aria-modal="true" role="dialog">
        <div class="formulaire" aria-describedby="formTitle">
            <div class="formulaire_titre">
                <h2 id="formTitle">Contactez-moi <button class="bouton-fermer" type="button" aria-label="Fermer le formulaire de contact"></button></h2>
                <p class="formulaire-nom"></p>
            </div> 
            <form novalidate>
                <div class="formulaire-contenu">
                    <label id="prenom-label" for="prenom">Prénom <span aria-hidden="true">*</span></label>
                    <input class="formField" aria-labelledby="prenom-label" type="text" id="prenom" name="prenom" maxlength="15" data-error="Minimum 3 caractères, maximum 15 caractères. Les chiffres et caractères spéciaux différents de - ne sont pas autorisés." required/>
                    <span></span>
                </div>
                <div class="formulaire-contenu">
                    <label id="nom-label" for="nom">Nom <span aria-hidden="true">*</span></label>
                    <input class="formField" aria-labelledby="nom-label" type="text" id="nom" name="nom" maxlength="15" required>
                    <span></span>
                </div>
                <div class="formulaire-contenu">
                    <label id="email-label" for="email">Email <span aria-hidden="true">*</span></label>
                    <input class="formField" aria-labelledby="email-label" type="email" id="email" name="email" maxlength="100" required>
                    <span></span>
                </div>
                <div class="formulaire-contenu">
                    <label id="message-label" for="message">Votre message <span aria-hidden="true">*</span></label>
                    <textarea class="formField" aria-labelledby="message-label" id="message" name="message" maxlength="200" required></textarea>
                    <span></span>
                </div>
                <button class="bouton bouton-envoye" type="submit" aria-label="Envoyer">Envoyer</button>
            </form>
        </div>
    </div>
`; */

// Lightbox
/* const lightboxTemplate = `
    <div class="lightbox_wrapper wrapper" aria-modal="true" role="dialog">
        <div class="lightbox" aria-label="Vue détaillée du média">
            <button class="bouton-fermer-lightbox bouton-fermer" aria-label="Fermer la boîte de dialogue"></button>
            <button class="bouton-suivant" aria-label="Média suivant"></button>
            <button class="bouton-precedent" aria-label="Média précédent"></button>
            <figure class="lightbox_media" role="media" aria-label="Média actuel"></figure>
        </div> 
    </div>
`; */

// Injection des templates dans le DOM
/* document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML += filtresTemplate + formulaireTemplate;
}); */

// Export des templates
//export { filtresTemplate, formulaireTemplate };



class PhotographeHeader {
    constructor(photographe, medias) {
        this.photographe = photographe;
        this.medias = medias;
    }

    creerProfile() {
        this.creerHeader();
        this.creerMedias();
    }

    creerPhotoprapheHeader() {
        const { nom, ville, pays, prix, description, portrait } = this.photographe;
        document.querySelector(".formulaire-nom").textContent = nom;
        document.querySelector('meta[name="description"]').content =
            `Découvrez ${nom}, photographe professionnel basé à ${ville}, ${pays}, offrant ses services à partir de ${prix} € / jour.`;

        const profilePageHeader = document.querySelector(".apropos");
        if (profilePageHeader) {
            profilePageHeader.innerHTML = `
                <div class="informations_du_profil_photographe">
                    <h1 class="photographe_nom">${nom}</h1>
                    <p class="photographe_location">${ville}, ${pays}</p>
                    <p class="photographe_description">${description}</p>
                </div>
                <button class="bouton bouton_cta" type="button" aria-label="Ouvrir le formulaire de contact">Contactez-moi</button>
                <img class="photographe_miniature" src="assets/images/photographe/miniature/${portrait}" alt="${nom}">
            `;
        }
    }

    creerMediaPhotographe() {
        const profilPageContenu = document.querySelector(".contenu-medias");
        const galleryItems = this.medias.map(media => {
            const mediaType = media.image
                ? `<img class="gallery_miniature" src="./assets/images/photographe/simplePhotos-Petite/${this.photographe.nom}/${media.image}" alt="${media.alt}">`
                : `<video class="gallery_miniature" aria-label="${media.alt}"><source src="./assets/images/photographe/simplePhotos-Petite/${this.photographe.nom}/${media.video}" type="video/mp4"></video>`;

            return `
                <article class="carte_gallerie">                           
                    <a href="#" data-media="${media.id}" role="link" aria-label="View media large">
                        <figure>${mediaType}</figure>
                    </a>
                    <figcaption>
                        <h2>${media.titre}</h2>
                        <div role="group" aria-label="Like button and number of likes">
                            <span class="nbLike">${media.likes}</span>
                            <button class="bouton-like" type="button" aria-label="Like" data-id="${media.id}">
                                <span class="fas fa-heart" aria-hidden="true"></span>
                            </button>
                        </div>
                    </figcaption>
                </article>
            `;
        }).join("");

        profilPageContenu.innerHTML = `<section class="gallery">${galleryItems}</section><aside><p class="photographer_Likes"><span class="likes-compte-photographer"></span><span class="fas fa-heart" aria-hidden="true"></span></p><span>${this.photographe.prix}€ / jour</span></aside>`;
    }
}

export { PhotographeHeader };
