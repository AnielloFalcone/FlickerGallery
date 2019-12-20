import {PhotoService} from "./services/PhotosService";
import './../scss/main.scss';

const photoService = new PhotoService();

// Variables
let page = 1;
let photos = [];
let query = 'dogs';

// Elements
let galleryContainer;
let loader;
let searchInput;

/**
 * Attach listeners to the document (i.e. DOMContentLoaded)
 */
const addListeners = () => {
    document.addEventListener("DOMContentLoaded", () => {
        galleryContainer = document.querySelector('#container-gallery');
        loader = document.querySelector('#loader');
        searchInput = document.querySelector('#search');

        startPhotoRender();

        searchInput.addEventListener('keydown', (e) => {
            const newQuery = searchInput.value;
            if (e.key === 'Enter' && newQuery.length > 0) {
                e.preventDefault();

                showLoader();
                query = newQuery;

                resetGallery().then(() => {
                    startPhotoRender();
                    searchInput.blur();
                });
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
    });
};

/**
 * Triggers the photo fetch and transformation and gallery population and display process
 */
const startPhotoRender = () => {
    photoService.getPhotos(query, page)
        .then(newPhotos => {
            photos = newPhotos;

            populateGallery()
                .then(() => {
                    showGallery();
                });
        });
};

/**
 * Appends every photo received to the galleryContainer
 * @returns {Promise<unknown>}
 */
const populateGallery = () => {
    return new Promise((resolve) => {
        resolve(
            photos.forEach((img, idx) => {
                photoService.createImage(img, idx).then(nextImg => {galleryContainer.appendChild(nextImg)});
            })
        );
    });
};

/**
 * Remove every photo from the gallery
 * @returns {Promise<unknown>}
 */
const resetGallery = () => {
    return new Promise(resolve => {
        photos = [];

        let images = document.querySelectorAll('img');
        images.forEach(image => {image.remove()});
        resolve();
    })
};

/**
 * Shows the gallery and hides the loader
 */
const showGallery = () => {
    setTimeout(() => {
        galleryContainer.classList.remove('hidden');
        loader.classList.add('removed');
    }, 300);
};

/**
 * Shows the loader and hides the gallery
 */
const showLoader = () => {
    galleryContainer.classList.add('hidden');
    loader.classList.remove('removed');
};

addListeners();
