#!/bin/bash

# VOLOREIS Background Images Download Script
# Downloads scenic images from Unsplash and creates optimized variants

set -e

echo "🎨 Downloading and optimizing background images for VOLOREIS..."

# Create public/images directory
mkdir -p public/images/{home,plans,portal,admin,custom}

# Image URLs from Unsplash (high-quality scenic images)
declare -A IMAGES=(
  ["home"]="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80"
  ["plans"]="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
  ["portal"]="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
  ["admin"]="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
  ["custom"]="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
)

# Download and create variants for each image
for CATEGORY in "${!IMAGES[@]}"; do
  URL="${IMAGES[$CATEGORY]}"
  echo "📥 Processing $CATEGORY image..."
  
  # Download original
  curl -s -L "$URL" -o "public/images/${CATEGORY}/original.jpg"
  
  # Create variants using ImageMagick (if available)
  if command -v convert &> /dev/null; then
    # Large variant (1920x1080)
    convert "public/images/${CATEGORY}/original.jpg" -resize 1920x1080 -quality 85 "public/images/${CATEGORY}/LG.jpg"
    cwebp -q 85 "public/images/${CATEGORY}/LG.jpg" -o "public/images/${CATEGORY}/LG.webp" 2>/dev/null || true
    
    # Medium variant (1280x720)
    convert "public/images/${CATEGORY}/original.jpg" -resize 1280x720 -quality 85 "public/images/${CATEGORY}/MD.jpg"
    cwebp -q 85 "public/images/${CATEGORY}/MD.jpg" -o "public/images/${CATEGORY}/MD.webp" 2>/dev/null || true
    
    # Small variant (640x360)
    convert "public/images/${CATEGORY}/original.jpg" -resize 640x360 -quality 85 "public/images/${CATEGORY}/SM.jpg"
    cwebp -q 85 "public/images/${CATEGORY}/SM.jpg" -o "public/images/${CATEGORY}/SM.webp" 2>/dev/null || true
  else
    # If ImageMagick not available, just copy the original
    cp "public/images/${CATEGORY}/original.jpg" "public/images/${CATEGORY}/LG.jpg"
    cp "public/images/${CATEGORY}/original.jpg" "public/images/${CATEGORY}/MD.jpg"
    cp "public/images/${CATEGORY}/original.jpg" "public/images/${CATEGORY}/SM.jpg"
  fi
  
  # Clean up original
  rm "public/images/${CATEGORY}/original.jpg"
  
  echo "✅ $CATEGORY variants created"
done

echo ""
echo "🎉 All background images downloaded and optimized!"
echo ""
ls -lh public/images/*/