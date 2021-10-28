export const fetchApi = {
  query: '',
  url: 'https://pixabay.com/api/',
  API_KEY: '24022997-1f6b45243be8e45a3cc65a02f',
  imgType: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
  incrementPage() {
    this.page += 1;
  },
  resetPage() {
    this.page = 1;
  },
};

const axios = require('axios');

export async function fetchQuery() {
  const { query, url, API_KEY, imgType, orientation, safesearch, page, per_page } = fetchApi;

  const stringQuery = `${url}?key=${API_KEY}&q=${query}&image_type=${imgType}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`;

  try {
    const response = await axios.get(stringQuery);
    fetchApi.incrementPage();
    return response.data;
  } catch (error) {
    return error;
  }
}
