// Hero Section Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('hero-search-input');
    const levelSelect = document.getElementById('hero-level-select');
    const searchBtn = document.getElementById('hero-search-btn');
    const suggestionsContainer = document.getElementById('hero-suggestions');
    
    // Dummy course data
    const courses = [
        { name: 'Business Management', category: 'Business', level: 'both' },
        { name: 'Business Administration', category: 'Business', level: 'both' },
        { name: 'International Business', category: 'Business', level: 'both' },
        { name: 'Computer Science', category: 'Technology', level: 'both' },
        { name: 'Software Engineering', category: 'Technology', level: 'both' },
        { name: 'Data Science', category: 'Technology', level: 'both' },
        { name: 'Artificial Intelligence', category: 'Technology', level: 'both' },
        { name: 'Cybersecurity', category: 'Technology', level: 'both' },
        { name: 'Medicine', category: 'Health', level: 'both' },
        { name: 'Nursing', category: 'Health', level: 'both' },
        { name: 'Pharmacy', category: 'Health', level: 'both' },
        { name: 'Public Health', category: 'Health', level: 'postgraduate' },
        { name: 'Engineering', category: 'Engineering', level: 'both' },
        { name: 'Mechanical Engineering', category: 'Engineering', level: 'both' },
        { name: 'Civil Engineering', category: 'Engineering', level: 'both' },
        { name: 'Electrical Engineering', category: 'Engineering', level: 'both' },
        { name: 'Chemical Engineering', category: 'Engineering', level: 'both' },
        { name: 'Law', category: 'Law', level: 'both' },
        { name: 'Corporate Law', category: 'Law', level: 'postgraduate' },
        { name: 'International Law', category: 'Law', level: 'postgraduate' },
        { name: 'Psychology', category: 'Social Sciences', level: 'both' },
        { name: 'Clinical Psychology', category: 'Social Sciences', level: 'postgraduate' },
        { name: 'Sociology', category: 'Social Sciences', level: 'both' },
        { name: 'Accounting & Finance', category: 'Business', level: 'both' },
        { name: 'Financial Management', category: 'Business', level: 'postgraduate' },
        { name: 'Marketing', category: 'Business', level: 'both' },
        { name: 'Digital Marketing', category: 'Business', level: 'both' },
        { name: 'Economics', category: 'Social Sciences', level: 'both' },
        { name: 'International Relations', category: 'Social Sciences', level: 'both' },
        { name: 'Political Science', category: 'Social Sciences', level: 'both' },
        { name: 'Architecture', category: 'Arts', level: 'both' },
        { name: 'Interior Design', category: 'Arts', level: 'both' },
        { name: 'Graphic Design', category: 'Arts', level: 'both' },
        { name: 'Fashion Design', category: 'Arts', level: 'undergraduate' },
        { name: 'Fine Arts', category: 'Arts', level: 'both' },
        { name: 'Education', category: 'Education', level: 'both' },
        { name: 'Early Childhood Education', category: 'Education', level: 'both' },
        { name: 'Education Leadership', category: 'Education', level: 'postgraduate' },
        { name: 'Environmental Science', category: 'Science', level: 'both' },
        { name: 'Biology', category: 'Science', level: 'both' },
        { name: 'Chemistry', category: 'Science', level: 'both' },
        { name: 'Physics', category: 'Science', level: 'both' },
        { name: 'Mathematics', category: 'Science', level: 'both' },
        { name: 'Biomedical Science', category: 'Health', level: 'both' },
        { name: 'MBA', category: 'Business', level: 'postgraduate' },
        { name: 'Project Management', category: 'Business', level: 'postgraduate' },
        { name: 'Human Resource Management', category: 'Business', level: 'both' },
        { name: 'Supply Chain Management', category: 'Business', level: 'postgraduate' },
        { name: 'Hospitality Management', category: 'Business', level: 'both' },
        { name: 'Tourism Management', category: 'Business', level: 'both' }
    ];
    
    let selectedCourse = '';
    
    // Search input event listener
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                hideSuggestions();
                return;
            }
            
            const filtered = courses.filter(course => 
                course.name.toLowerCase().includes(query)
            ).slice(0, 8); // Limit to 8 suggestions
            
            showSuggestions(filtered, query);
        });
        
        // Click outside to close suggestions
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                hideSuggestions();
            }
        });
        
        // Focus event to show suggestions if input has value
        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length >= 2) {
                const query = this.value.trim().toLowerCase();
                const filtered = courses.filter(course => 
                    course.name.toLowerCase().includes(query)
                ).slice(0, 8);
                showSuggestions(filtered, query);
            }
        });
    }
    
    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    // Enter key to search
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function showSuggestions(filtered, query) {
        if (filtered.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="p-4 text-center text-SlateBlueText dark:text-opacity-80">
                    <p class="text-sm">No courses found matching "${query}"</p>
                    <p class="text-xs mt-2">Try different keywords</p>
                </div>
            `;
            suggestionsContainer.classList.remove('hidden');
            return;
        }
        
        // Group by category
        const grouped = {};
        filtered.forEach(course => {
            if (!grouped[course.category]) {
                grouped[course.category] = [];
            }
            grouped[course.category].push(course);
        });
        
        let html = '';
        
        Object.keys(grouped).forEach(category => {
            html += `
                <div class="border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div class="px-4 py-2 bg-gray-50 dark:bg-darklight">
                        <p class="text-xs font-semibold text-SlateBlueText dark:text-opacity-80 uppercase">${category}</p>
                    </div>
            `;
            
            grouped[category].forEach(course => {
                const levelBadge = course.level === 'undergraduate' ? 'UG' : 
                                  course.level === 'postgraduate' ? 'PG' : 'UG/PG';
                const levelColor = course.level === 'undergraduate' ? 'bg-blue-100 text-blue-800' : 
                                  course.level === 'postgraduate' ? 'bg-purple-100 text-purple-800' : 
                                  'bg-green-100 text-green-800';
                
                html += `
                    <div class="suggestion-item px-4 py-3 hover:bg-IcyBreeze dark:hover:bg-darklight cursor-pointer flex justify-between items-center transition-colors" data-course="${course.name}">
                        <div class="flex items-center space-x-3">
                            <svg class="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            <span class="text-sm font-medium">${course.name}</span>
                        </div>
                        <span class="text-[10px] font-semibold px-2 py-1 rounded ${levelColor}">${levelBadge}</span>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        suggestionsContainer.innerHTML = html;
        suggestionsContainer.classList.remove('hidden');
        
        // Add click handlers to suggestion items
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                selectedCourse = this.dataset.course;
                searchInput.value = selectedCourse;
                hideSuggestions();
            });
        });
    }
    
    function hideSuggestions() {
        if (suggestionsContainer) {
            suggestionsContainer.classList.add('hidden');
        }
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        const level = levelSelect.value;
        
        if (!query) {
            // Show error or highlight input
            searchInput.classList.add('border-red-500');
            setTimeout(() => {
                searchInput.classList.remove('border-red-500');
            }, 2000);
            return;
        }
        
        // Redirect to course results page
        const courseSlug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        window.location.href = `/courses/degrees/${level}/${courseSlug}/?subject=${encodeURIComponent(query)}&level=${level}`;
    }
});
