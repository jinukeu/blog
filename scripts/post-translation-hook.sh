#!/bin/bash
# Post-translation hook for Claude Code
# Triggers when a Korean blog post is written/edited
# Outputs translation instructions for Claude to follow

# Read tool result from stdin
INPUT=$(cat)

# Extract the file path from the tool result
FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed 's/"file_path"\s*:\s*"//;s/"$//')

# If no file_path found, try alternate patterns
if [ -z "$FILE_PATH" ]; then
  FILE_PATH=$(echo "$INPUT" | grep -oE '/[^ "]*\.md' | head -1)
fi

# Guard 1: Not a .md file → exit
if [[ ! "$FILE_PATH" =~ \.md$ ]]; then
  exit 0
fi

# Guard 2: Not in posts/ directory → exit
if [[ ! "$FILE_PATH" =~ /posts/ ]]; then
  exit 0
fi

# Guard 3: Already a translation file (posts/en/ or posts/ja/) → exit
if [[ "$FILE_PATH" =~ /posts/en/ ]] || [[ "$FILE_PATH" =~ /posts/ja/ ]]; then
  exit 0
fi

# Guard 4: Draft file → exit
if [[ "$FILE_PATH" =~ /drafts/ ]]; then
  exit 0
fi

# Guard 5: Timestamp lockfile (prevent re-trigger within 30 seconds)
LOCKDIR="/tmp/blog-translation-locks"
mkdir -p "$LOCKDIR"
FILENAME=$(basename "$FILE_PATH")
LOCKFILE="$LOCKDIR/$FILENAME.lock"

if [ -f "$LOCKFILE" ]; then
  LOCK_TIME=$(cat "$LOCKFILE")
  CURRENT_TIME=$(date +%s)
  DIFF=$((CURRENT_TIME - LOCK_TIME))
  if [ "$DIFF" -lt 30 ]; then
    exit 0
  fi
fi

# Set lockfile
date +%s > "$LOCKFILE"

# All guards passed — output translation instructions
echo "A Korean blog post was modified: $FILE_PATH"
echo "Please create/update translations for this post:"
echo "1. Read the Korean original at $FILE_PATH"
echo "2. Create English translation at posts/en/$FILENAME (preserve slug)"
echo "3. Create Japanese translation at posts/ja/$FILENAME (preserve slug)"
echo "4. For each translation:"
echo "   - Translate title, excerpt, and content naturally"
echo "   - Add 'lang: en' or 'lang: ja' to frontmatter"
echo "   - Generate localized SEO fields (seoTitle, seoDescription, seoKeywords)"
echo "   - Generate localized GEO fields (summary, keyTakeaways)"
echo "   - Preserve all markdown formatting, code blocks, and image paths"
echo "5. Also update/add SEO+GEO fields for the Korean original if missing"
