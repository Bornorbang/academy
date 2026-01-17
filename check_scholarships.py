import csv

print("Checking scholarships.csv for problematic deadline values...\n")

problems = []

with open('data/scholarships.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    headers = reader.fieldnames
    
    print(f"CSV Headers ({len(headers)} columns): {headers}\n")
    print("="*80 + "\n")
    
    for i, row in enumerate(reader, start=1):
        deadline = row.get('deadline', '').strip()
        
        # Check if deadline contains currency codes or other invalid values
        if deadline:
            # Check for currency codes
            if deadline.upper() in ['EUR', 'GBP', 'USD']:
                problems.append((i+1, row.get('scholarship_id', 'N/A'), row.get('name', 'N/A'), deadline, 'Currency code in deadline'))
            # Check for non-date strings (no digits at all)
            elif not any(c.isdigit() for c in deadline):
                problems.append((i+1, row.get('scholarship_id', 'N/A'), row.get('name', 'N/A'), deadline, 'No digits in deadline'))

if problems:
    print(f"Found {len(problems)} rows with invalid deadline values:\n")
    for line_num, sid, name, deadline, reason in problems:
        print(f"Line {line_num}: {sid}")
        print(f"  Name: {name[:60]}")
        print(f"  Deadline: \"{deadline}\"")
        print(f"  Issue: {reason}\n")
else:
    print("✅ All deadline values are valid or empty!")
