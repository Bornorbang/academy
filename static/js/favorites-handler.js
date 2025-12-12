// Global Favorites Handler for University Cards
function toggleFavorite(id, name, location, recommended) {
    const university = {
        id: id,
        name: name,
        city: location.split(',')[0].trim(),
        country: location.split(',')[1]?.trim() || 'UK',
        acceptanceRate: recommended
    };
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(fav => fav.id === id);
    
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButton(id, false);
        showToastMessage(`${name} removed from favorites`);
    } else {
        // Add to favorites
        favorites.push(university);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButton(id, true);
        showToastMessage(`${name} added to favorites`);
    }
}

function updateFavoriteButton(universityId, isFavorited) {
    const button = document.querySelector(`[data-university-id="${universityId}"]`);
    if (!button) return;
    
    const svg = button.querySelector('svg');
    if (isFavorited) {
        svg.setAttribute('fill', 'currentColor');
        svg.classList.remove('text-gray-400');
        svg.classList.add('text-red-500');
    } else {
        svg.setAttribute('fill', 'none');
        svg.classList.remove('text-red-500');
        svg.classList.add('text-gray-400');
    }
}

function initializeFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteIds = favorites.map(fav => fav.id);
    
    document.querySelectorAll('.favorite-btn').forEach(button => {
        const universityId = button.getAttribute('data-university-id');
        if (favoriteIds.includes(universityId)) {
            updateFavoriteButton(universityId, true);
        }
    });
}

function showToastMessage(message) {
    // Check if toast exists
    let toast = document.getElementById('favorite-toast');
    
    if (!toast) {
        // Create toast if it doesn't exist
        toast = document.createElement('div');
        toast.id = 'favorite-toast';
        toast.className = 'fixed top-24 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50';
        toast.style.transform = 'translateX(400px)';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeFavoriteButtons);
