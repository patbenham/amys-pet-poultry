import state from './state.js';
/**
 * @desc
 * @param {Object} galleryPhoto - GalleryPhoto object
 */
function loadGalleryPhoto(galleryPhoto) {
  return galleryPhoto.ready.then(resolve => {
    return galleryPhoto.load();
  });
}

function loadAndAttachPhoto(modalPhoto, galleryPhoto, currentGallery) {
  loadGalleryPhoto(galleryPhoto).then(res => {
    if (!modalPhoto.contains(galleryPhoto.img)) {
      if (state.currentGallery === currentGallery)
        modalPhoto.prepend(galleryPhoto.img);
    }
  });
}

export { loadGalleryPhoto, loadAndAttachPhoto };
