import csv

print("Checking courses.csv structure...\n")

with open('data/courses.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    headers = reader.fieldnames
    
    print(f"Headers found: {len(headers)} columns")
    print(f"Headers: {headers}\n")
    
    print("Checking first 5 rows for correct parsing:\n")
    
    for i, row in enumerate(reader, start=1):
        # Check if all expected keys exist
        missing_keys = []
        for key in ['course_id', 'university_id', 'subject_code', 'title', 'level', 'start_year']:
            if key not in row:
                missing_keys.append(key)
        
        # Check if start_year is numeric
        start_year = row.get('start_year', '')
        if start_year and not start_year.isdigit():
            print(f"❌ Row {i+1} (course_id: {row.get('course_id', 'N/A')}): start_year='{start_year}' (should be number)")
            print(f"   level='{row.get('level', 'N/A')}'")
            print(f"   title='{row.get('title', 'N/A')[:60]}...'")
            print()
            
        if missing_keys:
            print(f"❌ Row {i+1}: Missing keys: {missing_keys}")
            
        if i >= 10:
            break
    
    print("\n" + "="*80)
    print("Scanning entire file for problematic rows...")
    print("="*80 + "\n")
    
    f.seek(0)
    reader = csv.DictReader(f)
    next(reader)  # skip to first data row
    
    problems = []
    for i, row in enumerate(reader, start=1):
        start_year = row.get('start_year', '')
        if start_year and not start_year.isdigit():
            problems.append((i+1, row.get('course_id', 'N/A'), start_year, row.get('level', 'N/A')))
    
    if problems:
        print(f"Found {len(problems)} rows with non-numeric start_year:\n")
        for line_num, cid, sy, level in problems[:50]:
            print(f"Line {line_num}: {cid} - start_year='{sy}', level='{level}'")
    else:
        print("✅ All rows have numeric start_year values!")
