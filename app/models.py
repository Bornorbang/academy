from django.db import models

class University(models.Model):
    COUNTRY_CHOICES = (("UK", "United Kingdom"), ("IE", "Ireland"))

    university_id = models.CharField(max_length=20, unique=True, primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    country = models.CharField(max_length=2, choices=COUNTRY_CHOICES)
    city = models.CharField(max_length=100)
    overview = models.TextField()

    estimated_living_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    population = models.PositiveIntegerField(null=True, blank=True)

    admission_requirements = models.TextField(blank=True)
    acceptance_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    graduation_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    avg_ug_tuition = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    avg_pg_tuition = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    currency = models.CharField(max_length=3, default="GBP")
    
    ranking = models.IntegerField(null=True, blank=True)

    financial_aid = models.TextField(blank=True)
    website = models.URLField(blank=True)
    logo = models.URLField(blank=True)
    banner = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Universities"

    def __str__(self):
        return self.name

class Subject(models.Model):
    subject_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    LEVEL_CHOICES = (
        ("UG", "Undergraduate"),
        ("PG", "Postgraduate"),
        ("PGT", "Postgraduate"),
    )

    course_id = models.CharField(max_length=30, unique=True, primary_key=True)
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name="courses")
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True)

    title = models.CharField(max_length=255)
    level = models.CharField(max_length=3, choices=LEVEL_CHOICES)

    overview = models.TextField(blank=True)
    modules = models.TextField(blank=True)
    entry_requirements = models.TextField(blank=True)

    duration = models.CharField(max_length=50)
    location = models.CharField(max_length=255)

    start_year = models.IntegerField()
    start_month = models.CharField(max_length=20)

    is_active = models.BooleanField(default=True)
    ucas_cao_code = models.CharField(max_length=20, blank=True)
    work_placement = models.BooleanField(default=False)
    intake_months = models.CharField(max_length=100)

    course_url = models.URLField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.university.name})"

class Tuition(models.Model):
    RESIDENCY_CHOICES = (
        ("HOME", "Home"),
        ("EU", "EU"),
        ("INTL", "International"),
    )

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="tuitions"
    )
    residency = models.CharField(max_length=5, choices=RESIDENCY_CHOICES)

    tuition_fee = models.DecimalField(max_digits=10, decimal_places=2)
    scholarship = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    tuition_deposit = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    currency = models.CharField(max_length=10)

    @property
    def net_tuition_fee(self):
        return self.tuition_fee - self.scholarship

class UniversityRanking(models.Model):
    SOURCE_CHOICES = (
        ("CUG", "Complete University Guide"),
        ("QS", "Top Universities (QS)"),
    )

    university = models.ForeignKey(
        University, on_delete=models.CASCADE, related_name="rankings"
    )
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES)
    year = models.IntegerField()
    
    overall = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    world_ranking = models.IntegerField(null=True, blank=True)

    arts_humanities = models.IntegerField(null=True, blank=True)
    life_sciences = models.IntegerField(null=True, blank=True)
    engineering_technology = models.IntegerField(null=True, blank=True)
    natural_sciences = models.IntegerField(null=True, blank=True)
    social_sciences_management = models.IntegerField(null=True, blank=True)

    staff_student_ratio = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    international_students_ratio = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    graduate_prospects = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    student_satisfaction = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )

class Scholarship(models.Model):
    LEVEL_CHOICES = (
        ("UG", "Undergraduate"),
        ("PG", "Postgraduate"),
    )

    university = models.ForeignKey(
        University,
        on_delete=models.CASCADE,
        related_name="scholarships",
        null=True,
        blank=True
    )

    name = models.CharField(max_length=255)
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES)

    eligibility = models.TextField()
    award_type = models.CharField(max_length=100)
    award_value = models.CharField(max_length=50, blank=True)
    currency = models.CharField(max_length=3)

    deadline = models.DateField(null=True, blank=True)
    requirements = models.TextField(blank=True)
    description = models.TextField(blank=True)

    url = models.URLField(blank=True)


