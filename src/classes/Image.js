export class Image {
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
