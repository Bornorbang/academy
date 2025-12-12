// University Detail Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    const addFavoriteBtn = document.getElementById('add-to-favorites');
    
    // Get university data from page
    function getCurrentUniversity() {
        // This would typically come from Django template context or API
        // For now, extract from URL or use mock data
        const universityId = window.location.pathname.split('/').pop();
        
        return {
            id: universityId,
            name: document.querySelector('h1')?.textContent || 'University Name',
            city: 'City',
            country: 'Country',
            logo: '/static/images/universities/placeholder-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£35,000',
            acceptanceRate: '40%',
            ranking: 'QS Rank: 50',
            studentsCount: '25,000',
            internationalStudents: '35%'
        };
    }
    
    // Handle add to favorites
    if (addFavoriteBtn) {
        // Check if already in favorites and update button
        const university = getCurrentUniversity();
        
        if (typeof isInFavorites === 'function' && isInFavorites(university.id)) {
            addFavoriteBtn.textContent = '✓ In Favorites';
            addFavoriteBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            addFavoriteBtn.disabled = true;
        }
        
        addFavoriteBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            if (typeof addToFavorites === 'function') {
                const success = addToFavorites(university);
                
                if (success) {
                    this.textContent = '✓ In Favorites';
                    this.classList.add('bg-gray-400', 'cursor-not-allowed');
                    this.disabled = true;
                }
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Toggle expand/collapse for long content sections
    const expandButtons = document.querySelectorAll('[data-expand]');
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-expand');
            const target = document.getElementById(targetId);
            
            if (target) {
                target.classList.toggle('max-h-96');
                target.classList.toggle('overflow-hidden');
                this.textContent = target.classList.contains('max-h-96') ? 'Show More' : 'Show Less';
            }
        });
    });
});
