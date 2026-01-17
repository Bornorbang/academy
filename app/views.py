from django.shortcuts import render
from django.http import JsonResponse
from .models import University, Course, Scholarship
from django.db.models import Q, Count
import random
from difflib import SequenceMatcher

def home(request):
    """Render the home page with recommended universities"""
    # Get 4 random Irish universities with banner images for the recommended section
    irish_universities = list(University.objects.filter(country='IE').exclude(banner='').exclude(banner__isnull=True))
    recommended_universities = random.sample(irish_universities, min(4, len(irish_universities))) if irish_universities else []
    return render(request, 'index.html', {'recommended_universities': recommended_universities})

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

def university_courses(request, slug):
    """Render the university courses page"""
    return render(request, 'university-courses.html')

def get_courses(request):
    """API endpoint to fetch courses with filters"""
    courses = Course.objects.all()
    
    # Apply filters
    university_id = request.GET.get('university_id', '').strip()
    level = request.GET.get('level', '').strip()
    subject = request.GET.get('subject', '').strip()
    
    if university_id:
        courses = courses.filter(university__university_id=university_id)
    
    if level:
        courses = courses.filter(level=level)
    
    if subject:
        courses = courses.filter(subject__icontains=subject)
    
    # Order by course title
    courses = courses.order_by('title')
    
    # Prepare data
    data = []
    for course in courses:
        data.append({
            'course_id': course.course_id,
            'course_title': course.title,
            'level': course.level,
            'course_url': course.course_url,
            'subject': course.subject.name if course.subject else None,
            'location': course.location,
            'university_id': course.university.university_id,
            'university_name': course.university.name,
            'university_website': course.university.website,
        })
    
    return JsonResponse(data, safe=False)

def course_search_page(request):
    """Render the course search results page"""
    return render(request, 'course-search.html')

def search_courses_api(request):
    """API endpoint for course search with fuzzy matching"""
    subject = request.GET.get('subject', '').strip()
    level = request.GET.get('level', '').strip()
    country = request.GET.get('country', '').strip()
    
    if not subject:
        return JsonResponse({'universities': [], 'count': 0})
    
    # Find courses with fuzzy matching
    # First try exact match, then partial match, then fuzzy match
    courses = Course.objects.all()
    
    if level:
        courses = courses.filter(level=level)
    
    # Apply fuzzy matching on course titles
    matching_courses = []
    subject_lower = subject.lower()
    
    for course in courses:
        title_lower = course.title.lower()
        # Calculate similarity ratio
        ratio = SequenceMatcher(None, subject_lower, title_lower).ratio()
        
        # Also check if subject is contained in title
        if subject_lower in title_lower:
            ratio = max(ratio, 0.7)  # Boost partial matches
        
        # Check if any word in subject matches any word in title
        subject_words = subject_lower.split()
        title_words = title_lower.split()
        word_matches = sum(1 for sw in subject_words for tw in title_words if sw in tw or tw in sw)
        if word_matches > 0:
            ratio = max(ratio, 0.5 + (word_matches * 0.1))
        
        # Include courses with similarity > 0.4 (40% match)
        if ratio >= 0.4:
            matching_courses.append((course, ratio))
    
    # Sort by similarity (highest first)
    matching_courses.sort(key=lambda x: x[1], reverse=True)
    
    # Get unique universities from matching courses
    university_ids = set()
    university_course_count = {}
    
    for course, ratio in matching_courses:
        uni_id = course.university.university_id
        # Apply country filter
        if country and course.university.country != country:
            continue
        
        university_ids.add(uni_id)
        university_course_count[uni_id] = university_course_count.get(uni_id, 0) + 1
    
    # Fetch university details
    universities = University.objects.filter(university_id__in=university_ids)
    
    # Prepare data
    data = []
    for uni in universities:
        data.append({
            'university_id': uni.university_id,
            'name': uni.name,
            'slug': uni.slug,
            'country': uni.country,
            'city': uni.city,
            'banner': uni.banner if uni.banner else '/static/images/mine/about-us.jpg',
            'logo': uni.logo if uni.logo else None,
            'website': uni.website,
            'course_count': university_course_count.get(uni.university_id, 0),
        })
    
    # Sort by course count (universities with more matching courses first)
    data.sort(key=lambda x: x['course_count'], reverse=True)
    
    return JsonResponse({'universities': data, 'count': len(data)})
