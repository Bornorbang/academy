// Compare Tuition Functionality
// TODO: This page needs to be connected to the database
// Mock data has been removed - implement API calls to fetch real tuition data

document.addEventListener('DOMContentLoaded', function() {
    const compareForm = document.getElementById('compare-form');
    const resultsSection = document.getElementById('results-section');
    
    if (compareForm) {
        compareForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Compare Tuition functionality coming soon! This will fetch real data from the database.');
            // TODO: Implement API call to /api/tuition/compare/
        });
    }
});
