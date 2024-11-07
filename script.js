document.addEventListener('DOMContentLoaded', () => {
    // Select all category links
    const categoryLinks = document.querySelectorAll('.category');
    
    // Add event listener to each category
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const selectedCategory = e.target.getAttribute('data-category');
            filterArticlesByCategory(selectedCategory);
        });
    });
    
    // Function to filter articles by category
    function filterArticlesByCategory(category) {
        // Select all article sections
        const allArticles = document.querySelectorAll('.news-item');
        
        // Show all articles if "home" is selected, otherwise filter by category
        allArticles.forEach(article => {
            if (category === 'home' || article.classList.contains(category)) {
                article.style.display = 'block'; // Show the article
            } else {
                article.style.display = 'none'; // Hide the article
            }
        });
    }
    
    // Load Home articles by default when the page loads
    filterArticlesByCategory('home');
    
    // Handle Read More button
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('read-more')) {
            const fullContent = e.target.nextElementSibling;
            const isVisible = fullContent.style.display === 'block';
            fullContent.style.display = isVisible ? 'none' : 'block';
        }
    });
});
