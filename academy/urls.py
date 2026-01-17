"""
URL configuration for academy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('find-course/', TemplateView.as_view(template_name='find-course.html'), name='find-course'),
    path('course-search/', views.course_search_page, name='course-search'),
    path('api/course-search/', views.search_courses_api, name='api-course-search'),
    path('courses/degrees/undergraduate/<str:course>/', TemplateView.as_view(template_name='course-results.html'), name='undergraduate-courses'),
    path('courses/degrees/postgraduate/<str:course>/', TemplateView.as_view(template_name='course-results.html'), name='postgraduate-courses'),
    path('compare-tuition/', TemplateView.as_view(template_name='compare-tuition.html'), name='compare-tuition'),
    path('compare-rankings/', TemplateView.as_view(template_name='compare-rankings.html'), name='compare-rankings'),
    path('university-search/', views.university_search, name='university-search'),
    path('api/universities/', views.get_universities, name='get-universities'),
    path('api/scholarships/', views.get_scholarships, name='get-scholarships'),
    path('api/courses/', views.get_courses, name='get-courses'),
    path('universities/<slug:slug>/', TemplateView.as_view(template_name='university-detail.html'), name='university-detail'),
    path('universities/<slug:slug>/courses/', views.university_courses, name='university-courses'),
    path('scholarships/', TemplateView.as_view(template_name='scholarships.html'), name='scholarships'),
    path('favorites/', TemplateView.as_view(template_name='favorites.html'), name='favorites'),
    path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
    path('privacy/', TemplateView.as_view(template_name='privacy.html'), name='privacy'),
    path('terms/', TemplateView.as_view(template_name='terms.html'), name='terms'),
    path('faq/', TemplateView.as_view(template_name='faq.html'), name='faq'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
