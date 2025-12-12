// Favorites Management
document.addEventListener('DOMContentLoaded', function() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('empty-state');
    const favoritesCount = document.getElementById('favorites-count');
    const clearAllBtn = document.getElementById('clear-all-favorites');
    const successToast = document.getElementById('success-toast');
    const toastMessage = document.getElementById('toast-message');
    
    // Get favorites from localStorage
    function getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    }
    
    // Save favorites to localStorage
    function saveFavorites(favorites) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // Show toast message
    function showToast(message) {
        toastMessage.textContent = message;
        successToast.classList.remove('hidden');
        setTimeout(() => {
            successToast.classList.add('hidden');
        }, 3000);
    }
    
    // Create university card HTML
    function createUniversityCard(university) {
        return `
            <div class="bg-white dark:bg-secondary rounded-22 p-6 shadow-round-box hover:shadow-hero-box transition-all duration-300" data-aos="fade-up">
                <div class="mb-4">
                    <img src="${university.logo || '/static/images/placeholder-university.jpg'}" 
                         alt="${university.name}" 
                         class="w-16 h-16 object-contain mb-4">
                    <h3 class="text-22 font-bold mb-2">${university.name}</h3>
                    <p class="text-SlateBlueText dark:text-opacity-80 mb-2">
                        <span class="inline-block mr-2">📍</span>${university.city}, ${university.country}
                    </p>
                </div>
                
                <div class="space-y-2 mb-4">
                    <p class="text-sm">
                        <span class="font-medium">Tuition (International):</span> 
                        ${university.tuitionFrom || '£18,000'} - ${university.tuitionTo || '£35,000'}/year
                    </p>
                    <p class="text-sm">
                        <span class="font-medium">Acceptance Rate:</span> 
                        ${university.acceptanceRate || '65%'}
                    </p>
                    <p class="text-sm">
                        <span class="font-medium">QS Ranking:</span> 
                        ${university.ranking || 'N/A'}
                    </p>
                </div>
                
                <div class="flex gap-2">
                    <a href="/university-detail/${university.id}" 
                       class="flex-1 btn btn-1 hover-filled-slide-down rounded-lg overflow-hidden inline-block text-center">
                        <span class="!px-4">View Details</span>
                    </a>
                    <button class="remove-favorite bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors" 
                            data-id="${university.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }
    
    // Render favorites
    function renderFavorites() {
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            favoritesGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            favoritesCount.textContent = '0 universities saved';
            clearAllBtn.style.display = 'none';
        } else {
            emptyState.classList.add('hidden');
            clearAllBtn.style.display = 'block';
            favoritesCount.textContent = `${favorites.length} ${favorites.length === 1 ? 'university' : 'universities'} saved`;
            
            favoritesGrid.innerHTML = favorites.map(university => createUniversityCard(university)).join('');
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-favorite').forEach(button => {
                button.addEventListener('click', function() {
                    const universityId = this.getAttribute('data-id');
                    removeFavorite(universityId);
                });
            });
        }
    }
    
    // Remove single favorite
    function removeFavorite(universityId) {
        let favorites = getFavorites();
        const university = favorites.find(u => u.id === universityId);
        favorites = favorites.filter(u => u.id !== universityId);
        saveFavorites(favorites);
        renderFavorites();
        showToast(`${university.name} removed from favorites`);
    }
    
    // Clear all favorites
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to remove all favorites?')) {
            localStorage.removeItem('favorites');
            renderFavorites();
            showToast('All favorites cleared');
        }
    });
    
    // Initial render
    renderFavorites();
});

// Global function to add favorite (called from other pages)
function addToFavorites(university) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Check if already in favorites
    if (favorites.some(u => u.id === university.id)) {
        // Show already added message
        const toast = document.getElementById('success-toast');
        const message = document.getElementById('toast-message');
        if (toast && message) {
            message.textContent = 'University already in favorites';
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
        return false;
    }
    
    favorites.push(university);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Show success message
    const toast = document.getElementById('success-toast');
    const message = document.getElementById('toast-message');
    if (toast && message) {
        message.textContent = `${university.name} added to favorites`;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
    
    return true;
}

// Global function to check if university is in favorites
function isInFavorites(universityId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(u => u.id === universityId);
}
