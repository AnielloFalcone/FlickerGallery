import './../scss/main.scss';
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

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
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
                    const photoUrl = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}_n.jpg`;
                    const nextImg = new Image();

                    nextImg.src = photoUrl;
                    nextImg.id = `img-${idx}`;
                    nextImg.onload = () => {
                        console.log('Class: la, Function: onload, Line 63 "loaded"() => ', "loaded");
                    };

                    galleryContainer.appendChild(nextImg);
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

                let images = document.querySelectorAll('img');
                images.forEach(img => {
                    img.onload(() => {
                        console.log('Class: a, Function: a, Line 79 "loaded"() => ', "loaded");
                    });
                })
            });
        });
};
