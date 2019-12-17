import './../scss/main.scss';

const BASE_URL = 'https://api.flickr.com/services/rest/';
const FLICKR_METHOD = 'flickr.photos.search';
const FLICKR_KEY = '4353e3f18623552164483e63ce75ed4f';
let query = 'dogs';
let page = 1;

document.addEventListener("DOMContentLoaded", () => {
    getImages();
});

class Image {
    constructor(photo, index) {
        const {farm, server, id, secret} = photo;
        //TODO make this dynamic
        const size = 'n';

        this.photoUrl = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
        this.template = `<img id="img-${index}" src="${this.photoUrl}" alt="img"/>`;
    }

    getImageTemplate() {
        return this.template;
    }
}

const getUrl = () => {
    return `${BASE_URL}?method=${FLICKR_METHOD}&api_key=${FLICKR_KEY}&format=json&nojsoncallback=1&text=${query}&page=${page}`;
};

const getImages = () => {
    fetch(getUrl())
        .then((response) => {
            response.json().then((data) => {
                const {photos : {photo}} = data;
                // Remove the photos with no farms since they'll result in a broken image
                const filteredPhotos = photo.filter(p => p.farm !== 0);

                populateGrid(filteredPhotos);
            });
        })
        .catch((error) => {
            console.log('Something went wrong while fetching the data ', error);
        });
};

const populateGrid = (images) => {
    const galleryContainer = document.querySelector('#container-gallery');

    images.forEach((img, idx) => {
        galleryContainer.innerHTML += new Image(img, idx).getImageTemplate();
    });
};

const attachObserver = () => {
    const options = {
        root: galleryContainer,
        threshold: 1.0
    };

    const callback = (entries) => {
        entries.forEach(entry => {
            console.log('Class: observer, Function: , Line 57 () => ', 'works', entry);
        });
        page++;
        // getImages();
    };

    debugger
    let observer = new IntersectionObserver(callback, options);

    let target = document.querySelector(`#img-${idx}`);
    observer.observe(target);
};
