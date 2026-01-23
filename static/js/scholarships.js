// Scholarships page functionality
let scholarshipsData = [];
let universitiesData = {};
let currentDisplayCount = 20;
let filteredScholarships = [];

// Load scholarships data
async function loadScholarships() {
    try {
        const response = await fetch('/static/data/scholarships.csv');
        const text = await response.text();
        
        // Parse CSV
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        scholarshipsData = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
                const values = parseCSVLine(line);
                const scholarship = {};
                headers.forEach((header, index) => {
                    scholarship[header] = values[index] || '';
                });
                return scholarship;
            });
        
        console.log(`Loaded ${scholarshipsData.length} scholarships`);
        
        // Load universities for mapping
        await loadUniversities();
        
        // Populate filters
        populateFilters();
        
        // Display scholarships
        displayScholarships(scholarshipsData);
        
    } catch (error) {
        console.error('Error loading scholarships:', error);
        showNoResults();
    }
}

// Parse CSV line handling commas in quotes
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    
    return values;
}

// Load universities data
async function loadUniversities() {
    try {
        const response = await fetch('/static/data/universities.csv');
        const text = await response.text();
        
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        lines.slice(1)
            .filter(line => line.trim())
            .forEach(line => {
                const values = parseCSVLine(line);
                const uni = {};
                headers.forEach((header, index) => {
                    uni[header] = values[index] || '';
                });
                if (uni.university_id) {
                    universitiesData[uni.university_id] = {
                        name: uni.name,
                        country: uni.country
                    };
                }
            });
        
        console.log(`Loaded ${Object.keys(universitiesData).length} universities`);
    } catch (error) {
        console.error('Error loading universities:', error);
    }
}

// Populate filter dropdowns
function populateFilters() {
    // Location filter is now static with UK and Ireland options
    // No dynamic population needed
}

