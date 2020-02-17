function createPhotoNode() {
  const node = document.createElement('div');
  node.classList.add('popup-modal__photo-frame', 'flex');
  return node;
}

/**
 * @desc Links & tracks modalPhoto DOM selectors with GalleryPhotos
 * @param modalPhotoSelectors - Nodelist of modalPhoto DOM selectors
 * @returns an object with methods for interacting with the modalPhotoSelectors
 * and galleryPhotos
 */
function linkModalPhotos(
  { modalPhotos: modalPhotoSelectors, popupModalFrame },
  photoGallery,
  startingModalPhotoIndex = 0,
  startingGalleryIndex = 0
) {
  let gallery = photoGallery;
  let galleryIndex = startingGalleryIndex;
  let modalPhotoIndex = startingModalPhotoIndex;
  let modalPhotoLastIndex =
    gallery.length <= modalPhotoSelectors.length
      ? gallery.length - 1
      : modalPhotoSelectors.length - 1;

  /**
   * @desc Increases the size of modalPhotoSelectors to match size of
   * photoGallery array
   */
  function growSelectors() {
    let num = gallery.length - modalPhotoSelectors.length;
    if (num < 1) return null;
    let node;
    for (let i = 1; i <= num; i++) {
      node = createPhotoNode();
      modalPhotoSelectors.push(node);
      popupModalFrame.append(node);
    }
  }
  growSelectors();

  return {
    /**
     * @desc advances the indexes of both gallery and modalPhoto nodeList
     */
    next() {
      galleryIndex += 1;
      modalPhotoIndex += 1;

      if (galleryIndex >= gallery.length) {
        galleryIndex = 0;
      }

      if (modalPhotoIndex > modalPhotoLastIndex) {
        modalPhotoIndex = 0;
        // if (modalPhotoSelectors.length < gallery.length) {
        //   if (modalPhotoSelectors.length < maxSelectors) {
        //     let fragment = new DocumentFragment();
        //     let nodesToCreate = Math.min(
        //       maxSelectors - modalPhotoSelectors.length,
        //       gallery.length - modalPhotoSelectors.length
        //     );
        //     let newNodes = new Array(nodesToCreate);
        //     for (let i = 0; i < nodesToCreate; i++) {
        //       node = createPhotoNode();
        //       node.prepend(getGalleryPhoto(i).img);
        //       fragment.appendChild(node);
        //       newNodes[i] = node;
        //     }
        //     modalPhotoSelectors.splice(modalPhotoIndex, 0, ...newNodes);
        //     modalPhotoSelectors[modalPhotoIndex - 1].insertAdjacentElement(
        //       fragment
        //     );
        //     modalPhotoLastIndex += nodesToCreate;
        //   } else {
        //     // else can't add any more selectors, so overwrite nodes w/
        //     // the upcoming gallery photos
        //     // else {}
        //   }
        // } else modalPhotoIndex = 0;
      }
      if (modalPhotoIndex >= modalPhotoSelectors.length) modalPhotoIndex = 0;
      return this;
    },
    /**
     * @desc decrements the indexes of both gallery and modalPhoto nodeList
     */
    prev() {
      galleryIndex -= 1;
      modalPhotoIndex -= 1;

      if (galleryIndex < 0) {
        galleryIndex = gallery.length - 1;
      }
      // if modalPhotoSelectors.length < gallery.length
      //  create new modalPhotoSelectors up to a defined maximum
      //  - the maximum of say 10 and the remaining size of gallery up to 40
      //  and insert them at the current index; then update modalPhotoLastIndex
      //  load photos from gallery and insert them into newly created nodes
      //  if maximum is already met, then overwrite the following photos
      //  Use a documentFragment to create the modalPhoto nodes & insert the
      //  images
      //  make a function create a modalPhotoDOMNode for inserting into the
      //  documentFragment
      // if (modalPhotoIndex > modalPhotoLastIndex) {
      // modalPhotoIndex = 0;
      // }
      if (modalPhotoIndex < 0) modalPhotoIndex = modalPhotoLastIndex;
      // if (modalPhotoIndex === modalPhotoLastIndex) {
      //   if (modalPhotoSelectors.length < gallery.length) {
      //     if (modalPhotoSelectors.length < maxSelectors) {
      //       let fragment = new DocumentFragment();
      //       let nodesToCreate = Math.min(
      //         maxSelectors - modalPhotoSelectors.length,
      //         gallery.length - modalPhotoSelectors.length
      //       );
      //       let newNodes = new Array(nodesToCreate);
      //       for (let i = 0; i < nodesToCreate; i++) {
      //         node = createPhotoNode();
      //         node.prepend(getGalleryPhoto(i).img);
      //         fragment.appendChild(node);
      //         newNodes[i] = node;
      //       }
      //       modalPhotoSelectors.splice(modalPhotoIndex, 0, ...newNodes);
      //       modalPhotoSelectors[modalPhotoIndex - 1].insertAdjacentElement(
      //         fragment
      //       );
      //       modalPhotoLastIndex += nodesToCreate;
      //       modalPhotoIndex = modalPhotoLastIndex;
      //     } else {
      //       // else can't add any more selectors, so overwrite nodes w/
      //       // the upcoming gallery photos
      //       // else {}
      //     }
      //   }
      // }
      if (modalPhotoIndex >= modalPhotoSelectors.length) modalPhotoIndex = 0;
      return this;
    },
    /**
     * @desc Get a modalPhoto selector
     * @param {Integer} offset - desired offset from current modalPhoto
     * selector to be selected as returned selector
     */
    getSelector(offset = 0) {
      if (offset === 0) return modalPhotoSelectors[modalPhotoIndex];
      if (offset > modalPhotoLastIndex) return null;
      if (offset < 0)
        return modalPhotoIndex + offset < 0
          ? modalPhotoSelectors[
              modalPhotoIndex + offset + modalPhotoLastIndex + 1
            ]
          : modalPhotoSelectors[modalPhotoIndex + offset];

      return modalPhotoIndex + offset > modalPhotoLastIndex
        ? modalPhotoSelectors[
            modalPhotoIndex + offset - modalPhotoLastIndex - 1
          ]
        : modalPhotoSelectors[modalPhotoIndex + offset];
    },
    /**
     * @desc Get a GalleryPhoto
     * @param {Integer} offset - desired offset from current GalleryPhoto
     * to be selected as returned GalleryPhoto
     */
    getGalleryPhoto(offset = 0) {
      if (offset === 0) return gallery[galleryIndex];
      if (offset > gallery.length) return null;
      if (offset < 0)
        return galleryIndex + offset < 0
          ? gallery[galleryIndex + offset + gallery.length]
          : gallery[galleryIndex + offset];
      return galleryIndex + offset > gallery.length - 1
        ? gallery[galleryIndex + offset - gallery.length]
        : gallery[galleryIndex + offset];
    },
    reset(startGalleryIndex = 0, startModalPhotoIndex = 0) {
      galleryIndex = startGalleryIndex;
      modalPhotoIndex = startModalPhotoIndex;
    },
    changeGallery(newGallery) {
      gallery = newGallery;
      growSelectors();
      modalPhotoLastIndex =
        gallery.length <= modalPhotoSelectors.length
          ? gallery.length - 1
          : modalPhotoSelectors.length - 1;
    }
  };
}

export { linkModalPhotos as default };
