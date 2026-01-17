from django.shortcuts import render
from django.http import JsonResponse
from .models import University, Course, Scholarship

def university_search(request):
    """Render the university search page"""
    return render(request, 'university-search.html')

def get_universities(request):
    """API endpoint to fetch universities with filters"""
    universities = University.objects.all()
    
    # Apply filters
    university_id = request.GET.get('university_id', '').strip()
    slug = request.GET.get('slug', '').strip()
    name = request.GET.get('name', '').strip()
    country = request.GET.get('country', '').strip()
    level = request.GET.get('level', '').strip()
    
    if university_id:
        universities = universities.filter(university_id=university_id)
    
    if slug:
        universities = universities.filter(slug=slug)
    
    if name:
        universities = universities.filter(name__icontains=name)
    
    if country:
        universities = universities.filter(country=country)
    
    if level:
        # Filter universities that have courses of the specified level
        # Only apply this filter if universities have any courses
        universities_with_courses = universities.filter(courses__level=level).distinct()
        # If the filter returns results, use it; otherwise keep all universities (for countries without courses yet)
        if universities_with_courses.exists():
            universities = universities_with_courses
    
    # Prepare data
    data = []
    for uni in universities:
        # Check if this is a detail page request (slug filter) or search page
        is_detail_page = slug and slug == uni.slug
        overview_text = uni.overview if is_detail_page else (uni.overview[:150] + '...' if len(uni.overview) > 150 else uni.overview)
        
        data.append({
            'university_id': uni.university_id,
            'name': uni.name,
            'slug': uni.slug,
            'country': uni.country,
            'city': uni.city,
            'overview': overview_text,
            'website': uni.website,
            'logo': uni.logo if uni.logo else None,
            'banner': uni.banner if uni.banner else None,
            'avg_ug_tuition': float(uni.avg_ug_tuition) if uni.avg_ug_tuition else None,
            'avg_pg_tuition': float(uni.avg_pg_tuition) if uni.avg_pg_tuition else None,
            'ranking': uni.ranking,
            'population': uni.population,
            'acceptance_rate': float(uni.acceptance_rate) if uni.acceptance_rate else None,
            'estimated_living_cost_annual': float(uni.estimated_living_cost) if uni.estimated_living_cost else None,
            'admission_requirements': uni.admission_requirements if is_detail_page else None,
            'graduation_rate': float(uni.graduation_rate) if uni.graduation_rate else None,
        })
    
    return JsonResponse({'universities': data, 'count': len(data)})

def get_scholarships(request):
    """API endpoint to fetch scholarships for a university"""
    university_id = request.GET.get('university_id', '').strip()
    
    if not university_id:
        return JsonResponse({'scholarships': [], 'count': 0})
    
    scholarships = Scholarship.objects.filter(university__university_id=university_id)
    
    data = []
    for scholarship in scholarships:
        data.append({
            'name': scholarship.name,
            'level': scholarship.level,
            'award_type': scholarship.award_type,
            'award_value': scholarship.award_value,
            'currency': scholarship.currency,
            'description': scholarship.description,
        })
    
    return JsonResponse({'scholarships': data, 'count': len(data)})
