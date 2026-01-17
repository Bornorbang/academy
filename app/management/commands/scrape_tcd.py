from django.core.management.base import BaseCommand
import requests
from bs4 import BeautifulSoup

from app.models import University, Course  # ✅ FIXED

BASE_URL = "https://www.tcd.ie"
SEARCH_URL = "https://www.tcd.ie/courses/search/"


class Command(BaseCommand):
    help = "Scrape Trinity College Dublin undergraduate courses"

    def handle(self, *args, **options):
        self.stdout.write("Starting TCD undergraduate scrape...")

        university, _ = University.objects.get_or_create(
            name="Trinity College Dublin",
            defaults={
                "slug": "trinity-college-dublin",
                "country": "IE",
                "city": "Dublin",
                "overview": "Trinity College Dublin",
                "website": "https://www.tcd.ie",
            },
        )

        page = 1
        total_created = 0

        while True:
            self.stdout.write(f"Scraping page {page}")

            params = {
                "type": "undergraduate",
                "page": page,
            }

            resp = requests.get(SEARCH_URL, params=params, timeout=20)
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "html.parser")
            course_blocks = soup.select(".course-listing-result")

            if not course_blocks:
                break

            for block in course_blocks:
                title_link = block.select_one(".course-title a")
                if not title_link:
                    continue

                title = title_link.get_text(strip=True)
                course_url = BASE_URL + title_link["href"]

                spans = block.select(".course-details span")
                duration = spans[0].get_text(strip=True) if spans else ""

                Course.objects.get_or_create(
                    university=university,
                    title=title,
                    defaults={
                        "level": "UG",
                        "duration": duration,
                        "location": "Dublin",
                        "start_year": 2026,
                        "course_url": course_url,
                    },
                )
                total_created += 1

            page += 1

        self.stdout.write(
            self.style.SUCCESS(f"Done. Courses processed: {total_created}")
        )
