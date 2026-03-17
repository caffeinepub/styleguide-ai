# StyleGuide AI

## Current State
New project. No existing frontend or backend.

## Requested Changes (Diff)

### Add
- Home Screen with a prominent "Scan My Face" CTA button
- Camera Screen using device camera to capture a selfie
- Result Screen displaying face shape, skin tone, and four style recommendations: glasses frames, hairstyles, clothing colors, shoe styles
- Backend endpoint to receive a captured image and return a style analysis result (face shape, skin tone, and recommendations)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select `camera` component for selfie capture
2. Generate Motoko backend with `analyzePhoto` endpoint that accepts image data and returns structured style analysis
3. Build three-screen React frontend:
   - HomeScreen: centered layout, large "Scan My Face" button
   - CameraScreen: live camera feed with capture button
   - ResultScreen: display analysis cards for face shape, skin tone, glasses, hairstyles, clothing colors, shoes
4. Wire camera capture to backend analysis call
5. Show results in clean card-based layout
