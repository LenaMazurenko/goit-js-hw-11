import './css/styles.css';
import { fetchQuery, galleryApi } from './js/fetchQuery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//import 'simplelightbox/dist/simple-lightbox.js';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-input'),
  btnSearch: document.querySelector('.search-btn'),
  btnLoadMore: document.querySelector('.load-more-btn'),
  galleryContainer: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMore);
const lightbox = new SimpleLightbox('.gallery a');

////////////////////////////

function onSearch(e) {
  e.preventDefault();

  refs.btnLoadMore.hidden = true;
  galleryApi.query = e.currentTarget.elements.searchQuery.value.trim();
  galleryApi.resetPage();
  clearGalleryContainer();

  if (!galleryApi.query) return;

  fetchQuery()
    .then(data => {
      if (data.total === 0) {
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        return;
      }

      Notify.info(`Hooray! We found ${data.total} images.`);
      renderGallery(data.hits);

      if (galleryApi.page * galleryApi.per_page >= data.total) {
        refs.btnLoadMore.hidden = true;
        setTimeout(
          () => Notify.failure(`"We're sorry, but you've reached the end of search results."`),
          1000,
        );
      } else refs.btnLoadMore.hidden = false;
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
    .map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
      return `<a class='gallery__item' href="${largeImageURL}">
      <div class="photo-card">
      <img class='gallery__image' src="${webformatURL}" alt="${tags}" title=""/>
    <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div></a>`;
    })
    .join('');
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}