import './../scss/main.scss';
import {PhotoService} from "./services/PhotosService";

const photoService = new PhotoService();

let page = 1;
let photos = [];
let query = 'dogs';

let galleryContainer;
let loader;
let searchInput;

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

const startPhotoRender = () => {
    photoService.getPhotos(query, page)
        .then(newPhotos => {
            newPhotos.forEach(photo => photos.push(photo));

            populateGallery(photos)
                .then(() => {
                    showGallery();
                });
        });
};

const createImage = (img, idx) => {
    return new Promise(resolve => {
        const photoUrl = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_n.jpg`;
        const nextImg = new Image();

        nextImg.addEventListener('load', () => {resolve(nextImg)});

        nextImg.src = photoUrl;
        nextImg.id = `img-${idx}`;
    })
};

const populateGallery = (images) => {
    return new Promise((resolve) => {
        resolve(
            // Remove the photos with no farms since they'll result in a broken image
            images
                .filter(p => p.farm !== 0)
                .forEach((img, idx) => {
                    createImage(img, idx).then(nextImg => {galleryContainer.appendChild(nextImg)});
                })
        );
    });
};

const resetGallery = () => {
    return new Promise(resolve => {
        photos = [];

        let images = document.querySelectorAll('img');
        images.forEach(image => {image.remove()});
        resolve();
    })
};

const showGallery = () => {
    setTimeout(() => {
        galleryContainer.classList.remove('hidden');
        loader.classList.add('removed');
    }, 300);
};

const showLoader = () => {
    galleryContainer.classList.add('hidden');
    loader.classList.remove('removed');
};

addListeners();
