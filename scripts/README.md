# Repository Maintenance & Knowledge Scripts

## Overview
Utility scripts for repository-wide documentation validation, Open Knowledge Format (OKF) frontmatter compliance, and code dependency knowledge graph extraction via Graphify.

## Interface
- [`make_okf_compliant.py`](make_okf_compliant.py):
  - Injects standard OKF YAML frontmatter (`id`, `title`, `type`, `status`, `version`, `tags`) into legacy or untracked documentation files across `docs/` and repository root.
  - Configuration map: `METADATA_MAP` defines pre-configured metadata for key files.
- [`validate_okf.py`](validate_okf.py):
  - Validates markdown documentation files against OKF constraints.
  - Constants: `VALID_TYPES` defines allowed schema types (`ProjectMemory`, `DeveloperGuidelines`, `Runbook`, `DataSpecification`, `PlatformSpecification`, `ArchitectureDecisionRecord`, `TechnicalReport`).
  - Functions: `validate_file(file_path)`, `check_directory(dir_path)`.
- [`update-graphify-code.ps1`](update-graphify-code.ps1):
  - PowerShell automation script updating code dependency graphs in `graphify-out/code` with optional `-Force` and `-NoCluster` flags.

## Invariants
- `validate_okf.py` requires all markdown files under `docs/` to declare valid YAML frontmatter matching `VALID_TYPES`.
- Frontmatter modifications must preserve existing markdown content and maintain strict UTF-8 file encoding.

## Side Effects
- Rewrites markdown files in-place when applying frontmatter with `make_okf_compliant.py`.
- Generates or updates knowledge graph visualizer assets in `graphify-out/code/`.

## Verification
- Run: `python scripts/validate_okf.py` or `npm run graphify:code:update`
