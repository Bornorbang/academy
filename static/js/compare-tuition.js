// Compare Tuition Functionality
document.addEventListener('DOMContentLoaded', function() {
    const compareForm = document.getElementById('compare-form');
    const resultsSection = document.getElementById('results-section');
    const resultsGrid = document.getElementById('results-grid');
    const lowestFeeBtn = document.getElementById('sort-lowest-fee');
    const bestScholarshipsBtn = document.getElementById('sort-scholarships');
    
    let currentResults = [];
    let currentSortMode = 'lowest-fee';
    
    // Mock exchange rates (replace with real API in production)
    const exchangeRates = {
        'GBP': 1,
        'EUR': 1.17,
        'NGN': 1850,
        'GHS': 15.2,
        'KES': 195,
        'ZAR': 23.5,
        'USD': 1.27,
        'INR': 105,
        'CNY': 9.2
    };
    
    // Mock university tuition data
    const universityData = [
        {
            id: 'cambridge',
            name: 'University of Cambridge',
            country: 'United Kingdom',
            logo: '/static/images/universities/cambridge-logo.png',
            tuition: {
                'Undergraduate': { home: 9250, international: 33825 },
                'Postgraduate': { home: 9250, international: 35517 },
                'MBA': { home: 65000, international: 65000 }
            },
            scholarships: [
                { name: 'Cambridge Commonwealth Scholarship', amount: 15000 },
                { name: 'Gates Cambridge Scholarship', amount: 'Full tuition' }
            ]
        },
        {
            id: 'oxford',
            name: 'University of Oxford',
            country: 'United Kingdom',
            logo: '/static/images/universities/oxford-logo.png',
            tuition: {
                'Undergraduate': { home: 9250, international: 33050 },
                'Postgraduate': { home: 9250, international: 32800 },
                'MBA': { home: 69590, international: 69590 }
            },
            scholarships: [
                { name: 'Reach Oxford Scholarship', amount: 19092 },
                { name: 'Clarendon Fund', amount: 20000 }
            ]
        },
        {
            id: 'imperial',
            name: 'Imperial College London',
            country: 'United Kingdom',
            logo: '/static/images/universities/imperial-logo.png',
            tuition: {
                'Undergraduate': { home: 9250, international: 37900 },
                'Postgraduate': { home: 11400, international: 39400 },
                'MBA': { home: 59900, international: 59900 }
            },
            scholarships: [
                { name: 'President\'s Scholarship', amount: 10000 },
                { name: 'Imperial Excellence Scholarship', amount: 5000 }
            ]
        },
        {
            id: 'trinity',
            name: 'Trinity College Dublin',
            country: 'Ireland',
            logo: '/static/images/universities/trinity-logo.png',
            tuition: {
                'Undergraduate': { home: 6800, international: 20650 },
                'Postgraduate': { home: 7200, international: 19500 },
                'MBA': { home: 35000, international: 35000 }
            },
            scholarships: [
                { name: 'Trinity International Excellence Scholarship', amount: 5000 },
                { name: 'E3 Entrance Exhibition', amount: 3000 }
            ]
        },
        {
            id: 'ucd',
            name: 'University College Dublin',
            country: 'Ireland',
            logo: '/static/images/universities/ucd-logo.png',
            tuition: {
                'Undergraduate': { home: 6800, international: 19200 },
                'Postgraduate': { home: 7200, international: 21500 },
                'MBA': { home: 32500, international: 32500 }
            },
            scholarships: [
                { name: 'UCD Global Excellence Scholarship', amount: 8000 },
                { name: 'UCD International Study Scholarship', amount: 4000 }
            ]
        },
        {
            id: 'edinburgh',
            name: 'University of Edinburgh',
            country: 'United Kingdom',
            logo: '/static/images/universities/edinburgh-logo.png',
            tuition: {
                'Undergraduate': { home: 9250, international: 28950 },
                'Postgraduate': { home: 10350, international: 31100 },
                'MBA': { home: 34100, international: 34100 }
            },
            scholarships: [
                { name: 'Edinburgh Global Undergraduate Scholarship', amount: 5000 },
                { name: 'Edinburgh Masters Scholarship', amount: 10000 }
            ]
        }
    ];
    
    // Handle form submission
    compareForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            residenceCountry: document.getElementById('residence-country').value,
            destinationCountry: document.getElementById('destination-country').value,
            programmeType: document.getElementById('programme-type').value,
            subject: document.getElementById('subject').value
        };
        
        // Filter universities based on destination country
        let filteredUniversities = universityData;
        if (formData.destinationCountry !== 'both') {
            filteredUniversities = universityData.filter(uni => 
                formData.destinationCountry === 'UK' 
                    ? uni.country === 'United Kingdom' 
                    : uni.country === 'Ireland'
            );
        }
        
        // Prepare results
        currentResults = filteredUniversities.map(uni => {
            const tuitionGBP = uni.tuition[formData.programmeType].international;
            const currency = getCurrencyCode(formData.residenceCountry);
            const convertedTuition = convertCurrency(tuitionGBP, 'GBP', currency);
            
            return {
                ...uni,
                programmeType: formData.programmeType,
                tuitionGBP: tuitionGBP,
                tuitionConverted: convertedTuition,
                currency: currency,
                totalScholarships: uni.scholarships.reduce((sum, s) => {
                    return sum + (typeof s.amount === 'number' ? s.amount : 0);
                }, 0)
            };
        });
        
        displayResults(currentResults);
    });
    
    // Sort buttons
    lowestFeeBtn.addEventListener('click', function() {
        currentSortMode = 'lowest-fee';
        currentResults.sort((a, b) => a.tuitionGBP - b.tuitionGBP);
        displayResults(currentResults, false);
        updateSortButtons();
    });
    
    bestScholarshipsBtn.addEventListener('click', function() {
        currentSortMode = 'scholarships';
        currentResults.sort((a, b) => b.totalScholarships - a.totalScholarships);
        displayResults(currentResults, false);
        updateSortButtons();
    });
    
    // Update sort button styles
    function updateSortButtons() {
        lowestFeeBtn.classList.toggle('btn-1', currentSortMode === 'lowest-fee');
        lowestFeeBtn.classList.toggle('btn_outline', currentSortMode !== 'lowest-fee');
        bestScholarshipsBtn.classList.toggle('btn-1', currentSortMode === 'scholarships');
        bestScholarshipsBtn.classList.toggle('btn_outline', currentSortMode !== 'scholarships');
    }
    
    // Convert currency
    function convertCurrency(amount, from, to) {
        const amountInGBP = amount / exchangeRates[from];
        return Math.round(amountInGBP * exchangeRates[to]);
    }
    
    // Get currency code from country
    function getCurrencyCode(country) {
        const currencyMap = {
            'Nigeria': 'NGN',
            'Ghana': 'GHS',
            'Kenya': 'KES',
            'South Africa': 'ZAR',
            'United States': 'USD',
            'India': 'INR',
            'China': 'CNY'
        };
        return currencyMap[country] || 'GBP';
    }
    
    // Format currency
    function formatCurrency(amount, currency) {
        const symbols = {
            'GBP': '£',
            'EUR': '€',
            'NGN': '₦',
            'GHS': '₵',
            'KES': 'KSh',
            'ZAR': 'R',
            'USD': '$',
            'INR': '₹',
            'CNY': '¥'
        };
        return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
    }
    
    // Display results
    function displayResults(results, scroll = true) {
        resultsSection.classList.remove('hidden');
        
        resultsGrid.innerHTML = results.map(uni => `
            <div class="bg-white dark:bg-secondary rounded-22 p-6 shadow-round-box hover:shadow-hero-box transition-all duration-300" data-aos="fade-up">
                <div class="flex items-start gap-4 mb-4">
                    <img src="${uni.logo}" alt="${uni.name}" class="w-16 h-16 object-contain">
                    <div class="flex-1">
                        <h3 class="text-20 font-bold mb-1">${uni.name}</h3>
                        <p class="text-SlateBlueText dark:text-opacity-80">${uni.country}</p>
                    </div>
                </div>
                
                <div class="bg-primary bg-opacity-10 rounded-lg p-4 mb-4">
                    <p class="text-sm text-SlateBlueText dark:text-opacity-80 mb-1">Annual Tuition Fee</p>
                    <p class="text-28 font-bold text-primary mb-1">${formatCurrency(uni.tuitionConverted, uni.currency)}</p>
                    <p class="text-sm text-SlateBlueText dark:text-opacity-60">£${uni.tuitionGBP.toLocaleString()} GBP</p>
                </div>
                
                <div class="mb-4">
                    <p class="font-medium mb-2">Available Scholarships:</p>
                    <div class="space-y-2">
                        ${uni.scholarships.map(scholarship => `
                            <div class="text-sm bg-IcyBreeze dark:bg-darklight rounded-lg p-2">
                                <p class="font-medium">${scholarship.name}</p>
                                <p class="text-Aquamarine">
                                    ${typeof scholarship.amount === 'number' 
                                        ? `£${scholarship.amount.toLocaleString()} per year` 
                                        : scholarship.amount}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <a href="/university-detail/${uni.id}" 
                       class="flex-1 btn btn-1 hover-filled-slide-down rounded-lg overflow-hidden inline-block text-center">
                        <span class="!px-4">View Details</span>
                    </a>
                </div>
            </div>
        `).join('');
        
        if (scroll) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
