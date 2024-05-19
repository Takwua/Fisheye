// Partie 1: Fonctionnalités générales

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


// Classe représentant un photographe
class Photographer {
    constructor(data) {
        this.name = data.name; // Nom du photographe
        this.id = data.id; // Identifiant unique du photographe
        this.city = data.city; // Ville où le photographe est basé
        this.country = data.country;    // Pays du photographe
        this.tagline = data.tagline;  // Phrase d'accroche ou slogan du photographe
        this.price = data.price;   // Tarif journalier du photographe
        this.portrait = data.portrait; // Nom du fichier de portrait du photographe
    }
}


// Classe de base pour les médias
class Media {
    constructor(data) {
        this.id = data.id; // ID unique du média
        this.photographerId = data.photographerId; // ID du photographe associé
        this.title = data.title; // Titre du média
        this.likes = data.likes; // Nombre de likes du média
        this.date = data.date; // Date de création du média
        this.price = data.price; // Prix du média
        this.alt = data.alt; // Texte alternatif
    }
}

// Classe pour les images, héritant de Media
class Image extends Media {
    constructor(data) {
        super(data);
        this.image = data.image; // Nom du fichier image
    }
}

// Classe pour les vidéos, héritant de Media
class Video extends Media {
    constructor(data) {
        super(data);
        this.video = data.video; // Nom du fichier vidéo
    }
}

// Fabrique de médias qui crée des instances de Image ou de Video selon le type de données
class MediasFactory {
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

// Partie 2: Profil du photographe - Header

class PhotographerHeader {
    constructor(photographer) {
        this.photographer = photographer;
    }

    // Met à jour le contenu du header avec les informations du photographe
    createPhotographerHeader() {
        const { name, city, country, price, tagline, portrait } = this.photographer;
        document.querySelector(".modal_form_name").textContent = name; // Met à jour le nom du formulaire modal
        document.querySelector('meta[name="description"]').content =
            `Découvrez ${name}, photographe professionnel basé à ${city}, ${country}, offrant ses services à partir de ${price} € / jour.`; // Met à jour la méta-description

        const profilePageHeader = document.querySelector(".main_about");
        if (profilePageHeader) {
            // Insère le contenu du header avec le nom, la localisation, la devise, et la vignette
            profilePageHeader.innerHTML = `
                <div class="photographer_profile__infos">
                    <h1 class="photographer_name">${name}</h1>
                    <p class="photographer_location">${city}, ${country}</p>
                    <p class="photographer_tagline">${tagline}</p>
                </div>
                <button class="btn btn_cta" type="button" aria-label="Ouvrir le formulaire de contact">Contactez-moi</button>
                <img class="photographer_thumbnail" src="assets/images/photographers/thumbnails/${portrait}" alt="${name}">
            `;
        }
    }
}

// Partie 3: Profil du photographe - Médias

class PhotographerMedias {
    constructor(photographer, medias) {
        this.photographer = photographer;
        this.medias = medias;
    }

