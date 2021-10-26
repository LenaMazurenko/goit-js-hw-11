import './css/styles.css';
import { fetchQuery, galleryApi } from './js/fetchQuery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-input'),
  btnSearch: document.querySelector('.search-btn'),
  btnLoadMore: document.querySelector('.load-more-btn'),
  galleryContainer: document.querySelector('.gallery'),
};

const murkupArray = [];

refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);
/*refs.input.addEventListener('input', () => {  refs.btnSearch.enabled = 'true';});*/
////////////////////////////

function onSearch(e) {
  e.preventDefault();

  galleryApi.query = e.currentTarget.elements.searchQuery.value.trim();
  galleryApi.resetPage();
  clearGalleryContainer();

  if (!galleryApi.query) return;

  fetchQuery()
    .then(data => {
      if (data.total === 0) {
        refs.btnLoadMore.hidden = true;
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        return;
      }
      Notify.info(`Hooray! We found ${data.total} images.`);
      renderGallery(data.hits);
      /*refs.btnSearch.disabled = 'false';*/
      refs.btnLoadMore.hidden = false;
    })
    .catch(error => {
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    });
}
//////////////////////////

function onLoadMore() {
  fetchQuery()
    .then(data => renderGallery(data.hits))
    .catch(error => {
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    });
}
//////////////////////////////

function renderGallery(data) {
  const markup = data
    .map(({ previewURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${previewURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
