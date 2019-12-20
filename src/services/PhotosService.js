export class PhotoService {
    constructor() {
        this.BASE_URL = 'https://api.flickr.com/services/rest/';
        this.FLICKR_KEY = '4353e3f18623552164483e63ce75ed4f';
        this.FLICKR_METHOD = 'flickr.photos.search';
    }

    /**
     * Creates a new Image and resolves the promise when the image is loaded
     * @param img
     * @param idx
     * @returns {Promise<Image>}
     */
    createImage(img, idx) {
        return new Promise(resolve => {
            const nextImg = new Image();

            nextImg.addEventListener('load', () => {resolve(nextImg)});

            nextImg.src = img;
            nextImg.id = `img-${idx}`;
        })
    };

    /**
     * Returns the URL to get photos by query
     * @param query
     * @param page
     * @returns {string}
     */
    getPhotosUrl(query, page) {
        return `${this.BASE_URL}?method=${this.FLICKR_METHOD}&api_key=${this.FLICKR_KEY}&format=json&nojsoncallback=1&text=${query}&page=${page}`;
    };

    /**
     * Get the photos from Flickr Api, then when received them back (transformed) resolves the promise.
     * @param query
     * @param page
     * @returns {Promise<string[]>}
     */
    getPhotos(query, page) {
        return new Promise(resolve => {
            fetch(this.getPhotosUrl(query, page))
                .then(response => {
                    response.json().then(data => {
                        const {photos : {photo}} = data;

                        this.urlToObjectUrl(photo).then(transformedPhotos => {
                            resolve(transformedPhotos)
                        });
                    });
                })
                .catch((error) => {
                    console.log('Something went wrong while fetching the data ', error);
                });
        });
    };

    /**
     * Transform the Flickr photo URL to an ObjectURl and sends them back only when all images are transformed
     * @param photos
     * @returns {Promise<string[]>}
     */
    urlToObjectUrl(photos) {
        let fetchedPhotos = [];
        let count = 0;

        return new Promise(resolve => {
            // Remove the photos with no farms since they'll result in a broken image
            photos
                .filter(p => p.farm !== 0)
                .forEach(photo => {
                    count++;

                    fetch(`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_n.jpg`)
                        .then(response => {
                            response.blob().then(data => {
                                const objectURL = URL.createObjectURL(data);

                                fetchedPhotos.push(objectURL);

                                if (fetchedPhotos.length === count) {
                                    resolve(fetchedPhotos);
                                }
                            })
                        })
                        .catch((error) => {
                            console.log('Something went wrong while fetching the photo ', error);
                        });
                });
        });
    };
}
