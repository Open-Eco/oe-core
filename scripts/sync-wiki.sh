#!/bin/bash
# Sync wiki files to the GitHub wiki repository

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WIKI_DIR="$REPO_ROOT/wiki"
TEMP_WIKI="/tmp/oe-core-wiki-sync"

echo "🌐 OpenEco Wiki Sync Script"
echo "============================"
echo ""

# Check if wiki directory exists
if [ ! -d "$WIKI_DIR" ]; then
    echo "❌ Error: wiki directory not found at $WIKI_DIR"
    exit 1
fi

# Count files to sync
FILE_COUNT=$(find "$WIKI_DIR" -name "*.md" -not -name "README.md" | wc -l)
echo "📄 Found $FILE_COUNT markdown files to sync"
echo ""

# Clone the wiki repository
echo "📥 Cloning wiki repository..."
rm -rf "$TEMP_WIKI"
if ! git clone https://github.com/Open-Eco/oe-core.wiki.git "$TEMP_WIKI"; then
    echo "❌ Error: Failed to clone wiki repository"
    echo "   Make sure you have access to the repository"
    exit 1
fi

# Copy files (excluding README.md from wiki directory)
echo "📋 Copying files..."
find "$WIKI_DIR" -name "*.md" -not -name "README.md" -exec cp {} "$TEMP_WIKI/" \;

# Check if there are changes
cd "$TEMP_WIKI"
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ No changes to sync - wiki is already up to date"
    rm -rf "$TEMP_WIKI"
    exit 0
fi

echo ""
echo "📝 Changes to be synced:"
git status --short
echo ""

# Commit changes
echo "💾 Committing changes..."
git add -A
git commit -m "Sync documentation from oe-core repository

Updated documentation files from the main repository to keep wiki in sync.
Synced $(date -u +"%Y-%m-%d %H:%M:%S UTC")"

# Push changes
echo "🚀 Pushing to wiki..."
if git push origin master; then
    echo ""
    echo "✅ Wiki sync completed successfully!"
    echo "   View at: https://github.com/Open-Eco/oe-core/wiki"
else
    echo ""
    echo "❌ Error: Failed to push changes"
    echo "   You may need to configure git credentials"
    exit 1
fi

# Cleanup
rm -rf "$TEMP_WIKI"
