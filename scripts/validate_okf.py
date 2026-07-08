import os
import re
import sys
import yaml

# Configure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Allowed document types under OKF
VALID_TYPES = {
    "ProjectMemory",
    "DeveloperGuidelines",
    "Runbook",
    "DataSpecification",
    "PlatformSpecification",
    "ReferenceRegister",
    "ChapterPack",
    "QAStyleChecklist"
}

def parse_frontmatter(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Match YAML frontmatter between ---
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not match:
        return None, "Missing frontmatter block delimited by '---'"
    
    frontmatter_text = match.group(1)
    try:
        data = yaml.safe_load(frontmatter_text)
        return data, None
    except yaml.YAMLError as e:
        return None, f"YAML syntax error: {e}"

def validate_file(file_path):
    errors = []
    warnings = []
    
    data, parse_err = parse_frontmatter(file_path)
    if parse_err:
        errors.append(parse_err)
        return False, errors, warnings
        
    if not data or not isinstance(data, dict):
        errors.append("Frontmatter is empty or not a valid dictionary")
        return False, errors, warnings
        
    # Required field: type
    if "type" not in data:
        errors.append("Missing required field 'type'")
    elif not data["type"] or not isinstance(data["type"], str):
        errors.append("Field 'type' must be a non-empty string")
        
    # Recommended fields
    recommended_fields = ["title", "description", "tags", "timestamp"]
    for field in recommended_fields:
        if field not in data:
            warnings.append(f"Missing recommended field '{field}'")
            
    # Additional checks
    if "tags" in data and not isinstance(data["tags"], list):
        errors.append("Field 'tags' must be a list of strings")
        
    if errors:
        return False, errors, warnings
    return True, errors, warnings

def main():
    print("Checking repository files for Google Open Knowledge Format (OKF) compliance...")
    print("=" * 80)
    
    files_to_check = []
    
    # Add files from root
    ROOT_FILES = [r"AGENTS.md"]
    for f in ROOT_FILES:
        if os.path.exists(f):
            files_to_check.append(f)
            
    # Add docs recursively, but filter out powers / plans / specs
    DOCS_DIR = r"docs"
    for root, dirs, files in os.walk(DOCS_DIR):
        # Exclude superpowers and subdirectories under it
        if "superpowers" in root:
            continue
            
        for f in files:
            if f.endswith(".md"):
                full_path = os.path.join(root, f)
                # Filter out content/ unless it is mathematics chapter-pack.md
                if "content" in root:
                    if "mathematics" in root and f == "chapter-pack.md":
                        files_to_check.append(full_path)
                else:
                    files_to_check.append(full_path)
                
    success_count = 0
    failure_count = 0
    total_files = len(files_to_check)
    
    for file_path in sorted(files_to_check):
        is_ok, errors, warnings = validate_file(file_path)
        rel_path = os.path.relpath(file_path) # simplify printing
        
        if is_ok:
            success_count += 1
            if warnings:
                print(f"[WARN] {rel_path}")
                for w in warnings:
                    print(f"  - {w}")
            else:
                print(f"[OK]   {rel_path}")
        else:
            failure_count += 1
            print(f"[FAIL] {rel_path}")
            for err in errors:
                print(f"  - ERROR: {err}")
            for w in warnings:
                print(f"  - WARNING: {w}")
        print("-" * 50)
        
    print("\nOKF Validation Summary:")
    print(f"Total checked: {total_files}")
    print(f"Passed:        {success_count}")
    print(f"Failed:        {failure_count}")
    
    if failure_count > 0:
        print("\nResult: OKF validation FAILED.")
        sys.exit(1)
    else:
        print("\nResult: OKF validation PASSED.")
        sys.exit(0)

if __name__ == "__main__":
    main()
