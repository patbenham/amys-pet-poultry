import magBtn2 from './img/magnify2.svg';

import state from './state.js';
import createPopupModal from './popup-modal.js';
import GalleryPhoto from './gallery-photo.js';
import {
  loadGalleryPhoto,
  loadAndAttachPhoto,
  attachNextGalleryPhoto
} from './load-photos.js';
import fetchGalleryPhotos from './fetch-photos.js';
import galleryStore from './gallery-store.js';
import linkModalPhotos from './modal-photos.js';
import config from './config.js';

// TODO: work on making site more flexible -- e.g. changing orientation on phone
// messes up the gallery UI

function createGalleries(popupModalSelectors) {
  let {
    popupModal,
    modalPhotos,
    modalCloseBtn,
    modalLeftArrow,
    modalRightArrow,
    modalNavBar,
    modalExpandBtn,
    modalMagnifyBtn,
    modalMinifyBtn,
    popupModalFrame,
    popupModalCounter
  } = popupModalSelectors;

  let currentPhotoIndex = 0;

  function getTouchCoordinates(e) {
    return [
      e.clientX ||
        (e.touches[0] && e.touches[0].clientX) ||
        (e.changedTouches[0] && e.changedTouches[0].clientX),
      e.clientY ||
        (e.touches[0] && e.touches[0].clientY) ||
        (e.changedTouches[0] && e.changedTouches[0].clientY)
    ];
  }

  function getTouchMoveDistance(e, startingCoords) {
    let [moveX, moveY] = getTouchCoordinates(e);
    return [moveX - startingCoords[0], moveY - startingCoords[1]];
  }

  const galleries = document.querySelectorAll('.gallery');
  const store = galleryStore();
  const photos = linkModalPhotos(popupModalSelectors, []);

  galleries.forEach(gallery => {
    const birdId = gallery.dataset.birdid;
    if (birdId) {
      addGalleryOverlay(gallery);

      gallery.onclick = function openGallery() {
        currentPhotoIndex = 0;
        state.currentGalleryNode = gallery;

        modalPhotos.forEach(removePhotoNodes);

        state.currentGallery = fetchGalleryPhotos(birdId, store);
        photos.changeGallery(state.currentGallery);
        photos.reset();

        let leftSel = photos.getSelector(-1);
        let rightSel = photos.getSelector(1);
        let centerSel = photos.getSelector(0);
        // set initial left, right, & center positions for modalPhotos
        leftSel.classList.add('popup-modal__photo--left');
        leftSel.classList.remove('visually-hidden');
        centerSel.classList.add('popup-modal__photo--center');
        centerSel.classList.add('popup-modal__photo--transition');
        centerSel.classList.remove('visually-hidden');
        rightSel.classList.add('popup-modal__photo--right');
        rightSel.classList.remove('visually-hidden');

        loadAndAttachPhoto(
          leftSel,
          photos.getGalleryPhoto(-1),
          state.currentGallery
        );
        loadAndAttachPhoto(
          rightSel,
          photos.getGalleryPhoto(1),
          state.currentGallery
        );
        loadAndAttachPhoto(
          centerSel,
          photos.getGalleryPhoto(0),
          state.currentGallery
        );

        document.body.classList.add('modal-open');
        updateModalCounter();

        popupModal.classList.toggle('visually-hidden');
        popupModal.classList.remove('popup-modal--hidden');
      };
    }
  });

  function removePhotoNodes(node) {
    // while (node.firstChild) {
    // node.removeChild(node.firstChild);
    // }
    const photo = node.querySelector('.popup-modal__photo');
    if (photo) node.removeChild(photo);
  }

  modalCloseBtn.onclick = function closeGallery() {
    popupModal.classList.add('popup-modal--hidden');
    document.body.classList.remove('modal-open');
    window.setTimeout(
      () => popupModal.classList.toggle('visually-hidden'),
      300
    );
    if (document.fullscreenElement) document.exitFullscreen();
    state.currentGalleryNode.scrollIntoView();
  };

  modalExpandBtn.onclick = function toggleFullScreen() {
    if (!document.fullscreenElement) popupModal.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  modalLeftArrow.onclick = prevPhoto;
  modalRightArrow.onclick = nextPhoto;

  let timeoutId = null;
  // popupModal.addEventListener('mousemove', () => {
  //   if (timeoutId) window.clearTimeout(timeoutId);
  //   // TODO: put a check here to test whether the ui is visible already so im
  //   // not changing the dom on every mousemove
  //   modalLeftArrow.classList.add('popup-modal__left-arrow--fadein');
  //   modalRightArrow.classList.add('popup-modal__right-arrow--fadein');
  //   modalNavBar.classList.add('popup-modal__navbar--fadein');
  //   timeoutId = window.setTimeout(hideOverlay, 4000);
  // });

  function hideOverlay() {
    modalLeftArrow.classList.remove('popup-modal__left-arrow--fadein');
    modalRightArrow.classList.remove('popup-modal__right-arrow--fadein');
    modalNavBar.classList.remove('popup-modal__navbar--fadein');
  }

  function zoomPhoto(change) {
    return function zoom() {
      const currentPhoto = state.currentGallery[currentPhotoIndex];
      if (!currentPhoto.loaded) return;

      currentPhoto.zoomLevel += change;
      let newZoomLevel = currentPhoto.zoomLevel;

      if (newZoomLevel >= 4) {
        currentPhoto.zoomLevel = 4;
        newZoomLevel = 4;
        modalMagnifyBtn.classList.remove('popup-modal__btn');
        modalMagnifyBtn.classList.add('popup-modal__btn--dim');
      } else {
        modalMagnifyBtn.classList.add('popup-modal__btn');
        modalMagnifyBtn.classList.remove('popup-modal__btn--dim');
      }

      if (newZoomLevel <= 1) {
        currentPhoto.zoomLevel = 1;
        newZoomLevel = 1;
        modalMinifyBtn.classList.remove('popup-modal__btn');
        modalMinifyBtn.classList.add('popup-modal__btn--dim');
      } else {
        modalMinifyBtn.classList.add('popup-modal__btn');
        modalMinifyBtn.classList.remove('popup-modal__btn--dim');
      }

      // currentPhoto.img.style.transform = `scale(${newZoomLevel})
      // translate(${currentPhoto.translateX}px, ${currentPhoto.translateY}px)`;
      snapImgToFrame(currentPhoto);
    };
  }

  modalMagnifyBtn.onclick = zoomPhoto(0.5);
  modalMinifyBtn.onclick = zoomPhoto(-0.5);

  /**
   *
   */
  function nextPhoto() {
    // updateModalCounter();

    const leftModalPhoto = photos.getSelector(-1);
    const rightModalPhoto = photos.getSelector(1);
    const centerModalPhoto = photos.getSelector(0);
    const rRightModalPhoto = photos.getSelector(2);
    const galleryPhoto2 = photos.getGalleryPhoto(2);

    loadGalleryPhoto(galleryPhoto2);
    leftModalPhoto.classList.remove('popup-modal__photo--transition');
    leftModalPhoto.classList.remove('popup-modal__photo--left');
    leftModalPhoto.classList.add('visually-hidden');
    rRightModalPhoto.classList.add('popup-modal__photo--right');
    rightModalPhoto.classList.add('popup-modal__photo--transition');

    photos.next();
    let currentImg = photos.getGalleryPhoto(0).img;

    requestAnimationFrame(timestamp => {
      centerModalPhoto.classList.add('popup-modal__photo--left');
      centerModalPhoto.classList.remove('popup-modal__photo--center');
      rightModalPhoto.classList.remove('popup-modal__photo--right');
      rightModalPhoto.classList.add('popup-modal__photo--center');
      rRightModalPhoto.classList.remove('visually-hidden');

      currentImg.classList.remove('translateZ');
      // currentImg.classList.add('opacity0');

      setTimeout(() => {
        attachNextGalleryPhoto(photos).then(photo => {
          currentImg.classList.add('translateZ');
          // setTimeout(() => {
          // currentImg.classList.remove('opacity0');
          // }, 500);
        });
      }, config.slideDuration);
    });

    // zoomPhoto(0)(); // reset magnify & minify buttons
  }
  function prevPhoto() {
    // let rightIndex = currentPhotoIndex + 1;
    // if (rightIndex > state.currentGallery.length - 1) rightIndex = 0;

    // currentPhotoIndex -= 1;
    // if (currentPhotoIndex < 0)
    //   currentPhotoIndex = state.currentGallery.length - 1;
    // updateModalCounter();

    // const rightPhotoObj = state.currentGallery[rightIndex];
    // // reset transform on image to the right
    // rightPhotoObj.img.style.transform = `translate(${rightPhotoObj.translateX}px, ${rightPhotoObj.translateY}px) scale(${rightPhotoObj.zoomLevel})`;

    // modalPhoto.classList.add('popup-modal__photo--right');
    // modalPhoto.classList.remove('popup-modal__photo--center');
    // modalPhotoRight.classList.remove('popup-modal__photo--transition');
    // modalPhotoRight.classList.add('popup-modal__photo--left');
    // modalPhotoRight.classList.remove('popup-modal__photo--right');
    // modalPhotoLeft.classList.add('popup-modal__photo--transition');
    // modalPhotoLeft.classList.add('popup-modal__photo--center');
    // modalPhotoLeft.classList.remove('popup-modal__photo--left');

    // const left = modalPhotoLeft;
    // modalPhotoLeft = modalPhotoRight;
    // modalPhotoRight = modalPhoto;
    // modalPhoto = left;

    // if (currentPhotoIndex - 1 < 0) {
    //   const lastEl = state.currentGallery[state.currentGallery.length - 1];
    //   modalPhotoLeft.firstChild.replaceWith(lastEl.img);
    //   lastEl.load();
    // } else {
    //   const prevEl = state.currentGallery[currentPhotoIndex - 1];
    //   modalPhotoLeft.firstChild.replaceWith(prevEl.img);
    //   prevEl.load();
    // }
    //
    const rightPhotoObj = photos.getGalleryPhoto(1);
    rightPhotoObj.img.style.transform = `translate(${rightPhotoObj.translateX}px, ${rightPhotoObj.translateY}px) scale(${rightPhotoObj.zoomLevel})`;

    // if (currentPhotoIndex + 1 >= state.currentGallery.length) {
    //   const firstEl = state.currentGallery[0];
    //   modalPhotoLeft.firstChild.replaceWith(firstEl.img);
    //   firstEl.load();
    // } else {
    //   const nextEl = state.currentGallery[currentPhotoIndex + 1];
    //   modalPhotoLeft.firstChild.replaceWith(nextEl.img);
    //   nextEl.load();
    // }
    const leftModalPhoto = photos.getSelector(-1);
    const rightModalPhoto = photos.getSelector(1);
    const centerModalPhoto = photos.getSelector(0);
    photos.getSelector(-2).classList.add('popup-modal__photo--left');
    photos.getSelector(-2).classList.remove('visually-hidden');
    photos.prev();

    // const right = modalPhotoRight;
    // modalPhotoRight = modalPhotoLeft;
    // modalPhotoLeft = modalPhoto;
    // modalPhoto = right;

    ((leftModalPhoto, centerModalPhoto, rightModalPhoto) => {
      requestAnimationFrame(timestamp => {
        centerModalPhoto.classList.add('popup-modal__photo--right');
        centerModalPhoto.classList.remove('popup-modal__photo--center');
        leftModalPhoto.classList.remove('popup-modal__photo--left');
        leftModalPhoto.classList.add('popup-modal__photo--transition');
        leftModalPhoto.classList.add('popup-modal__photo--center');
        rightModalPhoto.classList.add('visually-hidden');
        rightModalPhoto.classList.remove('popup-modal__photo--transition');
        rightModalPhoto.classList.remove('popup-modal__photo--right');

        // modalPhotoLeft.classList.add('popup-modal__photo--left');
        // modalPhotoLeft.classList.remove('popup-modal__photo--center');
        // modalPhotoRight.classList.remove('popup-modal__photo--transition');
        // modalPhotoRight.classList.add('popup-modal__photo--right');
        // modalPhotoRight.classList.remove('popup-modal__photo--left');
        // modalPhoto.classList.add('popup-modal__photo--transition');
        // modalPhoto.classList.add('popup-modal__photo--center');
        // modalPhoto.classList.remove('popup-modal__photo--right');
      });
    })(leftModalPhoto, centerModalPhoto, rightModalPhoto);

    // zoomPhoto(0)(); // reset magnify & minify buttons
  }

  function copyTouch({ identifier, clientX, clientY }) {
    return { identifier, clientX, clientY };
  }
  function inputCoords(inputType) {
    let startingCoordinates = [];

    return {
      getStartingCoords(identifier) {
        if (inputType == 'mouse') return startingCoordinates[0];
        else if (inputType == 'touch') {
          for (let i = 0; i < startingCoordinates.length; i++) {
            let id = startingCoordinates[i].identifier;
            if (id == identifier) return startingCoordinates[i];
          }
          return null;
        }
      },
      setStartingCoords(e) {
        if (inputType == 'mouse')
          startingCoordinates[0] = {
            identifier: null,
            clientX: e.clientX,
            clientY: e.clientY
          };
        else if (inputType == 'touch') {
          let touches = e.changedTouches;
          for (let i = 0; i < touches.length; i++) {
            startingCoordinates.push(copyTouch(touches[i]));
          }
        }
      }
    };
  }

  // popupModal.addEventListener('mousedown', startPan('mousedown'));
  // popupModal.addEventListener('touchstart', startPan('touchstart'));
  // window.addEventListener('mouseup', cancelPan);
  // window.addEventListener('touchend', cancelPan);
  // TODO: add mousemove listener inside of startPan function so it's not
  // triggered until mousedown
  // window.addEventListener('mousemove', pan);
  // window.addEventListener('touchmove', pan);
  let panningPhoto = false;
  let startingPanPoint = null;
  let currentImg;
  let currentFrameWidth;
  let currentFrameHeight;
  let imgWidth;
  let imgHeight;
  let swiping = false;

  function startPan(eventType) {
    return function listener(e) {
      e.preventDefault();
      if (panningPhoto) return;
      panningPhoto = true;

      currentFrameWidth = popupModalFrame.offsetWidth;
      currentFrameHeight = popupModalFrame.offsetHeight;
      currentImg = state.currentGallery[currentPhotoIndex];
      [imgWidth, imgHeight] = currentImg.getZoomedDimensions();

      if (imgWidth <= currentFrameWidth && imgHeight <= currentFrameHeight) {
        swiping = true;
      }

      startingPanPoint = getTouchCoordinates(e);
      console.log(startingPanPoint);
    };
  }
  function pan(e) {
    console.log('panning');
    if (panningPhoto) {
      const zoomLevel = currentImg.zoomLevel;
      // const moveX = e.clientX - startingPanPoint[0];
      // const moveY = e.clientY - startingPanPoint[1];
      // let [moveX, moveY] = getTouchCoordinates(e);
      // moveX -= startingPanPoint[0];
      // moveY -= startingPanPoint[1];
      const [moveX, moveY] = getTouchMoveDistance(e, startingPanPoint);

      let newTransX = currentImg.translateX;
      let newTransY = currentImg.translateY;

      if (imgWidth > currentFrameWidth) newTransX += moveX;
      if (imgHeight > currentFrameHeight) newTransY += moveY;
      if (swiping) {
        newTransX += moveX;
      }

      modalPhoto.firstChild.style.transform = `translate(${newTransX}px, ${newTransY}px) scale(${zoomLevel})`;
    }
  }
  function cancelPan(e) {
    let moveX;
    let moveY;
    if (panningPhoto) {
      // moveX = e.clientX - startingPanPoint[0];
      // moveY = e.clientY - startingPanPoint[1];
      [moveX, moveY] = getTouchMoveDistance(e, startingPanPoint);
    }

    if (panningPhoto && !swiping) {
      panningPhoto = false;
      currentImg.translateX += moveX;
      currentImg.translateY += moveY;
      snapImgToFrame(currentImg);
    } else if (swiping) {
      swiping = false;
      panningPhoto = swiping;
      if (moveX > 50) prevPhoto();
      else if (moveX < -50) nextPhoto();
      else snapImgToFrame(currentImg);
    }
  }

  function snapImgToFrame(img) {
    const [imgWidth, imgHeight] = img.getZoomedDimensions();
    const frameWidth = popupModalFrame.offsetWidth;
    const frameHeight = popupModalFrame.offsetHeight;

    if (imgWidth > frameWidth) {
      const imgRightEdgeX = imgWidth / 2 + frameWidth / 2 + img.translateX;
      const imgLeftEdgeX = frameWidth / 2 - imgWidth / 2 + img.translateX;

      if (imgRightEdgeX < frameWidth) {
        img.translateX += frameWidth - imgRightEdgeX;
      } else if (imgLeftEdgeX > 0) {
        img.translateX -= imgLeftEdgeX;
      }
    }

    if (imgHeight > frameHeight) {
      const imgBottomEdgeY = imgHeight / 2 + frameHeight / 2 + img.translateY;
      const imgTopEdgeY = frameHeight / 2 - imgHeight / 2 + img.translateY;

      if (imgBottomEdgeY < frameHeight) {
        img.translateY += frameHeight - imgBottomEdgeY;
      } else if (imgTopEdgeY > 0) {
        img.translateY -= imgTopEdgeY;
      }
    }

    if (imgHeight <= frameHeight) {
      img.translateY = 0;
    }
    if (imgWidth <= frameWidth) {
      img.translateX = 0;
    }

    modalPhoto.firstChild.style.transform = `translate(${img.translateX}px,
      ${img.translateY}px) scale(${img.zoomLevel})`;
  }

  function updateModalCounter() {
    popupModalCounter.firstChild.textContent = `${currentPhotoIndex + 1} / ${
      state.currentGallery.length
    }`;
  }

  // function willChange(el) {
  //   el.style.willChange = 'transform, opacity';
  // }
  // function removeWillChange() {
  //   this.style.willChange = 'auto';
  // }

  function addGalleryOverlay(gallery) {
    const overlay = document.createElement('div');
    overlay.classList.add('img-block__overlay');
    overlay.classList.add('flex');
    const img = new Image();
    img.src = `${magBtn2}`;
    overlay.prepend(img);
    gallery.prepend(overlay);
  }
}

createGalleries(createPopupModal());
