// University Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('university-name');
    const countrySelect = document.getElementById('country-filter');
    const cityInput = document.getElementById('city-filter');
    const universitiesGrid = document.getElementById('universities-grid');
    
    // Mock university data
    const universities = [
        {
            id: 'cambridge',
            name: 'University of Cambridge',
            city: 'Cambridge',
            country: 'United Kingdom',
            logo: '/static/images/universities/cambridge-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£35,000',
            acceptanceRate: '21%',
            ranking: 'QS Rank: 2',
            studentsCount: '24,450',
            internationalStudents: '39%'
        },
        {
            id: 'oxford',
            name: 'University of Oxford',
            city: 'Oxford',
            country: 'United Kingdom',
            logo: '/static/images/universities/oxford-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£33,000',
            acceptanceRate: '17%',
            ranking: 'QS Rank: 4',
            studentsCount: '26,000',
            internationalStudents: '44%'
        },
        {
            id: 'imperial',
            name: 'Imperial College London',
            city: 'London',
            country: 'United Kingdom',
            logo: '/static/images/universities/imperial-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£39,000',
            acceptanceRate: '14%',
            ranking: 'QS Rank: 6',
            studentsCount: '20,000',
            internationalStudents: '59%'
        },
        {
            id: 'edinburgh',
            name: 'University of Edinburgh',
            city: 'Edinburgh',
            country: 'United Kingdom',
            logo: '/static/images/universities/edinburgh-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£34,000',
            acceptanceRate: '40%',
            ranking: 'QS Rank: 22',
            studentsCount: '35,000',
            internationalStudents: '43%'
        },
        {
            id: 'trinity',
            name: 'Trinity College Dublin',
            city: 'Dublin',
            country: 'Ireland',
            logo: '/static/images/universities/trinity-logo.png',
            tuitionFrom: '€6,800',
            tuitionTo: '€35,000',
            acceptanceRate: '35%',
            ranking: 'QS Rank: 98',
            studentsCount: '18,000',
            internationalStudents: '28%'
        },
        {
            id: 'ucd',
            name: 'University College Dublin',
            city: 'Dublin',
            country: 'Ireland',
            logo: '/static/images/universities/ucd-logo.png',
            tuitionFrom: '€6,800',
            tuitionTo: '€32,000',
            acceptanceRate: '45%',
            ranking: 'QS Rank: 171',
            studentsCount: '33,000',
            internationalStudents: '26%'
        },
        {
            id: 'ucl',
            name: 'University College London',
            city: 'London',
            country: 'United Kingdom',
            logo: '/static/images/universities/ucl-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£36,000',
            acceptanceRate: '48%',
            ranking: 'QS Rank: 9',
            studentsCount: '43,000',
            internationalStudents: '53%'
        },
        {
            id: 'manchester',
            name: 'University of Manchester',
            city: 'Manchester',
            country: 'United Kingdom',
            logo: '/static/images/universities/manchester-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£29,000',
            acceptanceRate: '56%',
            ranking: 'QS Rank: 27',
            studentsCount: '40,000',
            internationalStudents: '42%'
        },
        {
            id: 'kcl',
            name: 'King\'s College London',
            city: 'London',
            country: 'United Kingdom',
            logo: '/static/images/universities/kcl-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£32,000',
            acceptanceRate: '46%',
            ranking: 'QS Rank: 35',
            studentsCount: '31,000',
            internationalStudents: '48%'
        },
        {
            id: 'ucc',
            name: 'University College Cork',
            city: 'Cork',
            country: 'Ireland',
            logo: '/static/images/universities/ucc-logo.png',
            tuitionFrom: '€6,800',
            tuitionTo: '€25,000',
            acceptanceRate: '52%',
            ranking: 'QS Rank: 298',
            studentsCount: '21,000',
            internationalStudents: '18%'
        },
        {
            id: 'warwick',
            name: 'University of Warwick',
            city: 'Coventry',
            country: 'United Kingdom',
            logo: '/static/images/universities/warwick-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£29,000',
            acceptanceRate: '55%',
            ranking: 'QS Rank: 67',
            studentsCount: '27,000',
            internationalStudents: '41%'
        },
        {
            id: 'bristol',
            name: 'University of Bristol',
            city: 'Bristol',
            country: 'United Kingdom',
            logo: '/static/images/universities/bristol-logo.png',
            tuitionFrom: '£9,250',
            tuitionTo: '£29,000',
            acceptanceRate: '58%',
            ranking: 'QS Rank: 55',
            studentsCount: '27,500',
            internationalStudents: '28%'
        }
    ];
    
    // Filter universities
    function filterUniversities() {
        const nameFilter = nameInput.value.toLowerCase();
        const countryFilter = countrySelect.value;
        const cityFilter = cityInput.value.toLowerCase();
        
        const filtered = universities.filter(uni => {
            const matchesName = !nameFilter || uni.name.toLowerCase().includes(nameFilter);
            const matchesCountry = !countryFilter || uni.country === countryFilter;
            const matchesCity = !cityFilter || uni.city.toLowerCase().includes(cityFilter);
            
            return matchesName && matchesCountry && matchesCity;
        });
        
        displayUniversities(filtered);
    }
    
    // Display universities
    function displayUniversities(universitiesToShow) {
        if (universitiesToShow.length === 0) {
            universitiesGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-SlateBlueText dark:text-opacity-80 text-lg">
                        No universities found matching your criteria.
                    </p>
                </div>
            `;
            return;
        }
        
        universitiesGrid.innerHTML = universitiesToShow.map(uni => `
            <div class="bg-white dark:bg-secondary rounded-22 p-6 shadow-round-box hover:shadow-hero-box transition-all duration-300" data-aos="fade-up">
                <div class="flex items-start gap-4 mb-4">
                    <img src="${uni.logo}" alt="${uni.name}" class="w-16 h-16 object-contain">
                    <div class="flex-1">
                        <h3 class="text-20 font-bold mb-1">${uni.name}</h3>
                        <p class="text-SlateBlueText dark:text-opacity-80 text-sm mb-1">
                            <span class="inline-block mr-1">📍</span>${uni.city}, ${uni.country}
                        </p>
                        <p class="text-sm text-primary font-medium">${uni.ranking}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                        <p class="text-SlateBlueText dark:text-opacity-60 mb-1">Students</p>
                        <p class="font-medium">${uni.studentsCount}</p>
                    </div>
                    <div>
                        <p class="text-SlateBlueText dark:text-opacity-60 mb-1">International</p>
                        <p class="font-medium">${uni.internationalStudents}</p>
                    </div>
                    <div>
                        <p class="text-SlateBlueText dark:text-opacity-60 mb-1">Tuition Range</p>
                        <p class="font-medium">${uni.tuitionFrom} - ${uni.tuitionTo}</p>
                    </div>
                    <div>
                        <p class="text-SlateBlueText dark:text-opacity-60 mb-1">Accept Rate</p>
                        <p class="font-medium">${uni.acceptanceRate}</p>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <a href="/university-detail/${uni.id}" 
                       class="flex-1 btn btn-1 hover-filled-slide-down rounded-lg overflow-hidden inline-block text-center">
                        <span class="!px-4">View Details</span>
                    </a>
                    <button class="add-favorite bg-Aquamarine hover:bg-opacity-80 text-green-900 px-4 py-2 rounded-lg transition-colors font-medium" 
                            data-university='${JSON.stringify(uni)}'>
                        ❤️ Save
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to favorite buttons
        document.querySelectorAll('.add-favorite').forEach(button => {
            button.addEventListener('click', function() {
                const university = JSON.parse(this.getAttribute('data-university'));
                if (typeof addToFavorites === 'function') {
                    addToFavorites(university);
                }
            });
        });
    }
    
    // Add event listeners for filters
    nameInput.addEventListener('input', filterUniversities);
    countrySelect.addEventListener('change', filterUniversities);
    cityInput.addEventListener('input', filterUniversities);
    
    // Initial display
    displayUniversities(universities);
});