// Display scholarships
function displayScholarships(scholarships, append = false) {
    const grid = document.getElementById('scholarships-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const loadMoreContainer = document.getElementById('load-more-container');
    
    if (!grid) return;
    
    // Store filtered scholarships for Load More
    if (!append) {
        filteredScholarships = scholarships;
        currentDisplayCount = 20;
        grid.innerHTML = '';
    }
    
    if (scholarships.length === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
        resultsCount.textContent = '0';
        if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    noResults.classList.add('hidden');
    resultsCount.textContent = scholarships.length;
    
    // Display scholarships up to currentDisplayCount
    const toDisplay = append ? scholarships.slice(currentDisplayCount - 20, currentDisplayCount) : scholarships.slice(0, currentDisplayCount);
    
    toDisplay.forEach((scholarship, index) => {
        const actualIndex = append ? currentDisplayCount - 20 + index : index;
        const card = createScholarshipCard(scholarship, actualIndex);
        grid.appendChild(card);
    });
    
    // Show/hide Load More button
    if (loadMoreContainer) {
        if (currentDisplayCount < scholarships.length) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }
}

// Create scholarship card
function createScholarshipCard(scholarship, index) {
    const card = document.createElement('div');
    card.className = 'bg-white/80 backdrop-blur-md dark:bg-dark_card/80 rounded-22 p-6 shadow-round-box';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index % 4) * 100);
    
    // Get university name
    const universityName = universitiesData[scholarship.university_id]?.name || 'Various Universities';
    
    // Format award value
    const awardValue = formatAwardValue(scholarship.award_value, scholarship.currency);
    
    // Format deadline
    const deadline = formatDate(scholarship.deadline);
    
    // Determine status badge
    const statusBadge = getStatusBadge(scholarship.deadline);
    
    // Parse level
    const level = formatLevel(scholarship.level);
    
    // Parse requirements
    const requirements = scholarship.requirements ? scholarship.requirements.split(';').filter(r => r.trim()) : [];
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-22 font-bold pr-4">${scholarship.name}</h3>
            ${statusBadge}
        </div>
        
        <div class="mb-3 text-sm text-primary font-semibold">
            ${universityName}
        </div>
        
        <div class="space-y-2 mb-4">
            <p class="text-SlateBlueText dark:text-opacity-80">
                <strong>Award:</strong> ${awardValue}
            </p>
            <p class="text-SlateBlueText dark:text-opacity-80">
                <strong>Award Type:</strong> ${scholarship.award_type}
            </p>
            <p class="text-SlateBlueText dark:text-opacity-80">
                <strong>Deadline:</strong> ${deadline}
            </p>
            <p class="text-SlateBlueText dark:text-opacity-80">
                <strong>Level:</strong> ${level}
            </p>
            <p class="text-SlateBlueText dark:text-opacity-80">
                <strong>Eligibility:</strong> ${scholarship.eligibility}
            </p>
        </div>
        
        ${scholarship.description ? `
        <div class="mb-4">
            <p class="text-sm text-SlateBlueText dark:text-opacity-80 line-clamp-3">
                ${scholarship.description}
            </p>
        </div>
        ` : ''}
        
        ${requirements.length > 0 ? `
        <div class="mb-4">
            <h4 class="font-bold mb-2 text-sm">Requirements:</h4>
            <ul class="list-disc list-inside text-sm text-SlateBlueText dark:text-opacity-80 space-y-1">
                ${requirements.slice(0, 3).map(req => `<li>${req.trim()}</li>`).join('')}
                ${requirements.length > 3 ? '<li class="text-gray-500">+ more...</li>' : ''}
            </ul>
        </div>
        ` : ''}
        
        ${scholarship.url ? `
        <a href="${scholarship.url.startsWith('http') ? scholarship.url : 'https://' + scholarship.url}" target="_blank" rel="noopener noreferrer" class="btn btn-1 hover-filled-slide-down rounded-lg overflow-hidden w-full block text-center">
            <span>Visit Website</span>
        </a>
        ` : `
        <button class="btn btn-1 hover-filled-slide-down rounded-lg overflow-hidden w-full" disabled>
            <span>Contact University</span>
        </button>
        `}
    `;
    
    return card;
}

// Format award value
function formatAwardValue(value, currency) {
    if (!value) return 'Contact for details';
    
    const symbol = currency === 'EUR' ? '€' : '£';
    
    // Handle ranges
    if (value.includes('-')) {
        const [min, max] = value.split('-').map(v => parseFloat(v.trim()));
        return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    }
    
    const amount = parseFloat(value);
    if (isNaN(amount)) return value;
    
    return `${symbol}${amount.toLocaleString()}`;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Rolling basis';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    } catch {
        return dateString;
    }
}

// Get status badge based on deadline
function getStatusBadge(deadline) {
    if (!deadline) {
        return '<span class="px-3 py-1 bg-Aquamarine text-green-900 dark:bg-Aquamarine dark:text-green-900 rounded-full text-sm font-medium">Open</span>';
    }
    
    try {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil < 0) {
            return '<span class="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">Closed</span>';
        } else if (daysUntil <= 30) {
            return '<span class="px-4 py-1 bg-LightYellow text-OliveDrab dark:bg-yellow-900 dark:text-yellow-100 rounded-full text-sm font-medium whitespace-nowrap">Closing Soon</span>';
        } else {
            return '<span class="px-3 py-1 bg-Aquamarine text-green-900 dark:bg-Aquamarine dark:text-green-900 rounded-full text-sm font-medium">Open</span>';
        }
    } catch {
        return '<span class="px-3 py-1 bg-Aquamarine text-green-900 dark:bg-Aquamarine dark:text-green-900 rounded-full text-sm font-medium">Open</span>';
    }
}

// Format level
function formatLevel(level) {
    const levels = {
        'UG': 'Undergraduate',
        'PG': 'Postgraduate',
        'PhD': 'PhD/Doctorate'
    };
    return levels[level] || level;
}

// Show no results message
function showNoResults() {
    const grid = document.getElementById('scholarships-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    
    if (grid) grid.classList.add('hidden');
    if (noResults) noResults.classList.remove('hidden');
    if (resultsCount) resultsCount.textContent = '0';
}

// Filter scholarships
function filterScholarships() {
    const levelFilter = document.getElementById('level-filter').value;
    const locationFilter = document.getElementById('location-filter').value;
    const searchQuery = document.getElementById('scholarship-search').value.toLowerCase();
    
    let filtered = scholarshipsData;
    
    // Filter by level
    if (levelFilter) {
        filtered = filtered.filter(s => s.level === levelFilter);
    }
    
    // Filter by location (country)
    if (locationFilter) {
        filtered = filtered.filter(s => {
            const university = universitiesData[s.university_id];
            if (!university) return false;
            
            if (locationFilter === 'UK') {
                return university.country === 'UK';
            } else if (locationFilter === 'IE') {
                return university.country === 'IE';
            }
            return false;
        });
    }
    
    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(s => {
            const uniName = universitiesData[s.university_id]?.name || '';
            const searchText = `${s.name} ${s.description} ${s.eligibility} ${uniName}`.toLowerCase();
            return searchText.includes(searchQuery);
        });
    }
    
    displayScholarships(filtered);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load scholarships on page load
    loadScholarships();
    
    // Setup filter event listeners
    const levelFilter = document.getElementById('level-filter');
    const locationFilter = document.getElementById('location-filter');
    const searchInput = document.getElementById('scholarship-search');
    
    if (levelFilter) {
        levelFilter.addEventListener('change', filterScholarships);
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('change', filterScholarships);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterScholarships, 300));
    }
    
    // Load More button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentDisplayCount += 20;
            displayScholarships(filteredScholarships, true);
        });
    }
});

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
