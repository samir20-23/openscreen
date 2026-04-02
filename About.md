# OpenScreen - Features & Tools

OpenScreen is a powerful screen recorder and video editor built with Electron and React. It provides a seamless workflow from capturing your screen to polished video exports.

## 🎥 Recording Interface (Launch Window)

The recording interface is a compact, floating HUD designed to get you recording quickly with the right settings.

### Recording Controls
- **Record / Stop Button**: Start and stop your recording session.
- **Elapsed Time**: Real-time display of recording duration.
- **Restart Recording**: Quickly discard the current recording and start over.
- **Source Selector**: Choose between recording your entire screen or specific application windows.

### Audio & Video Inputs
- **System Audio**: Toggle capturing internal computer sounds.
- **Microphone**: Toggle microphone input. When enabled, a **Mic Panel** appears:
  - **Device Selector**: Choose from your connected microphones.
  - **Audio Level Meter**: Visual feedback of your microphone's volume.
- **Webcam**: Toggle your webcam overlay. Support for **Picture-in-Picture** and **Vertical Stack** layouts.

### Additional Tools
- **Open Video File**: Import an existing video (`.mp4`, etc.) directly into the editor.
- **Open Project**: Load a previously saved OpenScreen project (`.json`).
- **Language Switcher**: Support for multiple languages (English, Spanish, Chinese, etc.).
- **Window Controls**: Minimize the HUD or close the application.

---

## 🎬 Video Editor

Once a recording is finished or a video is imported, you enter the powerful editor where you can refine your content.

### Timeline Features
The timeline is the heart of the editor, allowing you to add various "Regions" to your video:
- **Zoom Regions**: Focus on specific parts of the screen. You can add, resize, and position zoom areas.
- **Trim Regions**: Cut out unwanted sections of your video.
- **Speed Regions**: Change playback speed for specific segments (0.25× to 4×).
- **Annotation Regions**: Add text, images, or figures (rectangles, circles, arrows) to highlight information.
- **Audio Tracks**: Add background music or additional audio tracks with volume control.
- **Cursor Telemetry**: High-quality cursor tracking for smooth zoom and highlight effects.

### Settings & Effects Panel
Fine-tune the appearance of your video with professional effects:
- **Visual Styles**:Y
  - **Shadow Intensity**: Add depth to your video frame.
  - **Blur Background**: Blur the area outside the main video content.
  - **Motion Blur**: Smooth out movements for a professional look.
  - **Border Radius (Roundness)**: Give your video soft, rounded corners.
  - **Padding**: Adjust the space between the video and the background.
- **Crop Tool**: Crop your video to specific aspect ratios:
  - Free (Manual), 16:9, 9:16 (Portrait), 4:3, 1:1 (Square), 21:9.
- **Backgrounds**:
  - **Wallpapers**: Choose from built-in high-quality images.
  - **Custom Images**: Upload your own JPG/JPEG backgrounds.
  - **Solid Colors**: Pick any color from a palette.
  - **Gradients**: Select from various beautiful linear and radial gradients.

### Playback & Editing Tools
- **Playback Controls**: Play, pause, and seek through the video.
- **Fullscreen Mode**: Preview your edit in full screen.
- **Undo / Redo**: Easily correct mistakes with `Ctrl+Z` and `Ctrl+Y`.
- **Project Persistence**: Save your entire editing session as a project file to resume later.
- **Keyboard Shortcuts**: Efficiently edit with dedicated shortcuts.

---

## 📤 Export Options

Export your final creation in the format that best fits your needs.

### Video Export (MP4)
- **Quality Presets**:
  - **Low (Medium)**: 720p resolution.
  - **Medium (Good)**: 1080p resolution.
  - **High (Source)**: Original resolution with high bitrate.

### GIF Export
- **Size Presets**: Small, Medium, Large, or Original.
- **Frame Rate**: Choose between 10, 12, 15, or 24 FPS.
- **Looping**: Toggle whether the GIF repeats infinitely.

---

## 🌍 General Features
- **Internationalization (i18n)**: Fully localized interface.
- **Cross-Platform**: Designed for Windows, macOS, and Linux.
- **Dark Mode**: Sleek, modern interface that's easy on the eyes.
