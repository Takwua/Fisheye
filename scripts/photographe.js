// Partie 1: Fonctionnalités générales

import { GestionDonnees, Photographe, MediasFactory } from './data.js';
import { PhotographeHeader, PhotographeMedias } from './template.js';


// Partie 4: Total des likes et gestion des likes

const afficherTotalLikes = async () => {
    const { medias } = await obtenirPhotographeParId(); // Récupérer les données médias
    const likesElement = document.querySelector(".likes-compte-photographe"); // Sélectionner l'élément affichant le total des likes
    const tousBoutonLikes = document.querySelectorAll(".bouton-like"); // Sélectionner tous les boutons de "like"

    const updateTotalLikes = () => { // Fonction pour mettre à jour le total des likes
        likesElement.textContent = `${medias.reduce((totalLikesAccumuler, mediaObjet) => totalLikesAccumuler + mediaObjet.likes, 0)}`;
        // Calculer et afficher le total
    };

    tousBoutonLikes.forEach(bouton => { // Pour chaque bouton de "like"
        bouton.addEventListener("click", () => { // Ajouter un écouteur d'événement
            const media = medias.find(mediaItem => mediaItem.id == bouton.dataset.id); // Trouver le média correspondant
            media.likes += bouton.classList.toggle("liker") ? 1 : -1; // Incrémenter ou décrémenter les likes
            bouton.previousElementSibling.textContent = `${media.likes}`; // Mettre à jour l'affichage des likes pour ce média
            updateTotalLikes(); // Mettre à jour le total
        });
    });

    updateTotalLikes(); // Initialiser l'affichage du total des likes
};

// Partie 5: Ouverture et fermeture du formulaire de contact

const ouvertureFermetureFormulaire = () => {
    const boutonContact = document.querySelector(".bouton_cta"); // Sélecteur du bouton de contact
    const contactModal = document.querySelector(".formulaire-wrapper"); // Sélecteur de la modale
    const fermerModal = document.querySelector(".bouton-fermer"); // Bouton pour fermer la modale

    // Lors du clic sur le bouton de contact, ouvrir la modale
    boutonContact.addEventListener("click", () => {
        contactModal.style.display = "flex"; // Afficher la modale
        fermerModal.focus(); // Mettre le focus sur le bouton de fermeture
    });

    // Lors du clic sur le bouton de fermeture, fermer la modale
    fermerModal.addEventListener("click", () => contactModal.style.display = "none");
};


const validationFormulaire = () => {
    const form = document.querySelector('.formulaire form'); // Sélection du formulaire
    const nom = document.querySelector("#nom"); // Prénom
    const prenom = document.querySelector("#prenom"); // Nom de famille
    const email = document.querySelector("#email"); // Email
    const message = document.querySelector("#message"); // Message

    // Gérer l'entrée utilisateur pour afficher des messages personnalisés
    form.addEventListener('input', () => afficherMessagePersonnalise());

    // Lors de la soumission du formulaire
    form.addEventListener('submit', evenement => {
        evenement.preventDefault(); // Empêcher le rechargement de la page
        if (form.checkValidity()) { // Si le formulaire est valide
            const formDatas = {
                nom: nom.value, // Stocker les valeurs du formulaire
                prenom: prenom.value,
                email: email.value,
                message: message.value,
            };
            console.log(JSON.stringify(formDatas)); // Afficher les données sous forme de chaîne JSON
            form.reset(); // Réinitialiser le formulaire
        } else {
            afficherMessagePersonnalise(); // Afficher les messages d'erreur si invalide
        }
    });

    const validationEntree = (input, regex) => { // Fonction de validation des entrées
        const valider = regex.test(input.value); // Vérifier si l'entrée correspond au regex
        const messageErreur = input.dataset.error; // Message d'erreur pour l'entrée
        const messageFournis = input.nextElementSibling; // Où afficher le message d'erreur

        if (valider) { // Si l'entrée est valide, enlever les erreurs
            messageFournis.innerHTML = "";
            messageFournis.removeAttribute("role");
            input.removeAttribute("aria-invalid");
        } else { // Sinon, afficher le message d'erreur
            messageFournis.innerHTML = messageErreur;
            messageFournis.setAttribute("role", "alert");
            input.setAttribute("aria-invalid", "true");
        }

        // Mettre à jour la classe de l'entrée selon la validité
        input.classList.toggle('invalider', !valider);
        input.classList.toggle('valider', valider);
    };

    // Fonction pour afficher des messages personnalisés selon la validité des entrées
    const afficherMessagePersonnalise = () => {
        const regexNom = /^([A-Za-z\s]{3,15})?([-]{0,1})?([A-Za-z\s]{3,15})$/; // Regex pour les noms
        const regexEmail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/; // Regex pour les emails
        const regexMessage = /^[A-Za-z0-9\s]{20,200}$/; // Regex pour les messages

        // Vérifier la validité de chaque entrée
        validationEntree(nom, regexNom);
        validationEntree(prenom, regexNom);
        validationEntree(email, regexEmail);
        validationEntree(message, regexMessage);
    };
};


