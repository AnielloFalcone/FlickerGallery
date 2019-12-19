import './../scss/main.scss';
import {Image} from "./classes/Image";
import {PhotoService} from "./services/PhotosService";

const photoService = new PhotoService();

let page = 1;
let photos = [];
let query = 'dogs';

let galleryContainer;
let loader;
let searchInput;

document.addEventListener("DOMContentLoaded", () => {
    galleryContainer = document.querySelector('#container-gallery');
    loader = document.querySelector('#loader');
    searchInput = document.querySelector('#search');

    completePhotoRender();

    searchInput.addEventListener('keydown', (e) => {
        const newQuery = searchInput.value;
        if (e.key === 'Enter' && newQuery.length > 0) {
            e.preventDefault();

            galleryContainer.classList.add('hidden');
            loader.classList.remove('removed');
            query = newQuery;

            resetGallery().then(() => {
                completePhotoRender();
            });
        }
    })
});

const resetGallery = () => {
    return new Promise(resolve => {
        photos = [];
        let images = document.querySelectorAll('img');
        images.forEach(image => {image.remove()});
        resolve();
    })
};

const populateGrid = (images) => {
    return new Promise((resolve) => {
        resolve(
            // Remove the photos with no farms since they'll result in a broken image
            images
                .filter(p => p.farm !== 0)
                .forEach((img, idx) => {
                    galleryContainer.innerHTML += new Image(img, (idx * page)).getImageTemplate();
                })
        );
    });
};

const completePhotoRender = () => {
    photoService.getPhotos(query, page)
        .then(newPhotos => {
            newPhotos.forEach(photo => photos.push(photo));

            populateGrid(photos).then(() => {
                galleryContainer.classList.remove('hidden');
                loader.classList.add('removed');
            });
        });
};
