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

function attachGalleryPhoto(modalPhoto, galleryPhoto) {
  modalPhoto.prepend(galleryPhoto.img);
  modalPhoto.querySelector('.lds-ring').classList.add('visually-hidden');
}

function loadAndAttachPhoto(modalPhoto, galleryPhoto, currentGallery) {
  return loadGalleryPhoto(galleryPhoto).then(res => {
    if (!modalPhoto.contains(galleryPhoto.img)) {
      if (state.currentGallery === currentGallery)
        attachGalleryPhoto(modalPhoto, galleryPhoto);
    }
    return Promise.resolve();
  });
}

/**
 * Attaches one of the next loaded & unattached galleryPhotos, first checking the
 * current galleryPhoto & then the next galleryPhoto
 */
function attachNextGalleryPhoto(linkedModalPhotos) {
  let currentModalPhoto;
  let currentGalleryPhoto;

  for (let i = 0; i < 1; i++) {
    currentModalPhoto = linkedModalPhotos.getSelector(i);
    currentGalleryPhoto = linkedModalPhotos.getGalleryPhoto(i);

    if (
      currentGalleryPhoto.loaded &&
      !currentModalPhoto.contains(currentGalleryPhoto.img)
    ) {
      if ('decode' in currentGalleryPhoto.img) {
        currentGalleryPhoto.img.decode().then(res => {
          // currentModalPhoto.prepend(currentGalleryPhoto.img);
          attachGalleryPhoto(currentModalPhoto, currentGalleryPhoto);
        });
      } else {
        // currentModalPhoto.prepend(currentGalleryPhoto.img);
        attachGalleryPhoto(currentModalPhoto, currentGalleryPhoto);
      }
      return Promise.resolve(currentGalleryPhoto.img);
    }
  }
  return Promise.resolve(currentGalleryPhoto.img);
}

export { loadGalleryPhoto, loadAndAttachPhoto, attachNextGalleryPhoto };
