import csv
import re
from datetime import datetime

print("Converting date formats in scholarships.csv...\n")

# Read the CSV
rows = []
with open('data/scholarships.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    headers = reader.fieldnames
    
    for row in reader:
        deadline = row.get('deadline', '').strip()
        
        if deadline:
            # Try to match M/D/YYYY or MM/DD/YYYY format
            match = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', deadline)
            if match:
                month, day, year = match.groups()
                # Convert to YYYY-MM-DD
                new_deadline = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                print(f"Converting: {deadline} → {new_deadline}")
                row['deadline'] = new_deadline
        
        rows.append(row)

# Write back to CSV
with open('data/scholarships.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)

print(f"\n✅ Updated scholarships.csv with {len(rows)} rows")