    // Crée le contenu pour la section des médias
    createPhotographerMedias() {
        const profilePageContent = document.querySelector(".main_content_medias");
        const galleryItems = this.medias.map(media => {
            const mediaType = media.image
                ? `<img class="gallery_thumbnail" src="./assets/images/photographers/samplePhotos-Small/${this.photographer.name}/${media.image}" alt="${media.alt}">`
                : `<video class="gallery_thumbnail" aria-label="${media.alt}"><source src="./assets/images/photographers/samplePhotos-Small/${this.photographer.name}/${media.video}" type="video/mp4"></video>`;

            return `
                <article class="gallery_card">                           
                    <a href="#" data-media="${media.id}" role="link" aria-label="View media large">
                        <figure>${mediaType}</figure>
                    </a>
                    <figcaption>
                        <h2>${media.title}</h2>
                        <div role="group" aria-label="Like button and number of likes">
                            <span class="nbLike">${media.likes}</span>
                            <button class="btn_like" type="button" aria-label="Like" data-id="${media.id}">
                                <span class="fas fa-heart" aria-hidden="true"></span>
                            </button>
                        </div>
                    </figcaption>
                </article>
            `;
        }).join("");

        profilePageContent.innerHTML = `<section class="gallery">${galleryItems}</section><aside><p class="photographer_Likes"><span class="photographer_likes_count"></span><span class="fas fa-heart" aria-hidden="true"></span></p><span>${this.photographer.price}€ / jour</span></aside>`;
    }
}


// Partie 4: Total des likes et gestion des likes

const displayTotalLikes = async () => {
    const { medias } = await getPhotographerById(); // Récupérer les données médias
    const likesElement = document.querySelector(".photographer_likes_count"); // Sélectionner l'élément affichant le total des likes
    const allBtnLike = document.querySelectorAll(".btn_like"); // Sélectionner tous les boutons de "like"

    const updateTotalLikes = () => { // Fonction pour mettre à jour le total des likes
        likesElement.textContent = `${medias.reduce((acc, m) => acc + m.likes, 0)}`; // Calculer et afficher le total
    };

    allBtnLike.forEach(btn => { // Pour chaque bouton de "like"
        btn.addEventListener("click", () => { // Ajouter un écouteur d'événement
            const media = medias.find(m => m.id == btn.dataset.id); // Trouver le média correspondant
            media.likes += btn.classList.toggle("liked") ? 1 : -1; // Incrémenter ou décrémenter les likes
            btn.previousElementSibling.textContent = `${media.likes}`; // Mettre à jour l'affichage des likes pour ce média
            updateTotalLikes(); // Mettre à jour le total
        });
    });

    updateTotalLikes(); // Initialiser l'affichage du total des likes
};

// Partie 5: Ouverture et fermeture du formulaire de contact

export const openCloseFormContact = () => {
    const contactBtn = document.querySelector(".btn_cta"); // Sélecteur du bouton de contact
    const contactModal = document.querySelector(".modal_wrapper"); // Sélecteur de la modale
    const closeModal = document.querySelector(".btn_close"); // Bouton pour fermer la modale

    // Lors du clic sur le bouton de contact, ouvrir la modale
    contactBtn.addEventListener("click", () => {
        contactModal.style.display = "flex"; // Afficher la modale
        closeModal.focus(); // Mettre le focus sur le bouton de fermeture
    });

    // Lors du clic sur le bouton de fermeture, fermer la modale
    closeModal.addEventListener("click", () => contactModal.style.display = "none");
};





// Partie 6: Validation du formulaire

const validateForm = () => {
    const form = document.querySelector('.modal_form form'); // Sélection du formulaire
    const firstName = document.querySelector("#firstname"); // Prénom
    const lastName = document.querySelector("#lastname"); // Nom de famille
    const email = document.querySelector("#email"); // Email
    const message = document.querySelector("#message"); // Message

    // Gérer l'entrée utilisateur pour afficher des messages personnalisés
    form.addEventListener('input', () => displayCustomMessage());

    // Lors de la soumission du formulaire
    form.addEventListener('submit', e => {
        e.preventDefault(); // Empêcher le rechargement de la page
        if (form.checkValidity()) { // Si le formulaire est valide
            const formDatas = {
                firstName: firstName.value, // Stocker les valeurs du formulaire
                lastName: lastName.value,
                email: email.value,
                message: message.value,
            };
            console.log(JSON.stringify(formDatas)); // Afficher les données sous forme de chaîne JSON
            form.reset(); // Réinitialiser le formulaire
        } else {
            displayCustomMessage(); // Afficher les messages d'erreur si invalide
        }
    });

    const checkInputValidity = (input, regex) => { // Fonction de validation des entrées
        const isValid = regex.test(input.value); // Vérifier si l'entrée correspond au regex
        const errorMessage = input.dataset.error; // Message d'erreur pour l'entrée
        const messageProvider = input.nextElementSibling; // Où afficher le message d'erreur

        if (isValid) { // Si l'entrée est valide, enlever les erreurs
            messageProvider.innerHTML = "";
            messageProvider.removeAttribute("role");
            input.removeAttribute("aria-invalid");
        } else { // Sinon, afficher le message d'erreur
            messageProvider.innerHTML = errorMessage;
            messageProvider.setAttribute("role", "alert");
            input.setAttribute("aria-invalid", "true");
        }

        // Mettre à jour la classe de l'entrée selon la validité
        input.classList.toggle('invalid', !isValid);
        input.classList.toggle('valid', isValid);
    };

    // Fonction pour afficher des messages personnalisés selon la validité des entrées
    const displayCustomMessage = () => {
        const regexName = /^([A-Za-z|\s]{3,15})?([-]{0,1})?([A-Za-z|\s]{3,15})$/; // Regex pour les noms
        const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Regex pour les emails
        const regexMessage = /^[A-Za-z0-9|\s]{20,200}$/; // Regex pour les messages

        // Vérifier la validité de chaque entrée
        checkInputValidity(firstName, regexName);
        checkInputValidity(lastName, regexName);
        checkInputValidity(email, regexEmail);
        checkInputValidity(message, regexMessage);
    };
};


// Partie 7: Lightbox pour afficher les médias en grand

const displayLightbox = medias => {
    // Sélectionner les éléments de la lightbox
    const lightboxWrapper = document.querySelector('.lightbox_wrapper');
    const btnClose = document.querySelector('.btn_close_lightbox');
    const btnPrevious = document.querySelector('.btn_previous');
    const btnNext = document.querySelector('.btn_next');
    const lightboxMedia = document.querySelector('.lightbox_media');
    const mediaProvider = Array.from(document.querySelectorAll('.gallery_card a'));

    // Récupérer le photographe et sa liste de médias
    const photographer = medias.photographer;
    const mediasList = medias.medias;
    let currentIndex = 0;

    // Ouvrir la lightbox au clic sur un média
    mediaProvider.forEach(media => {
        media.addEventListener('click', () => {
            currentIndex = mediasList.findIndex(m => m.id == media.dataset.media); // Définir l'indice du média actuel
            lightboxWrapper.style.display = 'flex'; // Afficher la lightbox
            btnClose.focus(); // Mettre le focus sur le bouton de fermeture
            lightboxTemplate(); // Mettre à jour le contenu
        });
    });

    // Fonction pour afficher le contenu du média dans la lightbox
    const lightboxTemplate = () => {
        const currentMedia = mediasList[currentIndex];
        const srcPath = `./assets/images/photographers/samplePhotos-Medium/${photographer.name}/`;
        const mediaContent = currentMedia.image
            ? `<img src="${srcPath + currentMedia.image}" alt="${currentMedia.alt}">`
            : `<video controls aria-label="${currentMedia.alt}"><source src="${srcPath + currentMedia.video}" type="video/mp4"></video>`;

        lightboxMedia.innerHTML = `${mediaContent}<figcaption>${currentMedia.title}</figcaption>`; // Insérer le média et sa légende
    };

    // Fonction pour fermer la lightbox
    const closeLightbox = () => {
        lightboxWrapper.style.display = 'none'; // Cacher la lightbox
        lightboxMedia.innerHTML = ''; // Effacer le contenu
    };

    // Gestion des événements pour changer de média et fermer la lightbox
    btnPrevious.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + mediasList.length) % mediasList.length; // Précédent
        lightboxTemplate(); // Actualiser le contenu
    });

    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % mediasList.length; // Suivant
        lightboxTemplate(); // Actualiser le contenu
    });

    btnClose.addEventListener('click', closeLightbox); // Fermer la lightbox
    document.addEventListener('keyup', e => { // Navigation par touches du clavier
        if (e.key === 'Escape') closeLightbox(); // Fermer sur Escape
        if (e.key === 'ArrowLeft') btnPrevious.click(); // Précédent sur flèche gauche
        if (e.key === 'ArrowRight') btnNext.click(); // Suivant sur flèche droite
    });
};



