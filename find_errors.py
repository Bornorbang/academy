import csv

print("Checking courses.csv for problematic rows...\n")

with open('data/courses.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
print(f"Total lines: {len(lines)}\n")
print("Rows where title contains unquoted commas:\n")

problematic = []
for i, line in enumerate(lines[1:], start=2):  # Skip header, start from line 2
    parts = line.strip().split(',')
    # Should have exactly 13 columns
    if len(parts) > 13:
        # Extract what we can identify
        course_id = parts[0] if len(parts) > 0 else "?"
        university_id = parts[1] if len(parts) > 1 else "?"
        # Title likely has commas - show first few parts
        title_preview = ','.join(parts[3:min(6, len(parts))])
        problematic.append((i, course_id, title_preview))
        
print(f"Found {len(problematic)} problematic rows:\n")

for line_num, cid, title in problematic[:100]:  # Show first 100
    print(f"Line {line_num}: {cid} - {title[:80]}")