// Partie 7: Lightbox pour afficher les médias en grand

const afficherLightbox = medias => {
    // Sélectionner les éléments de la lightbox
    const lightboxWrapper = document.querySelector('.lightbox_wrapper');
    const boutonFermer = document.querySelector('.bouton-fermer-lightbox');
    const boutonPrecedent = document.querySelector('.bouton-precedent');
    const boutonSuivant = document.querySelector('.bouton-suivant');
    const lightboxMedia = document.querySelector('.lightbox_media');
    const mediaFournis = Array.from(document.querySelectorAll('.carte_gallerie a'));

    // Récupérer le photographe et sa liste de médias
    const photographes = medias.photographes;
    const mediasList = medias.medias;
    let indexActuel = 0;

    // Ouvrir la lightbox au clic sur un média
    mediaFournis.forEach(media => {
        media.addEventListener('click', () => {
            indexActuel = mediasList.findIndex(mediaItem => mediaItem.id == media.dataset.media); // Définir l'indice du média actuel
            lightboxWrapper.style.display = 'flex'; // Afficher la lightbox
            boutonFermer.focus(); // Mettre le focus sur le bouton de fermeture
            lightboxTemplate(); // Mettre à jour le contenu
        });
    });

    // Fonction pour afficher le contenu du média dans la lightbox
    const lightboxTemplate = () => {
        const mediaActuel = mediasList[indexActuel];
        const srcPath = `./assets/images/photographe/simplePhotos-Medium/${photographes.nom}/`;
        const mediaContenu = mediaActuel.image
            ? `<img src="${srcPath + mediaActuel.image}" alt="${mediaActuel.alt}">`
            : `<video controls aria-label="${mediaActuel.alt}"><source src="${srcPath + mediaActuel.video}" type="video/mp4"></video>`;

        lightboxMedia.innerHTML = `${mediaContenu}<figcaption>${mediaActuel.titre}</figcaption>`; // Insérer le média et sa légende
    };

    // Fonction pour fermer la lightbox
    const femerLightbox = () => {
        lightboxWrapper.style.display = 'none'; // Cacher la lightbox
        lightboxMedia.innerHTML = ''; // Effacer le contenu
    };

    // Gestion des événements pour changer de média et fermer la lightbox
    boutonPrecedent.addEventListener('click', () => {
        indexActuel = (indexActuel - 1 + mediasList.length) % mediasList.length; // Précédent
        lightboxTemplate(); // Actualiser le contenu
    });

    boutonSuivant.addEventListener('click', () => {
        indexActuel = (indexActuel + 1) % mediasList.length; // Suivant
        lightboxTemplate(); // Actualiser le contenu
    });

    // Fermer la lightbox lorsque le bouton Fermer est cliqué
    boutonFermer.addEventListener('click', femerLightbox);

    // Navigation par touches du clavier
    document.addEventListener('keyup', event => {
        // Fermer la lightbox sur la touche Échap
        if (event.key === 'Escape') femerLightbox();

        // Aller à la photo précédente sur la flèche gauche
        if (event.key === 'ArrowLeft') boutonPrecedent.click();

        // Aller à la photo suivante sur la flèche droite
        if (event.key === 'ArrowRight') boutonSuivant.click();
    });

};



