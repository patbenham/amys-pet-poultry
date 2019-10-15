import minBtn from './img/minify.png';
import magBtn from './img/magnify.png';
import shareBtn from './img/share.png';
import expandBtn from './img/expand.png';
import xBtn from './img/x.png';
import arrowBtn from './img/arrow.png';
import magBtn2 from './img/magnify2.svg';
// TODO: get this site hosted & test responsiveness on mobile phone
// TODO: swipe & zoom animations are really slow on mobile -- try using
// will-change & transform3d to improve responsiveness
// TODO: work on making site more flexible -- e.g. changing orientation on phone
// messes up the gallery UI
// TODO: mousedown/mouseup events dont work on mobile -- fix this so panning
// images work (touch events??)
// TODO: setup linting, get into habit of using tab completion, start using
// vim-dasht, vim surround, emmet-vim, imagemin & responsive loader webpack
// plugins, prettier, stylelint, autoprefixer
// TODO: learn the basics of SASS & start using it (setup webpack/npm to compile
// it)
// TODO: setup webpack & webpack-dev-server so I can quickly see changes on
// android phone via local web server for testing
const photoGalleries = {};
let currentGallery;
let currentGalleryNode;

function createPopupModal() {
  const popupModal = document.createElement('div');
  popupModal.classList.add('popup-modal');
  popupModal.classList.add('visually-hidden');
  popupModal.innerHTML = `<div class='popup-modal__frame flex'>

    <div class="image-predecode"></div>

      <div class="popup-modal__photo--left popup-modal__photo--transition flex">
        </div>
      <div class="popup-modal__photo--center
        popup-modal__photo--transition flex">
        </div>
      <div class="popup-modal__photo--right 
        popup-modal__photo--transition flex">
        </div>

    </div>
    <div class="popup-modal__navbar">

      <div class="popup-modal__counter">
        <span></span>
      </div>

      <div class="popup-modal__minify-btn popup-modal__btn--dim">
        <img src=${minBtn}>
      </div>

      <div class="popup-modal__magnify-btn popup-modal__btn--dim">
        <img src="${magBtn}">
      </div>

      <div class="popup-modal__share-btn popup-modal__btn">
        <img src="${shareBtn}">
      </div>

      <div class="popup-modal__expand-btn popup-modal__btn">
        <img src="${expandBtn}">
      </div>

      <div class="popup-modal__close-btn popup-modal__btn">
        <img src="${xBtn}">
      </div>


    </div>
    

    <div class="popup-modal__left-arrow">
      <img src="${arrowBtn}">
    </div>

    <div class="popup-modal__right-arrow">
      <img src="${arrowBtn}">
    </div>`;

  document.body.prepend(popupModal);
  return popupModal;
}

