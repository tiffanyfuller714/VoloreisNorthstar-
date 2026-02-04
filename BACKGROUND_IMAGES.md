# Background Images Feature

## Overview
This feature adds scenic background images to different pages of the VOLOREIS application using the PageBackground and AppLayout components.

## Background Images

### Home Page
- **Theme:** Ocean sunset
- **Sizes:** LG (1920x1080), MD (1280x720), SM (640x360)
- **Source:** Unsplash

### Plans Page
- **Theme:** Mountains and clouds
- **Sizes:** LG (1920x1080), MD (1280x720), SM (640x360)
- **Source:** Unsplash

### Portal Page
- **Theme:** Beach sunset
- **Sizes:** LG (1920x1080), MD (1280x720), SM (640x360)
- **Source:** Unsplash

### Admin Page
- **Theme:** City skyline
- **Sizes:** LG (1920x1080), MD (1280x720), SM (640x360)
- **Source:** Unsplash

### Custom Portal
- **Theme:** Mountain landscape
- **Sizes:** LG (1920x1080), MD (1280x720), SM (640x360)
- **Source:** Unsplash

## Components

### PageBackground Component
- **Location:** `src/components/PageBackground.jsx`
- **Purpose:** Displays a background image based on the variant
- **Props:**
  - `variant`: 'home' | 'plans' | 'portal' | 'admin' | 'custom'

### AppLayout Component
- **Location:** `src/components/AppLayout.jsx`
- **Purpose:** Wraps content with appropriate background based on current route
- **Props:**
  - `children`: Child components to render
  - `variant` (optional): Explicit background variant

## Route Mapping

| Route | Background Variant |
|-------|-------------------|
| `/` | home |
| `/plans` | plans |
| `/portal/*` | portal |
| `/admin/*` | admin |
| `/checkout` | home |

## Image Storage

All images are stored in `public/images/{variant}/`:
- `LG.jpg` - Large version for desktop
- `MD.jpg` - Medium version for tablets
- `SM.jpg` - Small version for mobile

## Usage

The AppLayout is automatically integrated into the main router in `App.js`. Background images change automatically based on the current route.

### Manual Usage

```jsx
import AppLayout from './components/AppLayout';

function MyPage() {
  return (
    <AppLayout variant="custom">
      {/* Your content */}
    </AppLayout>
  );
}
```

## Adding New Background Images

1. Download and optimize images using `scripts/download-images.sh`
2. Place in `public/images/{variant}/`
3. Add variant mapping to `PageBackground.jsx`
4. Update route mapping in `AppLayout.jsx` if needed

## Download Script

Run `scripts/download-images.sh` to download and optimize all background images from Unsplash.