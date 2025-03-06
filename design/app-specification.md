---

*This specification serves as the foundation for design and development of the assistive communication application. Development will proceed incrementally according to the staged approach outlined above.*# Assistive Communication App Specification

## Project Overview

This specification defines a browser-based assistive communication application designed to help a person with neurological disabilities communicate effectively with the assistance of a caregiver. The application will be delivered as a single HTML file that works offline on an iPad and leverages touch capabilities.

### Target Users

1. **Primary User**: Person with neurological disability affecting movement and speech
2. **Secondary User**: Assisting caregiver who helps facilitate communication

### Key Objectives

- Provide multiple, flexible input methods to accommodate varying abilities
- Create a simple, efficient interface for the assisting user
- Minimize effort required from the disabled user
- Store preferences for consistent experience across sessions
- Ensure the app functions offline once loaded

## Core Features Specification

### 1. Keyboard Display Options

- **QWERTY Keyboard Layout**
  - Standard layout for letter pointing
  - Disabled user can point to letters (without selection)
  
- **Alternative Keyboard Layouts**
  - Option for different letter arrangements
  - Simple interface for the assisting user to create/select layouts
  
- **Common Word Buttons**
  - Quick-access buttons for frequently used words/phrases
  - Default set includes: "Yes", "No", "Wrong", etc.
  - Visible on all keyboard views
  - Customizable by the assisting user

### 2. Zoom Functionality

- **Size Adjustment**
  - Buttons to increase/decrease keyboard size
  - Accommodates different movement capabilities
  
- **Positioning**
  - Keyboard always docks to bottom of screen
  - Maintains position regardless of zoom level
  - Maximizes available space when assistant toolbar is collapsed
  
- **Persistence**
  - Zoom settings automatically remembered between sessions
  - Stored in local browser storage
  
- **Control Access**
  - Zoom controls only accessible to the assisting user
  - Positioned in the assisting user's control area
  - Still accessible when toolbar is expanded after being collapsed

### 3. Trackpad Mode

- **Activation**
  - Toggle button for assisting user to enable/disable
  - Visual indication when active
  
- **Positioning**
  - Trackpad docks to bottom of screen when enabled
  - Keyboard display positioned above the trackpad
  
- **Input Detection**
  - Detects intermittent taps as user moves across trackpad
  - No requirement for continuous dragging motion
  
- **Visual Feedback**
  - Highlights corresponding key/word on keyboard based on relative position
  - Clear visual indicator of current selection

### 4. Selection Methods

- **Selection Modes**
  - Toggle button to switch between:
    - Single-touch selection mode
    - Double-tap selection mode
  
- **Visual Feedback**
  - Highlighting of keys when touched in double-tap mode
  - Clear visual distinction between hover and selection states

### 5. Voice Dictation

- **Recording Interface**
  - Quick record button with press-and-hold activation
  - Audio cue (beep) when ready to record
  
- **Display**
  - Dictated words displayed in sentence box
  - Visual indication during recording
  
- **API Integration**
  - Integration with OpenAI API for speech recognition
  - Secure storage for API key
  - Architecture allows for future addition of other APIs

### 6. Word Prediction

- **Prediction Display**
  - Shows common words as letters are entered
  - Displayed in accessible location near input area
  
- **Selection Methods**
  - Double-tap selection of predicted words by assisting user
  - Auto-selection when prediction narrows to a single word
  
- **Prediction Algorithm**
  - Prioritizes common English words
  - Adapts based on frequently used words

### 7. Scanning Mode

- **Speed Control**
  - Adjustable scanning speeds for different user abilities
  - Simple interface for assisting user to adjust
  
- **Scanning Pattern**
  - Row-by-row scanning with tap to select row
  - Element-by-element scanning within selected row
  
- **Selection Process**
  - Tap to select highlighted row/item
  - Double-tap to confirm letter/word selection
  - Single tap to restart scanning when element is highlighted

### 8. Text Management

- **Word Completion**
  - Automatic space addition after word completion
  - Visual indication of completed words
  
- **Deletion Controls**
  - Delete button with dual function:
    - Delete entire word when a word is selected
    - Delete single letter when entering a word
  - Removes trailing space when deleting a word

### 9. Text-to-Speech

- **Activation**
  - Button for assisting user to trigger speech output
  - Option to speak individual words or complete sentences
  
