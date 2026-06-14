# Exam Mode Context

## Purpose
Exam mode lets instructors upload files that are later opened by students using a direct URL path.

## Current Behavior
- Exam files are stored under the `exam-files` folder in Supabase storage.
- Opening `/{filename}` in the app attempts to find a matching file and render it in the code viewer.
- Files are filtered to only allow items that live in `exam-files/`.

## Tabs (Multi-User Buckets)
Exam mode now uses four tabs to separate uploads into subfolders:
- Group A -> `exam-files` (legacy root for backward compatibility)
- Group B -> `exam-files/group-b`
- Group C -> `exam-files/group-c`
- Group D -> `exam-files/group-d`

Switching tabs changes:
- The upload destination folder.
- The file list shown in exam mode.
- Delete All behavior (only affects the active tab).

## Completed Improvements
- URL routing to include tab/group info for precise access (e.g., `/b/file.java`).
- Disambiguation UI when multiple groups have files with the same name (prompts user to select their group).
- Support for inline PDF viewing (dynamically detects `.pdf` files and renders them via object URLs in an `iframe` instead of the Monaco Editor, while hiding text-specific UI like Zoom and Copy).

## Pending / Future Improvements
- Optional admin UI to rename tabs and manage groups.

## UI Status
- Files, Code Editor, and Assignments sections are currently hidden to keep focus on Exam Mode.
- These sections can be re-enabled later when needed.