// Partie 8: Filtres et tri des médias

// Fonction pour ouvrir/fermer le menu déroulant
const openCloseFilterMenu = () => {
    const filterMenu = document.querySelector(".dropdown_content"); // Menu déroulant
    const filterMenuButton = document.querySelector(".btn_drop"); // Bouton pour ouvrir/fermer
    const filterButtons = document.querySelectorAll(".dropdown_content button"); // Boutons des options du menu

    filterMenuButton.addEventListener("click", () => {
        const isExpanded = filterMenuButton.getAttribute("aria-expanded") === "true"; // Vérifier si le menu est ouvert
        filterMenuButton.setAttribute("aria-expanded", !isExpanded); // Basculer l'attribut aria-expanded
        filterMenu.classList.toggle("curtain_effect"); // Basculer l'effet rideau
        document.querySelector(".fa-chevron-up").classList.toggle("rotate"); // Rotation de la flèche

        const isVisible = filterMenu.classList.contains("curtain_effect"); // Menu visible?
        filterMenu.setAttribute("aria-hidden", !isVisible ? "true" : "false"); // Mettre à jour aria-hidden
        const tabIndexValue = isVisible ? "0" : "-1"; // TabIndex selon la visibilité
        filterButtons.forEach(button => button.setAttribute("tabindex", tabIndexValue)); // Mettre à jour le tabIndex
    });
};

