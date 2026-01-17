// Find Course Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Find course script loaded');
    const searchForm = document.getElementById('course-search-form');
    console.log('Form element:', searchForm);
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get form values
            const level = document.getElementById('level-of-study').value;
            const country = document.getElementById('destination-country').value;
            const subject = document.getElementById('course-subject').value.trim();
            
            console.log('Form values:', { level, country, subject });
            
            // Validate form
            if (!level || !country || !subject) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Redirect to course search results page with parameters
            const redirectUrl = `/course-search/?subject=${encodeURIComponent(subject)}&level=${level}&country=${country}`;
            console.log('Redirecting to:', redirectUrl);
            window.location.href = redirectUrl;
        });
    } else {
        console.error('Form not found!');
    }
});
