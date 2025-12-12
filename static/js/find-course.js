// Find Course Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('course-search-form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const level = document.getElementById('level-of-study').value;
            const country = document.getElementById('destination-country').value;
            const year = document.getElementById('start-year').value;
            const subject = document.getElementById('course-subject').value.trim();
            
            // Validate form
            if (!level || !country || !year || !subject) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Create URL slug from subject
            const courseSlug = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            // Redirect to course results page with all parameters
            window.location.href = `/courses/degrees/${level}/${courseSlug}/?subject=${encodeURIComponent(subject)}&level=${level}&country=${country}&year=${year}`;
        });
    }
});
