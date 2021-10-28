import './css/styles.css';
import { fetchQuery, fetchApi } from './js/fetchQuery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
////////////////////////////////////

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
  updatePagesComponent();

  fetchApi.query = e.currentTarget.elements.searchQuery.value.trim();
  if (!fetchApi.query) return;

  fetchQuery()
    .then(data => {
      if (data.total === 0) {
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        return;
      }
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      renderGallery(data.hits);
      scrollToEndOfGallery();
      lightbox.refresh();
      refs.btnLoadMore.classList.remove('visualy-hidden');
      checkOnLastPage(data.totalHits);
    })
    .catch(error => {
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    });
}
//////////////////////////

function onLoadMore() {
  fetchQuery()
    .then(data => {
      renderGallery(data.hits);
      scrollToEndOfGallery();
      lightbox.refresh();
    })
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
}
//////////////////////////////////

function updatePagesComponent() {
  refs.btnLoadMore.classList.add('visualy-hidden');
  //refs.btnLoadMore.clas;
  fetchApi.resetPage();
  refs.galleryContainer.innerHTML = '';
}
//////////////////////////////

function checkOnLastPage(total) {
  if (fetchApi.page * fetchApi.per_page >= total) {
    //refs.btnLoadMore.classList.remove('load-more-btn');
    refs.btnLoadMore.classList.add('visualy-hidden');
    setTimeout(
      () => Notify.failure(`"We're sorry, but you've reached the end of search results."`),
      1000,
    );
  }
  //refs.btnLoadMore.classList.add('load-more-btn');
}

function scrollToEndOfGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 10 + 100,
    behavior: 'smooth',
  });
}
