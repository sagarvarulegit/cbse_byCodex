import os
import re
import sys
import yaml

# Configure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Metadata maps for files without frontmatter
METADATA_MAP = {
    "AGENTS.md": {
        "type": "DeveloperGuidelines",
        "title": "Agent Operating Rules",
        "description": "Repository guidelines, coding styles, testing, and operation instructions for agentic coding.",
        "tags": ["agents", "guidelines", "rules"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/TODO.md": {
        "type": "ReferenceRegister",
        "title": "Project Backlog and TODOs",
        "description": "Current project backlog, task list, and completed items for the CBSE learning portal.",
        "tags": ["todo", "backlog", "tasklist"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/codex-quota-playbook.md": {
        "type": "Runbook",
        "title": "Codex Quota Management Playbook",
        "description": "Guide to optimizing tokens, caching, and handling API quota limitations during agent runs.",
        "tags": ["codex", "quota", "playbook"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/content-style-qa-checklist.md": {
        "type": "QAStyleChecklist",
        "title": "Content Style QA Checklist",
        "description": "Quality assurance checklist for content style, readability, examples, board tips, common mistakes, and quiz structure.",
        "tags": ["qa", "content", "checklist"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/curriculum/annual-refresh-runbook.md": {
        "type": "Runbook",
        "title": "Annual Refresh Runbook",
        "description": "Instructions for checking, reviewing, and updating subject blueprints and curriculum metadata.",
        "tags": ["curriculum", "refresh", "annual"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/curriculum/official-source-register.md": {
        "type": "ReferenceRegister",
        "title": "Official Source Register",
        "description": "Reference materials, curriculum blueprints, and official sources for Class 10 subjects.",
        "tags": ["curriculum", "sources", "cbse"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/data-model.md": {
        "type": "DataSpecification",
        "title": "Database Schema and Data Models",
        "description": "Prisma schemas, entities (Subject, Chapter, Lesson, ProgressEvent, Quiz), and relationships.",
        "tags": ["database", "schema", "prisma"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/deployment.md": {
        "type": "Runbook",
        "title": "Deployment Guide",
        "description": "Steps and guidelines for deploying the web, admin, and API apps to Vercel and production databases.",
        "tags": ["deployment", "vercel", "database"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/mvp-requirements.md": {
        "type": "ReferenceRegister",
        "title": "MVP Requirements",
        "description": "Minimum Viable Product requirements for catalog, video, notes, progress, and administrative pilot reviews.",
        "tags": ["mvp", "requirements", "scope"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/pilot-qa-checklist.md": {
        "type": "QAStyleChecklist",
        "title": "Pilot QA Checklist",
        "description": "Verification list for lesson videos, notes rendering, quiz attempts, and streaks before launching the student pilot.",
        "tags": ["qa", "pilot", "checklist"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/pilot-smoke-checklist.md": {
        "type": "Runbook",
        "title": "Pilot Smoke Test Runbook",
        "description": "Step-by-step smoke tests for verification of localized API routes, Vercel deployments, engagement logging, and feedback.",
        "tags": ["smoke-test", "pilot", "runbook"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/product-blueprint.md": {
        "type": "ReferenceRegister",
        "title": "Product Blueprint",
        "description": "Platform specification for the CBSE learning portal, outlining catalog, engagement, and gamification milestones.",
        "tags": ["product", "blueprint", "roadmap"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/project-memory.md": {
        "type": "ProjectMemory",
        "title": "Project Memory",
        "description": "Durable project learnings, architectural choices, and context for CBSE learning portal.",
        "tags": ["architecture", "memory", "onboarding"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/scaffold.md": {
        "type": "Runbook",
        "title": "Scaffolding Guidelines",
        "description": "Best practices for scaffolding files, routes, and components.",
        "tags": ["scaffold", "setup", "workspace"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/skillopt-sleep.md": {
        "type": "Runbook",
        "title": "Skill Optimization and Idle Control",
        "description": "Guide on executing background tasks, timer conditions, and managing agent sleep cycles.",
        "tags": ["agent", "execution", "scheduling"],
        "timestamp": "2026-07-08T12:00:00Z"
    },
    "docs/video-platform.md": {
        "type": "PlatformSpecification",
        "title": "Video Delivery and Bunny Stream Platform",
        "description": "Integration details and guidelines for using Bunny Stream for master MP4 archives and HLS delivery.",
        "tags": ["video", "bunny-stream", "hls"],
        "timestamp": "2026-07-08T12:00:00Z"
    }
}

def make_file_compliant(file_path):
    # Normalize path keys for dictionary lookup
    norm_key = file_path.replace("\\", "/")
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Check if file has existing frontmatter
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    
    if fm_match:
        # Existing frontmatter: parse, add/update fields, and re-write
        fm_text = fm_match.group(1)
        body = content[fm_match.end():]
        try:
            data = yaml.safe_load(fm_text) or {}
            
            # Update type if not set
            if "type" not in data:
                # Chapter packs should be typed as ChapterPack
                if "chapter-pack.md" in norm_key:
                    data["type"] = "ChapterPack"
                else:
                    data["type"] = "Article"
                    
            # Ensure title is present
            if "title" not in data:
                data["title"] = os.path.basename(file_path).replace("-", " ").replace(".md", "").title()
                
            # Ensure description is present
            if "description" not in data:
                data["description"] = f"Class 10 CBSE notes for {data.get('title', 'subject')}."
                
            # Ensure tags are present
            if "tags" not in data:
                data["tags"] = ["cbse", "class-10", data.get("chapter_slug", "notes")]
                
            # Ensure timestamp is present
            if "timestamp" not in data:
                data["timestamp"] = "2026-07-08T12:00:00Z"
                
            # Build new frontmatter block
            # Dump with custom dumper to keep it clean and neat
            new_fm = yaml.dump(data, default_flow_style=False, sort_keys=False).strip()
            
            # Write back
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(f"---\n{new_fm}\n---\n{body}")
            print(f"[UPDATED] {file_path}")
            return True
        except Exception as e:
            print(f"[ERROR parsing] {file_path}: {e}")
            return False
    else:
        # No frontmatter: lookup metadata map
        if norm_key in METADATA_MAP:
            meta = METADATA_MAP[norm_key]
            # Build YAML block
            fm_lines = [
                "---",
                f"type: {meta['type']}",
                f"title: {meta['title']}",
                f"description: {meta['description']}",
                f"tags: {meta['tags']}",
                f"timestamp: {meta['timestamp']}",
                "---"
            ]
            new_fm_block = "\n".join(fm_lines) + "\n\n"
            
            # Write back
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_fm_block + content)
            print(f"[ADDED FM] {file_path}")
            return True
        else:
            print(f"[SKIP] No predefined metadata for: {file_path}")
            return False

def main():
    print("Upgrading files to Google Open Knowledge Format (OKF) compliance...")
    print("=" * 80)
    
    # 1. Update root files
    ROOT_FILES = ["AGENTS.md"]
    for f in ROOT_FILES:
        if os.path.exists(f):
            make_file_compliant(f)
            
    # 2. Update docs files recursively
    DOCS_DIR = "docs"
    for root, dirs, files in os.walk(DOCS_DIR):
        if "superpowers" in root:
            continue
        for f in files:
            if f.endswith(".md"):
                full_path = os.path.join(root, f)
                if "content" in root:
                    if "mathematics" in root and f == "chapter-pack.md":
                        make_file_compliant(full_path)
                else:
                    make_file_compliant(full_path)

if __name__ == "__main__":
    main()
