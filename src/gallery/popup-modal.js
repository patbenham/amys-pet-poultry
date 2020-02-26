import arrowBtn from './img/arrow.png';
import createNavBar from './navbar.js';
import { createPhotoNodesHtml } from './photo-node.js';

function createPopupModal() {
  const popupModal = document.createElement('div');
  popupModal.classList.add('popup-modal');
  popupModal.classList.add('visually-hidden');

  popupModal.innerHTML = `<div class='popup-modal__frame flex'>
      ${createPhotoNodesHtml(3)}
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
