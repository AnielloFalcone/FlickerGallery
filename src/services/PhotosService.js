export class PhotoService {
    constructor() {
        this.BASE_URL = 'https://api.flickr.com/services/rest/';
        this.FLICKR_KEY = '4353e3f18623552164483e63ce75ed4f';
        this.FLICKR_METHOD = 'flickr.photos.search';
    }

    getPhotosUrl(query, page) {
        return `${this.BASE_URL}?method=${this.FLICKR_METHOD}&api_key=${this.FLICKR_KEY}&format=json&nojsoncallback=1&text=${query}&page=${page}`;
    };

    getPhotos(query, page) {
        const cachedPhotos = this.getCachedPhotos(query);

        return new Promise(resolve => {
            if (cachedPhotos && cachedPhotos.length > 0) {
                resolve(cachedPhotos);
            }
            else {
                fetch(this.getPhotosUrl(query, page))
                    .then((response) => {
                        response.json().then((data) => {
                            const {photos : {photo}} = data;

                            window.localStorage.setItem(`photos-${query}`, JSON.stringify({
                                photos: photo,
                                query
                            }));

                            resolve(photo);
                        });
                    })
                    .catch((error) => {
                        console.log('Something went wrong while fetching the data ', error);
                    });
            }
        });
    };

    getCachedPhotos(query) {
        const savedSearch = JSON.parse(window.localStorage.getItem(`photos-${query}`));

        if (savedSearch && savedSearch.query === query) {
            return savedSearch.photos;
        }
    };
}
