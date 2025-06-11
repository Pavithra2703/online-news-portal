const apiKey = '65ca6160d151138cde66afbce02fa6a9';
let currentPage = 1;
let currentCategory = '';
let searchTerm = '';
let timeFilter = '';

const container = document.getElementById('news-container');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const timeFilterSelect = document.getElementById('timeFilter');

function getFromDate(range) {
  const now = new Date();
  if (range === '1h') now.setHours(now.getHours() - 1);
  else if (range === '24h') now.setDate(now.getDate() - 1);
  else if (range === '7d') now.setDate(now.getDate() - 7);
  return now.toISOString().split('T')[0];
}

function buildUrl() {
  const isSearch = !searchTerm;
  const base = isSearch ? 'top-headlines' : 'search';
  const params = new URLSearchParams({
    apikey: apiKey,
    lang: 'en',
    country: 'us',
    page: currentPage.toString(),
    max: '12'
  });

  if (currentCategory) params.append(isSearch ? 'category' : 'topic', currentCategory);
  if (!isSearch && searchTerm) params.append('q', searchTerm);
  if (!isSearch && timeFilter) params.append('from', getFromDate(timeFilter));

  return `https://gnews.io/api/v4/${base}?${params.toString()}`;
}

async function fetchNews(reset = false) {
  if (reset) {
    currentPage = 1;
    container.innerHTML = '';
  }

  const url = buildUrl();
  console.log('Fetching:', url);
  const res = await fetch(url);
  const data = await res.json();

  if (data.articles && data.articles.length) {
    renderArticles(data.articles);
    loadMoreBtn.style.display = 'block';
  } else {
    if (currentPage === 1) container.innerHTML = '<p>No articles found.</p>';
    loadMoreBtn.style.display = 'none';
  }
}

function renderArticles(articles) {
  articles.forEach(a => {
    const div = document.createElement('div');
    div.className = 'article';
    div.innerHTML = `
      <img src="${a.image || 'https://via.placeholder.com/400x200'}" alt="">
      <h2>${a.title}</h2>
      <p>${a.description || 'No description available.'}</p>
      <p><strong>${a.source.name}</strong> • ${new Date(a.publishedAt).toLocaleString()}</p>
    `;
    container.appendChild(div);
  });
}

document.querySelectorAll('.category').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.category').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    currentCategory = link.dataset.category;
    fetchNews(true);
  });
});

searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.trim();
  fetchNews(true);
});

timeFilterSelect.addEventListener('change', () => {
  timeFilter = timeFilterSelect.value;
  fetchNews(true);
});

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  fetchNews();
});

// Initial load
fetchNews();
