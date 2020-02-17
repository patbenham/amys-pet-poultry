import GalleryPhoto from './gallery-photo.js';

// hard-coded # of pictures to fetch for now
// TODO: add server-side code to dynamically fetch all photos in
// respective folder & create a srcset for each

/*
 * Fetch images associated with birdId and create GalleryPhotos with their
 * sources set to fetched image sources.
 * Images are fetched asynchronously; each GalleryPhoto's ready property is
 * a promise whose completion signals the completion of fetching its image
 * Returns an array of these GalleryPhotos.
 */
function fetchGalleryPhotos(birdId) {
  const gallery = [];
  for (let i = 1; i <= 4; i++) {
    const photo = new GalleryPhoto();
    gallery.push(photo);

    photo.ready = import(
      /* webpackMode: "lazy" */
      `img/poultry_for_sale/${birdId}/${i}_960w.jpg`
    ).then(url => {
      return Promise.resolve(gallery[i - 1].setSource(url.default));
    });
  }
  return gallery;
}

/*
 * Check if fetched photos already exist in galleryStore before fetching them
 */
function cachedFetchGalleryPhotos(birdId, galleryStore) {
  const gallery = galleryStore.get(birdId);
  if (!gallery) {
    return galleryStore.store(birdId, fetchGalleryPhotos(birdId));
  }
  return gallery;
}

export { cachedFetchGalleryPhotos as default };