- **Voice Options**
  - Selectable voices using built-in browser capabilities
  - Voice preference stored for future use
  
- **Language Support**
  - UK English language as default
  - Architecture to support additional languages in future

### 10. Interface Organization

- **Screen Layout**
  - Sentence display box between assisting user controls and keyboard
  - Assisting user controls at top of screen with ability to collapse/fold upward
  - Keyboard/trackpad at bottom of screen
  - Dynamic resizing of elements when assistant toolbar is collapsed
  
- **Visual Design**
  - Multiple theme options (Vibrant, Soft & Friendly, High Contrast, and Pastel)
  - Clear visual hierarchy
  - High contrast for visibility
  - Sufficient spacing between interactive elements

## Technical Considerations

### Single HTML File Implementation

1. **Resource Bundling Strategy**
   - All resources (JS, CSS, fonts, icons) must be embedded in the HTML file
   - Implement icons and UI elements as SVG or CSS rather than separate image files
   - Use data URIs for any essential graphics

2. **File Size Management**
   - Minify code while maintaining a non-minified version for development
   - Establish a simple build process to generate the minified version from source
   - Document inline code structure with clear section headers for maintainability

3. **Performance Considerations**
   - Build incrementally and check performance at each stage
   - If performance issues arise, consider these restructuring options:
     a. Code splitting with dynamic imports for on-demand feature loading
     b. Using Web Workers for parallel processing of computationally intensive tasks
     c. Implementing a progressive enhancement approach where advanced features are optional

4. **Error Recovery**
   - Implement unobtrusive error handling that returns to last stable state
   - Display a simple round red icon in corner of screen when errors occur
   - For API-dependent features like dictation, provide retry options
   - Log errors in console with descriptive messages for debugging
   - Maintain state of current text input even during errors

5. **Browser Compatibility**
   - Primary development targeting modern browsers (Chrome, Safari)
   - Test regularly on iPad Safari
   - Document any iPad-specific workarounds needed

6. **Local Storage Approach**
   - Use localStorage for settings, preferences, and layouts
   - Implement fallback for browsers with localStorage disabled
   - Add clear error handling for storage quota exceeded

7. **Non-Touch Navigation Support**
   - Implement keyboard navigation for testing on non-touch devices
   - Support mouse interaction as alternative to touch
   - Ensure all interactive elements have keyboard focus states
   - Map specific keys to application functions for testing

8. **Build and Deployment Process**
   - Maintain development version with readable formatting and comments
   - Create minification process that preserves important comments
   - Document step-by-step deployment instructions for iPad
   - Include version information in code comments and UI

## Accessibility Considerations

- **Visual Design**:
  - High contrast options
  - Clear, readable typography
  - Sufficient sizing of all elements
  
- **Interaction Design**:
  - Large touch targets
  - Adjustable timing for scanning mode
  - Alternatives for various motor capabilities

## Future Expansion Considerations

The application architecture should allow for future additions:

- Additional language support
- Alternative dictation APIs
- Expanded word prediction capabilities
- Integration with messaging/communication platforms
- Expanded customization options
- Custom color selection for individual UI elements
- User-defined theme creation and saving
- Enhanced API security with proxy service
- First-time setup wizard and onboarding experience
- Update management and version checking
- Progressive web app conversion for offline installation
- Cross-platform adaptations (Android, desktop)

## Implementation Priorities

1. Core keyboard and selection mechanisms
   - QWERTY keyboard layout with sentence display
   - Basic word buttons (Yes, No, Wrong)
   - Zoom functionality

2. Scanning mode implementation

3. Word prediction functionality

4. Voice dictation and text-to-speech

5. Preference storage and retrieval

6. UI refinements and customization options

## Development Approach

The application will be built incrementally in stages:

### Stage 1: Basic Communication Interface
- Single QWERTY keyboard display
- Basic zoom functionality
- Bottom row of common response buttons (Yes, No, Wrong)
- Sentence display area
- Assistant controls for basic functions

### Stage 2: Input Methods
- Trackpad mode
- Double-tap selection
- Delete functionality (word/character)

### Stage 3: Scanning and Prediction
- Scanning mode with configurable speeds
- Word prediction as letters are entered
- Additional common words

### Stage 4: Advanced Features
- Voice dictation integration
- Settings panel with theme options
- Layout switcher
- Additional customization options