// Fonction pour afficher les médias en utilisant des filtres
const displayMediaWithFilter = mediasTemplate => {
    const currentFilter = document.querySelector('#current_filter'); // Filtre courant
    const allFilters = document.querySelectorAll('.dropdown_content li button'); // Tous les filtres

    allFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            currentFilter.textContent = filter.textContent; // Mettre à jour le filtre courant
            allFilters.forEach(f => f.style.display = 'block'); // Afficher tous les filtres
            filter.style.display = 'none'; // Masquer le filtre sélectionné

            // Trier les médias selon le filtre
            switch (filter.textContent) {
                case 'Titre': mediasTemplate.medias.sort((a, b) => a.title.localeCompare(b.title)); break;
                case 'Popularité': mediasTemplate.medias.sort((a, b) => b.likes - a.likes); break;
                case 'Date': mediasTemplate.medias.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
            }

            mediasTemplate.createPhotographerMedias(); // Recréer les médias avec le nouveau filtre
            displayLightbox(mediasTemplate); // Afficher la lightbox
            displayTotalLikes(); // Mettre à jour le total des likes
        });
    });
};


// Partie 9: Affichage du profil du photographe et de ses médias

const photographersApi = new DataHandler("./data/photographers.json");
const photographerId = new URLSearchParams(window.location.search).get("id");

const getPhotographerById = async () => {
    const { photographers, media } = await photographersApi.get();
    const photographer = photographers
        .map(photographer => new Photographer(photographer))
        .find(photographer => photographer.id == photographerId);
    const medias = media
        .map(media => new MediasFactory(media))
        .filter(media => media.photographerId == photographerId);
    return { photographer, medias };
};

const displayProfilePage = async () => {
    const { photographer, medias } = await getPhotographerById();
    const headerTemplate = new PhotographerHeader(photographer);
    headerTemplate.createPhotographerHeader();
    const mediasTemplate = new PhotographerMedias(photographer, medias);
    mediasTemplate.createPhotographerMedias();

    displayTotalLikes();
    openCloseFormContact();
    validateForm();
    openCloseFilterMenu();
    displayMediaWithFilter(mediasTemplate)
    displayLightbox(mediasTemplate);
};

displayProfilePage();