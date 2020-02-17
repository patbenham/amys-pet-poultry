import arrowBtn from './img/arrow.png';
import createNavBar from './navbar.js';

/**
 * @param {Integer} numberOf - number of nodes to create
 * @return {String} - html for modal photo nodes
 */
function createModalPhotoNodes(numberOf) {
  function addToHTML(acc, number) {
    if (number < 1) return acc;
    return addToHTML(
      `${acc}<div class="popup-modal__photo-frame flex visually-hidden">
      </div>`,
      number - 1
    );
  }
  return addToHTML('', numberOf);
}

/*      <div class="popup-modal__photo--left popup-modal__photo-frame
        popup-modal__photo--transition flex">
        </div>
      <div class="popup-modal__photo--center popup-modal__photo-frame
        popup-modal__photo--transition flex">
        </div>
      <div class="popup-modal__photo--right  popup-modal__photo-frame
        popup-modal__photo--transition flex">
        </div>
  */

function createPopupModal() {
  const popupModal = document.createElement('div');
  popupModal.classList.add('popup-modal');
  popupModal.classList.add('visually-hidden');
  popupModal.innerHTML = `<div class='popup-modal__frame flex'>
      ${createModalPhotoNodes(3)}
    </div>
    ${createNavBar()}
    <div class="popup-modal__left-arrow">
      <img src="${arrowBtn}">
    </div>
    <div class="popup-modal__right-arrow">
      <img src="${arrowBtn}">
    </div>`;

  document.body.prepend(popupModal);
  return popupModal;
}

function getModalSelectors(popupModal) {
  return {
    popupModal,
    modalPhotos: [].slice.call(
      popupModal.querySelectorAll('.popup-modal__photo-frame')
    ),
    modalPhoto: popupModal.querySelector('.popup-modal__photo--center'),
    modalPhotoLeft: popupModal.querySelector('.popup-modal__photo--left'),
    modalPhotoRight: popupModal.querySelector('.popup-modal__photo--right'),
    modalCloseBtn: popupModal.querySelector('.popup-modal__close-btn'),
    modalLeftArrow: popupModal.querySelector('.popup-modal__left-arrow'),
    modalRightArrow: popupModal.querySelector('.popup-modal__right-arrow'),
    modalNavBar: popupModal.querySelector('.popup-modal__navbar'),
    modalExpandBtn: popupModal.querySelector('.popup-modal__expand-btn'),
    modalMagnifyBtn: popupModal.querySelector('.popup-modal__magnify-btn'),
    modalMinifyBtn: popupModal.querySelector('.popup-modal__minify-btn'),
    // modalShareBtn: popupModal.querySelector('.popup-modal__share-btn'),
    popupModalFrame: popupModal.querySelector('.popup-modal__frame'),
    popupModalCounter: popupModal.querySelector('.popup-modal__counter')
  };
}

function popupModal() {
  return getModalSelectors(createPopupModal());
}

export { popupModal as default };
