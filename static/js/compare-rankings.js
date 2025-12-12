// Compare Rankings Functionality
document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country');
    const resultsSection = document.getElementById('results-section');
    
    // Mock rankings data
    const rankingsData = {
        'United Kingdom': {
            'arts-humanities': [
                { rank: 1, name: 'University of Oxford', score: 99.5, logo: '/static/images/universities/oxford-logo.png' },
                { rank: 2, name: 'University of Cambridge', score: 98.7, logo: '/static/images/universities/cambridge-logo.png' },
                { rank: 3, name: 'University of Edinburgh', score: 95.2, logo: '/static/images/universities/edinburgh-logo.png' },
                { rank: 4, name: 'UCL', score: 94.8, logo: '/static/images/universities/ucl-logo.png' },
                { rank: 5, name: 'King\'s College London', score: 93.1, logo: '/static/images/universities/kcl-logo.png' }
            ],
            'life-sciences': [
                { rank: 1, name: 'University of Cambridge', score: 99.8, logo: '/static/images/universities/cambridge-logo.png' },
                { rank: 2, name: 'University of Oxford', score: 99.3, logo: '/static/images/universities/oxford-logo.png' },
                { rank: 3, name: 'Imperial College London', score: 97.5, logo: '/static/images/universities/imperial-logo.png' },
                { rank: 4, name: 'UCL', score: 95.6, logo: '/static/images/universities/ucl-logo.png' },
                { rank: 5, name: 'University of Edinburgh', score: 94.2, logo: '/static/images/universities/edinburgh-logo.png' }
            ],
            'engineering': [
                { rank: 1, name: 'University of Cambridge', score: 99.2, logo: '/static/images/universities/cambridge-logo.png' },
                { rank: 2, name: 'Imperial College London', score: 98.9, logo: '/static/images/universities/imperial-logo.png' },
                { rank: 3, name: 'University of Oxford', score: 97.8, logo: '/static/images/universities/oxford-logo.png' },
                { rank: 4, name: 'University of Manchester', score: 94.5, logo: '/static/images/universities/manchester-logo.png' },
                { rank: 5, name: 'UCL', score: 93.7, logo: '/static/images/universities/ucl-logo.png' }
            ],
            'natural-sciences': [
                { rank: 1, name: 'University of Cambridge', score: 99.6, logo: '/static/images/universities/cambridge-logo.png' },
                { rank: 2, name: 'University of Oxford', score: 98.4, logo: '/static/images/universities/oxford-logo.png' },
                { rank: 3, name: 'Imperial College London', score: 97.2, logo: '/static/images/universities/imperial-logo.png' },
                { rank: 4, name: 'University of Edinburgh', score: 95.8, logo: '/static/images/universities/edinburgh-logo.png' },
                { rank: 5, name: 'UCL', score: 94.3, logo: '/static/images/universities/ucl-logo.png' }
            ],
            'social-sciences': [
                { rank: 1, name: 'University of Oxford', score: 99.1, logo: '/static/images/universities/oxford-logo.png' },
                { rank: 2, name: 'London School of Economics', score: 98.6, logo: '/static/images/universities/lse-logo.png' },
                { rank: 3, name: 'University of Cambridge', score: 97.9, logo: '/static/images/universities/cambridge-logo.png' },
                { rank: 4, name: 'UCL', score: 95.4, logo: '/static/images/universities/ucl-logo.png' },
                { rank: 5, name: 'University of Edinburgh', score: 94.7, logo: '/static/images/universities/edinburgh-logo.png' }
            ],
            'staff-ratio': [
                { rank: 1, name: 'Imperial College London', value: '1:11', logo: '/static/images/universities/imperial-logo.png' },
                { rank: 2, name: 'University of Cambridge', value: '1:11', logo: '/static/images/universities/cambridge-logo.png' },
                { rank: 3, name: 'University of Oxford', value: '1:11', logo: '/static/images/universities/oxford-logo.png' },
                { rank: 4, name: 'London School of Economics', value: '1:12', logo: '/static/images/universities/lse-logo.png' },
                { rank: 5, name: 'UCL', value: '1:10', logo: '/static/images/universities/ucl-logo.png' }
            ],
            'international-students': [
                { rank: 1, name: 'Imperial College London', value: '59%', logo: '/static/images/universities/imperial-logo.png' },
                { rank: 2, name: 'London School of Economics', value: '71%', logo: '/static/images/universities/lse-logo.png' },
                { rank: 3, name: 'University of Oxford', value: '44%', logo: '/static/images/universities/oxford-logo.png' },
                { rank: 4, name: 'UCL', value: '53%', logo: '/static/images/universities/ucl-logo.png' },
                { rank: 5, name: 'University of Cambridge', value: '39%', logo: '/static/images/universities/cambridge-logo.png' }
            ],
            'graduate-prospects': [
                { rank: 1, name: 'Imperial College London', value: '95%', logo: '/static/images/universities/imperial-logo.png' },
                { rank: 2, name: 'University of Cambridge', value: '94%', logo: '/static/images/universities/cambridge-logo.png' },
                { rank: 3, name: 'University of Oxford', value: '93%', logo: '/static/images/universities/oxford-logo.png' },
                { rank: 4, name: 'London School of Economics', value: '92%', logo: '/static/images/universities/lse-logo.png' },
                { rank: 5, name: 'University of Bath', value: '91%', logo: '/static/images/universities/bath-logo.png' }
            ],
            'student-satisfaction': [
                { rank: 1, name: 'University of St Andrews', value: '92%', logo: '/static/images/universities/st-andrews-logo.png' },
                { rank: 2, name: 'Loughborough University', value: '90%', logo: '/static/images/universities/loughborough-logo.png' },
                { rank: 3, name: 'University of Bath', value: '89%', logo: '/static/images/universities/bath-logo.png' },
                { rank: 4, name: 'University of Oxford', value: '88%', logo: '/static/images/universities/oxford-logo.png' },
                { rank: 5, name: 'University of Cambridge', value: '87%', logo: '/static/images/universities/cambridge-logo.png' }
            ]
        },
        'Ireland': {
            'arts-humanities': [
                { rank: 1, name: 'Trinity College Dublin', score: 92.3, logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', score: 88.5, logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University College Cork', score: 85.2, logo: '/static/images/universities/ucc-logo.png' }
            ],
            'life-sciences': [
                { rank: 1, name: 'Trinity College Dublin', score: 91.8, logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', score: 89.3, logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University of Galway', score: 86.7, logo: '/static/images/universities/galway-logo.png' }
            ],
            'engineering': [
                { rank: 1, name: 'Trinity College Dublin', score: 90.5, logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', score: 88.2, logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University College Cork', score: 85.9, logo: '/static/images/universities/ucc-logo.png' }
            ],
            'natural-sciences': [
                { rank: 1, name: 'Trinity College Dublin', score: 91.2, logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', score: 87.8, logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University of Galway', score: 84.5, logo: '/static/images/universities/galway-logo.png' }
            ],
            'social-sciences': [
                { rank: 1, name: 'Trinity College Dublin', score: 92.7, logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', score: 89.4, logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University College Cork', score: 86.1, logo: '/static/images/universities/ucc-logo.png' }
            ],
            'staff-ratio': [
                { rank: 1, name: 'Trinity College Dublin', value: '1:16', logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', value: '1:18', logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University College Cork', value: '1:19', logo: '/static/images/universities/ucc-logo.png' }
            ],
            'international-students': [
                { rank: 1, name: 'Trinity College Dublin', value: '28%', logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', value: '26%', logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University of Limerick', value: '22%', logo: '/static/images/universities/limerick-logo.png' }
            ],
            'graduate-prospects': [
                { rank: 1, name: 'Trinity College Dublin', value: '89%', logo: '/static/images/universities/trinity-logo.png' },
                { rank: 2, name: 'University College Dublin', value: '87%', logo: '/static/images/universities/ucd-logo.png' },
                { rank: 3, name: 'University College Cork', value: '85%', logo: '/static/images/universities/ucc-logo.png' }
            ],
            'student-satisfaction': [
                { rank: 1, name: 'University of Limerick', value: '88%', logo: '/static/images/universities/limerick-logo.png' },
                { rank: 2, name: 'Trinity College Dublin', value: '86%', logo: '/static/images/universities/trinity-logo.png' },
                { rank: 3, name: 'University College Cork', value: '85%', logo: '/static/images/universities/ucc-logo.png' }
            ]
        }
    };
    
    // Handle country selection
    countrySelect.addEventListener('change', function() {
        const country = this.value;
        if (country) {
            displayRankings(country);
        } else {
            resultsSection.classList.add('hidden');
        }
    });
    
    // Display rankings
    function displayRankings(country) {
        const data = rankingsData[country];
        resultsSection.classList.remove('hidden');
        
        // Update all ranking sections
        updateRankingSection('arts-humanities', data['arts-humanities']);
        updateRankingSection('life-sciences', data['life-sciences']);
        updateRankingSection('engineering', data['engineering']);
        updateRankingSection('natural-sciences', data['natural-sciences']);
        updateRankingSection('social-sciences', data['social-sciences']);
        updateRankingSection('staff-ratio', data['staff-ratio']);
        updateRankingSection('international-students', data['international-students']);
        updateRankingSection('graduate-prospects', data['graduate-prospects']);
        updateRankingSection('student-satisfaction', data['student-satisfaction']);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update individual ranking section
    function updateRankingSection(sectionId, rankings) {
        const grid = document.getElementById(`${sectionId}-grid`);
        
        grid.innerHTML = rankings.map(item => `
            <div class="bg-white dark:bg-secondary rounded-22 p-4 shadow-round-box hover:shadow-hero-box transition-all duration-300">
                <div class="flex items-center gap-4">
                    <div class="text-32 font-bold text-primary w-12 text-center">
                        ${item.rank}
                    </div>
                    <img src="${item.logo}" alt="${item.name}" class="w-12 h-12 object-contain">
                    <div class="flex-1">
                        <h4 class="font-bold text-sm mb-1">${item.name}</h4>
                        <p class="text-Aquamarine font-medium">
                            ${item.score ? `Score: ${item.score}` : item.value}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }
});
