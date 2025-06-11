const apiKey = 'e53f16a37567447ebce3a81dd78b1840';
const container = document.getElementById('news-container');
const loadMoreBtn = document.getElementById('load-more');
let currentPage = 1, currentCategory = '', currentQuery = '', currentTime = '';

function getFromTimeRange(range) {
  const now = new Date();
  if (range === '1h') now.setHours(now.getHours() - 1);
  else if (range === '24h') now.setDate(now.getDate() - 1);
  else if (range === '7d') now.setDate(now.getDate() - 7);
  return now.toISOString();
}

async function fetchNews(page = 1) {
  let url;

  // Use top-headlines for category filtering
  if (currentCategory) {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${currentCategory}&pageSize=6&page=${page}&apiKey=${apiKey}`;
    if (currentTime) url += `&from=${getFromTimeRange(currentTime)}`;
    if (currentQuery) url += `&q=${encodeURIComponent(currentQuery)}`;
  } else {
    // Use everything for search or date filtering
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(currentQuery || 'news')}&from=${currentTime ? getFromTimeRange(currentTime) : ''}&pageSize=6&page=${page}&apiKey=${apiKey}`;
  }

  try {
    console.log('Fetching:', url);
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'ok') throw new Error(data.message || 'API error');

    if (!data.articles.length && page === 1) {
      container.innerHTML = '<p>No articles found.</p>';
      loadMoreBtn.style.display = 'none';
      return;
    }

    displayNews(data.articles);
    loadMoreBtn.style.display = 'block';
  } catch (err) {
    console.error('Error fetching news:', err);
    container.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
    loadMoreBtn.style.display = 'none';
  }
}

function displayNews(articles) {
  articles.forEach(article => {
    const div = document.createElement('div');
    div.className = 'article';
    div.innerHTML = `
      <img src="${article.urlToImage || ''}" alt="news">
      <div class="content">
        <h2>${article.title}</h2>
        <p>${article.description || ''}</p>
      </div>`;
    container.appendChild(div);
  });
}

// Event handlers
document.querySelectorAll('.category').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.category').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    resetAndFetch();
  });
});

document.getElementById('search').addEventListener('input', e => {
  currentQuery = e.target.value.trim();
  resetAndFetch();
});

document.getElementById('time-filter').addEventListener('change', e => {
  currentTime = e.target.value;
  resetAndFetch();
});

loadMoreBtn.addEventListener('click', () => fetchNews(currentPage++));

function resetAndFetch() {
  currentPage = 1;
  container.innerHTML = '';
  fetchNews(currentPage);
}

// Initial load
fetchNews();