// Partie 8: Filtres et tri des médias

// Fonction pour ouvrir/fermer le menu déroulant
const ouvrirFermerFiltres = () => {
    const filtreMenu = document.querySelector(".contenu-menu-deroulant"); // Sélection du menu déroulant
    const filtreMenuBouton = document.querySelector(".bouton-menu-deroulant"); // Sélection du bouton d'ouverture/fermeture
    const filtreBoutons = document.querySelectorAll(".contenu-menu-deroulant button"); // Sélection de tous les boutons d'options du menu

    filtreMenuBouton.addEventListener("click", () => {
        const menuEstOuvert = filtreMenuBouton.getAttribute("aria-expanded") === "true"; // Vérifier si le menu est ouvert
        filtreMenuBouton.setAttribute("aria-expanded", !menuEstOuvert); // Inverser l'attribut aria-expanded
        filtreMenu.classList.toggle("animationOuverture"); // Basculer l'effet rideau
        document.querySelector(".fa-chevron-up").classList.toggle("rotation"); // Rotation de la flèche

        const estVisible = filtreMenu.classList.contains("animationOuverture"); // Le menu est-il visible ?
        filtreMenu.setAttribute("aria-hidden", !estVisible ? "true" : "false"); // Mettre à jour aria-hidden
        const valeurTabIndex = estVisible ? "0" : "-1"; // Déterminer la valeur du tabIndex en fonction de la visibilité
        filtreBoutons.forEach(bouton => bouton.setAttribute("tabindex", valeurTabIndex)); // Mettre à jour le tabIndex pour chaque bouton
    });
};


// Fonction pour afficher les médias en utilisant des filtres
const afficherMediaFiltre = mediasTemplate => {
    const filtreActuel = document.querySelector('#filtre-courrant'); // Filtre courant
    const tousLesFiltres = document.querySelectorAll('.contenu-menu-deroulant li button'); // Tous les filtres

    tousLesFiltres.forEach(filter => {
        filter.addEventListener('click', () => {
            filtreActuel.textContent = filter.textContent; // Mettre à jour le filtre courant
            tousLesFiltres.forEach(f => f.style.display = 'block'); // Afficher tous les filtres
            filter.style.display = 'none'; // Masquer le filtre sélectionné

            // Trier les médias selon le filtre
            switch (filter.textContent) {
                case 'Titre': mediasTemplate.medias.sort((a, b) => a.titre.localeCompare(b.titre)); break;
                case 'Popularité': mediasTemplate.medias.sort((a, b) => b.likes - a.likes); break;
                case 'Date': mediasTemplate.medias.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
            }

            mediasTemplate.creerMediaPhotographe(); // Recréer les médias avec le nouveau filtre
            afficherLightbox(mediasTemplate); // Afficher la lightbox
            afficherTotalLikes(); // Mettre à jour le total des likes
        });
    });
};


// Partie 9: Affichage du profil du photographe et de ses médias

const photographeApi = new GestionDonnees("./data/photographe.json");
const photographeId = new URLSearchParams(window.location.search).get("id");

const obtenirPhotographeParId = async () => {
    const { photographe, media } = await photographeApi.get();
    const photographes = photographe
        .map(photographes => new Photographe(photographes))
        .find(photographes => photographes.id == photographeId);
    const medias = media
        .map(media => new MediasFactory(media))
        .filter(media => media.photographeId == photographeId);
    return { photographes, medias };
};

const afficherPageProfil = async () => {
    const { photographes, medias } = await obtenirPhotographeParId();
    const headerTemplate = new PhotographeHeader(photographes);
    headerTemplate.creerPhotographeHeader();
    const mediasTemplate = new PhotographeMedias(photographes, medias);
    mediasTemplate.creerMediaPhotographe();

    afficherTotalLikes();
    ouvertureFermetureFormulaire();
    validationFormulaire();
    ouvrirFermerFiltres();
    afficherMediaFiltre(mediasTemplate)
    afficherLightbox(mediasTemplate);
};

afficherPageProfil();