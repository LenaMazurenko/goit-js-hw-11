export const galleryApi = {
  query: '',
  url: 'https://pixabay.com/api/',
  API_KEY: '24022997-1f6b45243be8e45a3cc65a02f',
  imgType: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 10,
  incrementPage() {
    this.page += 1;
  },
  resetPage() {
    this.page = 1;
  },
};

const axios = require('axios');

export async function fetchQuery() {
  console.log(galleryApi);

  const { query, url, API_KEY, imgType, orientation, safesearch, page, per_page } = galleryApi;

  const stringQuery = `${url}?key=${API_KEY}&q=${query}&image_type=${imgType}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`;

  try {
    const response = await axios.get(stringQuery);
    galleryApi.incrementPage();
    return response.data;
  } catch (error) {
    return error;
  }
}
/*
 const options = {
  url: 'https://pixabay.com/api/',
  API_KEY: '24022997-1f6b45243be8e45a3cc65a02f',
  imgType: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 5,
};

const axios = require('axios');

export async function fetchQuery(query) {
  const { url, API_KEY, imgType, orientation, safesearch, page, per_page } = options;
  const stringQuery = `${url}?key=${API_KEY}&q=${query}&image_type=${imgType}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`;

  try {
    const response = await axios.get(stringQuery);
    return response.data;
  } catch (error) {
    return error;
  }
}
*/