function createGalleries(popupModal) {
  let modalPhoto = popupModal.querySelector('.popup-modal__photo--center');
  let modalPhotoLeft = popupModal.querySelector('.popup-modal__photo--left');
  let modalPhotoRight = popupModal.querySelector('.popup-modal__photo--right');
  const modalCloseBtn = popupModal.querySelector('.popup-modal__close-btn');
  const modalLeftArrow = popupModal.querySelector('.popup-modal__left-arrow');
  const modalRightArrow = popupModal.querySelector('.popup-modal__right-arrow');
  const modalNavBar = popupModal.querySelector('.popup-modal__navbar');
  const modalExpandBtn = popupModal.querySelector('.popup-modal__expand-btn');
  const modalMagnifyBtn = popupModal.querySelector('.popup-modal__magnify-btn');
  const modalMinifyBtn = popupModal.querySelector('.popup-modal__minify-btn');
  // const modalShareBtn = popupModal.querySelector('.popup-modal__share-btn');
  const popupModalFrame = popupModal.querySelector('.popup-modal__frame');
  const popupModalCounter = popupModal.querySelector('.popup-modal__counter');

  // const imagePreDecode = popupModal.querySelector('.image-predecode');

  // const photoArr = [];
  let currentPhotoIndex = 0;

  function GalleryPhoto() {
    this.loaded = false;
    this.img = new Image();
    this.src = undefined;
    this.img.classList.add('popup-modal__photo');
    this.img.style.transition = 'transform 0.2s ease-out';
    this.zoomLevel = 1;
    this.origWidth = undefined;
    this.origHeight = undefined;
    this.translateX = 0;
    this.translateY = 0;

    const galleryPhotoObj = this;
    this.img.onload = function imgOnload() {
      galleryPhotoObj.loaded = true;
      galleryPhotoObj.origWidth = galleryPhotoObj.img.width;
      galleryPhotoObj.origHeight = galleryPhotoObj.img.height;
      zoomPhoto(0)();
    }
  }

  GalleryPhoto.prototype.load = function load() {
    if (this.img.src !== this.src) this.img.src = this.src;
    this.img.decode().then(() => console.log('image decoded'));
  };


  const galleries = document.querySelectorAll('.gallery');

  galleries.forEach((gallery) => {
    let birdId = gallery.dataset.birdid;
    if (birdId) {
      addGalleryOverlay(gallery);

      // let birdImg = document.createElement('img');
      // birdImg.src =
      // "img/poultry_for_sale/olive_egger_072219/olive_egger1_960w.webp";
      // birdImg.classList.add("img-block__img");

      // birdImg.srcset =
      //    `img/poultry_for_sale/${birdId}/olive_egger1_960w.webp 960w,
      //     img/poultry_for_sale/${birdId}/olive_egger1_960w.jpg 960w,
      //     img/poultry_for_sale/${birdId}/olive_egger1_683w.webp 683w,
      //     img/poultry_for_sale/${birdId}/olive_egger1_683w.jpg 683w,
      //     img/poultry_for_sale/${birdId}/olive_egger1_320w.webp 320w,
      //     img/poultry_for_sale/${birdId}/olive_egger1_320w.jpg 320w`;
      // birdImg.sizes=`(min-width: 1920px) 960px,
      //     50vw`;
      // imgBlock.appendChild(birdImg);

      gallery.onclick = function openGallery() {
        // hard-coded # of pictures to fetch for now
        // TODO: add server-side code to dynamically fetch all photos in
        // respective folder & create a srcset for each
        if (!(birdId in photoGalleries)) {
          photoGalleries[birdId] = [];
          currentGallery = photoGalleries[birdId];
          addGalleryPhotos(birdId, currentGallery);
        } else {
          currentGallery = photoGalleries[birdId];
        }

        currentPhotoIndex = 0;
        currentGalleryNode = gallery;

        removeChildNodes(modalPhoto);
        removeChildNodes(modalPhotoRight);
        removeChildNodes(modalPhotoLeft);

        modalPhoto.prepend(currentGallery[0].img);
        modalPhotoRight.prepend(currentGallery[1].img);
        modalPhotoLeft.prepend(currentGallery[currentGallery.length - 1].img);
        currentGallery[0].load();
        currentGallery[1].load();
        currentGallery[currentGallery.length - 1].load();

        document.body.classList.add('modal-open');

        // imagePreDecode.prepend(currentGallery[0].img);
        // imagePreDecode.prepend(currentGallery[1].img);
        // imagePreDecode.prepend(
        //  currentGallery[currentGallery.length - 1].img);

        // willChange(modalPhoto.firstChild);
        // willChange(modalPhotoRight.firstChild);
        // willChange(modalPhotoLeft.firstChild);
        // willChange(modalNavBar);
        // willChange(modalLeftArrow);
        // willChange(modalRightArrow);

        updateModalCounter();

        popupModal.classList.toggle('visually-hidden');
        popupModal.classList.remove('popup-modal--hidden');
      };
    }
  });

  function removeChildNodes(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function addGalleryPhotos(birdId, gallery) {
    for (let i = 1; i <= 4; i++) {
      // let src = `img/poultry_for_sale/${birdId}/${i}_960w.jpg`;
      let src;
      // TODO: need to add promise handling logic to image loading functions
      // inside onclick
      import(
      /* webpackMode: "lazy-once" */
      /* webpackPrefetch: true */
      `img/poultry_for_sale/${birdId}/${i}_960w.jpg`)
        .then((url) => {
          src = url;
          gallery.push(new GalleryPhoto());
          gallery[i - 1].src = src;
        })
    }
  }

  modalCloseBtn.onclick = function closeGallery() {
    popupModal.classList.add('popup-modal--hidden');
    document.body.classList.remove('modal-open');
    window.setTimeout(
      () => popupModal.classList.toggle('visually-hidden'),
      300
    );
    if (document.fullscreenElement) document.exitFullscreen();
    currentGalleryNode.scrollIntoView();
  }

  modalExpandBtn.onclick = function toggleFullScreen() {
    if (!document.fullscreenElement) popupModal.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  }

  modalLeftArrow.onclick = prevPhoto;
  modalRightArrow.onclick = nextPhoto;

  let timeoutId = null;
  popupModal.addEventListener('mousemove', () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    modalLeftArrow.classList.add('popup-modal__left-arrow--fadein');
    modalRightArrow.classList.add('popup-modal__right-arrow--fadein');
    modalNavBar.classList.add('popup-modal__navbar--fadein');
    timeoutId = window.setTimeout(hideOverlay, 4000);
  });

  function hideOverlay() {
    modalLeftArrow.classList.remove('popup-modal__left-arrow--fadein');
    modalRightArrow.classList.remove('popup-modal__right-arrow--fadein');
    modalNavBar.classList.remove('popup-modal__navbar--fadein');
  }

  function zoomPhoto(change) {
    return function zoom() {
      let currentPhoto = currentGallery[currentPhotoIndex];
      if (!currentPhoto.loaded) return;

      let newZoomLevel = currentPhoto.zoomLevel += change;

      if (newZoomLevel >= 4) {
        newZoomLevel = currentPhoto.zoomLevel = 4;
        modalMagnifyBtn.classList.remove('popup-modal__btn');
        modalMagnifyBtn.classList.add('popup-modal__btn--dim');
      } else {
        modalMagnifyBtn.classList.add('popup-modal__btn');
        modalMagnifyBtn.classList.remove('popup-modal__btn--dim');
      }

      if (newZoomLevel <= 1) {
        newZoomLevel = currentPhoto.zoomLevel = 1;
        modalMinifyBtn.classList.remove('popup-modal__btn');
        modalMinifyBtn.classList.add('popup-modal__btn--dim');
      } else {
        modalMinifyBtn.classList.add('popup-modal__btn');
        modalMinifyBtn.classList.remove('popup-modal__btn--dim');
      }

      // currentPhoto.img.style.transform = `scale(${newZoomLevel})
      // translate(${currentPhoto.translateX}px, ${currentPhoto.translateY}px)`;
      snapImgToFrame(currentPhoto);
    }
  }

  modalMagnifyBtn.onclick = zoomPhoto(0.5);
  modalMinifyBtn.onclick = zoomPhoto(-0.5);

  function nextPhoto() {
    let leftIndex = currentPhotoIndex - 1;
    if (leftIndex < 0) leftIndex = currentGallery.length - 1;

    if (++currentPhotoIndex >= currentGallery.length) currentPhotoIndex = 0;
    updateModalCounter();

    let leftPhotoObj = currentGallery[leftIndex];
    // reset transform on image to the left
    leftPhotoObj.img.style.transform = `translate(${leftPhotoObj.translateX}px, ${leftPhotoObj.translateY}px) scale(${leftPhotoObj.zoomLevel})`;

    modalPhoto.classList.add('popup-modal__photo--left');
    modalPhoto.classList.remove('popup-modal__photo--center');
    modalPhotoLeft.classList.remove('popup-modal__photo--transition');
    modalPhotoLeft.classList.add('popup-modal__photo--right');
    modalPhotoLeft.classList.remove('popup-modal__photo--left');
    modalPhotoRight.classList.add('popup-modal__photo--transition');
    modalPhotoRight.classList.add('popup-modal__photo--center');
    modalPhotoRight.classList.remove('popup-modal__photo--right');

    let right = modalPhotoRight;
    modalPhotoRight = modalPhotoLeft;
    modalPhotoLeft = modalPhoto;
    modalPhoto = right;

    if (currentPhotoIndex + 1 >= currentGallery.length) {
      let firstEl = currentGallery[0];
      modalPhotoRight.firstChild.replaceWith(firstEl.img)
      firstEl.load();
    }
    else {
      let nextEl = currentGallery[currentPhotoIndex + 1];
      modalPhotoRight.firstChild.replaceWith(nextEl.img);
      nextEl.load();
    }

    zoomPhoto(0)(); // reset magnify & minify buttons
  }
  function prevPhoto() {
    let rightIndex = currentPhotoIndex + 1;
    if (rightIndex > currentGallery.length - 1) rightIndex = 0;

    if (--currentPhotoIndex < 0) currentPhotoIndex = currentGallery.length - 1;
    updateModalCounter();

    let rightPhotoObj = currentGallery[rightIndex];
    // reset transform on image to the right
    rightPhotoObj.img.style.transform = `translate(${rightPhotoObj.translateX}px, ${rightPhotoObj.translateY}px) scale(${rightPhotoObj.zoomLevel})`;
    
    modalPhoto.classList.add('popup-modal__photo--right');
    modalPhoto.classList.remove('popup-modal__photo--center');
    modalPhotoRight.classList.remove('popup-modal__photo--transition');
    modalPhotoRight.classList.add('popup-modal__photo--left');
    modalPhotoRight.classList.remove('popup-modal__photo--right');
    modalPhotoLeft.classList.add('popup-modal__photo--transition');
    modalPhotoLeft.classList.add('popup-modal__photo--center');
    modalPhotoLeft.classList.remove('popup-modal__photo--left');

    let left = modalPhotoLeft;
    modalPhotoLeft = modalPhotoRight;
    modalPhotoRight = modalPhoto;
    modalPhoto = left;

    if (currentPhotoIndex - 1 < 0) {
      let lastEl = currentGallery[currentGallery.length - 1];
      modalPhotoLeft.firstChild.replaceWith(lastEl.img)
      lastEl.load();
    }
    else {
      let prevEl = currentGallery[currentPhotoIndex - 1];
      modalPhotoLeft.firstChild.replaceWith(prevEl.img);
      prevEl.load();
    }

    zoomPhoto(0)(); // reset magnify & minify buttons
  }

  popupModal.addEventListener('mousedown', startPan);
  window.addEventListener('mouseup', cancelPan);
  window.addEventListener('mousemove', pan);
  let panningPhoto = false;
  let startingPanPoint = null;
  let currentImg;
  let currentFrameWidth;
  let currentFrameHeight;
  let imgWidth;
  let imgHeight;
  let swiping = false;

  function startPan(e) {
    currentFrameWidth = popupModalFrame.offsetWidth;
    currentFrameHeight = popupModalFrame.offsetHeight;
    currentImg = currentGallery[currentPhotoIndex];
    imgWidth = currentImg.origWidth * currentImg.zoomLevel;
    imgHeight = currentImg.origHeight * currentImg.zoomLevel;
    panningPhoto = true;

    if (imgWidth <= currentFrameWidth && imgHeight <= currentFrameHeight) {
      swiping = true;
    }

    startingPanPoint = [e.clientX, e.clientY];
    e.preventDefault();
  }
  function pan(e) {
    if (panningPhoto) {
      let zoomLevel = currentImg.zoomLevel;
      let moveX = e.clientX - startingPanPoint[0];
      let moveY = e.clientY - startingPanPoint[1];

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
      moveX = e.clientX - startingPanPoint[0];
      moveY = e.clientY - startingPanPoint[1];
    }

    if (panningPhoto && !swiping) {
      panningPhoto = false;
      currentImg.translateX += moveX;
      currentImg.translateY += moveY;
      snapImgToFrame(currentImg);
    } else if (swiping) {
      panningPhoto = swiping = false;
      if (moveX > 50) prevPhoto();
      else if (moveX < -50) nextPhoto();
      else snapImgToFrame(currentImg);
    }
  }

  function snapImgToFrame(img) {
    const imgWidth = img.origWidth * img.zoomLevel;
    const imgHeight = img.origHeight * img.zoomLevel;
    const frameWidth = popupModalFrame.offsetWidth;
    const frameHeight = popupModalFrame.offsetHeight;

    if (imgWidth > frameWidth) {
      const imgRightEdgeX = (imgWidth / 2) + (frameWidth / 2) + img.translateX;
      const imgLeftEdgeX = (frameWidth / 2) - (imgWidth / 2) + img.translateX;

      if (imgRightEdgeX < frameWidth) {
       img.translateX += frameWidth - imgRightEdgeX; 
      } else if(imgLeftEdgeX > 0) {
        img.translateX -= imgLeftEdgeX;
      }
    }

    if (imgHeight > frameHeight) {
      const imgBottomEdgeY = (imgHeight / 2) + (frameHeight / 2) + img.translateY;
      const imgTopEdgeY = (frameHeight / 2) - (imgHeight / 2) + img.translateY;

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


    modalPhoto.firstChild.style.transform = `translate(${img.translateX}px, ${img.translateY}px) scale(${img.zoomLevel})`;
  }

  function updateModalCounter() {
    popupModalCounter.firstChild.textContent = `${currentPhotoIndex + 1} / ${currentGallery.length}`;
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
