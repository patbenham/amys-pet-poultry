function GalleryPhoto() {
  this.loaded = false;
  this.img = new Image();
  this.src = undefined;
  this.img.classList.add('popup-modal__photo');
  // this.img.style.transition = 'transform 0.2s ease-out';
  this.zoomLevel = 1;
  this.origWidth = undefined;
  this.origHeight = undefined;
  this.translateX = 0;
  this.translateY = 0;
  this.ready = null;
  this.srcIsSet = false;

  const galleryPhotoObj = this;
  this.img.onload = function imgOnload() {
    galleryPhotoObj.loaded = true;
    // galleryPhotoObj.origWidth = galleryPhotoObj.img.width;
    // galleryPhotoObj.origHeight = galleryPhotoObj.img.height;
  };
}

/*
 * Loads the new img src (set by setSource) into the DOM and decodes the image
 */
GalleryPhoto.prototype.load = function load() {
  if (!this.srcIsSet) {
    this.loaded = false;
    this.srcIsSet = true;
    this.img.src = this.src;
  }
  return Promise.resolve();
  // return this.img.decode();
};

/*
 * Sets a new src for a GalleryPhoto instance's image, but does not load it
 * into the DOM.
 * Call GalleryPhoto.prototype.load on the instance to load the new src into
 * the DOM.
 */
GalleryPhoto.prototype.setSource = function setSource(src) {
  this.src = src;
  this.srcIsSet = false;
};

/*
 * Returns the zoomed width & height dimensions of image as [width, height]
 */
GalleryPhoto.prototype.getZoomedDimensions = function getZoomedDimensions() {
  return [this.zoomLevel * this.origWidth, this.zoomLevel * this.origHeight];
};

export { GalleryPhoto as default };
