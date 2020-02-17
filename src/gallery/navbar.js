import minBtn from './img/minify.png';
import magBtn from './img/magnify.png';
import shareBtn from './img/share.png';
import expandBtn from './img/expand.png';
import xBtn from './img/x.png';

function createNavBar() {
  return `<div class="popup-modal__navbar">

      <div class="popup-modal__counter">
        <span></span>
      </div>

      <div class="popup-modal__minify-btn popup-modal__btn--dim">
        <img src=${minBtn}>
      </div>

      <div class="popup-modal__magnify-btn popup-modal__btn">
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


    </div>`;
}

export { createNavBar as default };
