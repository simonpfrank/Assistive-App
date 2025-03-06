# Visual Design Document for Assistive Communication App

## Overview

This document outlines the visual design approach for the assistive communication app designed to help a person with neurological disabilities communicate effectively with the assistance of a caregiver. The design prioritizes accessibility, clear visual hierarchy, and easy interaction for both the primary user with limited mobility and the assisting caregiver.

## Design Philosophy

The interface is designed with these key principles:
- **Clarity:** Clear visual distinction between interactive elements
- **Accessibility:** Large touch targets and high contrast options
- **Flexibility:** Multiple input methods to accommodate different abilities
- **Efficiency:** Quick access to commonly used functions
- **Consistency:** Predictable layout across different modes

## Color Palette

### Primary Colors
- Background: Light gray (#f0f0f0) - Neutral, easy on the eyes
- Keyboard background: Slightly darker gray (#e6e6e6) - Creates subtle separation
- Keys/Buttons: White (#ffffff) - High contrast against backgrounds
- Text: Dark gray (#444444) - Good readability without harsh black

### Accent Colors
- Active/Selected elements: Blue (#4488ff) - Clear visual indicator
- Highlighted elements: Light blue (#d8e8ff) - Subtle distinction
- Recording/Alert: Red (#ff4444) - Clear signal for active recording

### Semantic Colors for Common Word Buttons
- Yes: Light green (#e7f4e8) with green border (#689f6a)
- No: Light red (#f9e8e8) with red border (#9f6a6a)
- Maybe: Light yellow (#f3f3e8) with yellow-green border (#9a9a6a)
- Help: Light cyan (#e8f9f7) with teal border (#6a9f98)

## Typography

- Primary font: Arial - Clean, readable sans-serif
- Button text: 12-14px
- Keyboard keys: 16-20px (depending on zoom level)
- Sentence display: 16px
- Settings labels: 12-14px

Font weights:
- Regular for most text
- Bold for headers and important labels

## Layout Specifications

### Screen Regions

1. **Top Control Bar** (70-130px from top)
   - Contains all assistant controls
   - Fixed position at top of screen
   - Grouped by function type

2. **Sentence Display** (130-200px from top)
   - Prominently positioned for visibility
   - Clear, readable text with good contrast
   - Visual indication of newly added words

3. **Word Prediction Area** (200-260px from top)
   - Horizontally arranged prediction options
   - Clear separation from other elements
   - Each prediction in its own button

4. **Keyboard Area** (260-500px from top)
   - Flexible height based on mode
   - Reduced height when trackpad is active
   - Keys arranged in standard QWERTY layout or alternative layouts

5. **Common Words Area** (Bottom 60-80px)
   - Color-coded for quick recognition
   - Larger buttons for frequent phrases
   - Positioned for easy access

### Element Dimensions

- **Standard Buttons:** 40px height, variable width
- **Keyboard Keys:** 50x50px (adjustable with zoom)
- **Word Prediction Buttons:** 80x30px
- **Common Word Buttons:** 80x45px
- **Trackpad Area:** Full width x 120px height

## Interactive Elements

### Buttons

1. **Standard Control Buttons**
   - White background
   - Light gray border
   - Corner radius: 5px
   - Clear, concise labels

2. **Mode Toggle Buttons**
   - Blue highlight when active
   - White when inactive
   - Clear icon or text label

3. **Common Word Buttons**
   - Color-coded by category/meaning
   - Larger touch targets
   - Text centered

### State Indicators

1. **Active/Selected State**
   - Blue border (#4488ff)
   - Light blue fill (#d8e8ff)
   - 2px border width

2. **Hover/Focus State**
   - Light blue fill
   - Subtle transition

3. **Scanning Highlight**
   - Row highlight: Light blue background
   - Key highlight: Blue border
   - Progress indicator at bottom

## Mode-Specific Design Elements

### QWERTY Keyboard Mode
- Standard keyboard layout
- Keys arranged in traditional pattern
- Space bar centered at bottom

### Trackpad Mode
- Reduced keyboard size
- Large trackpad area at bottom
- Visual indicator of corresponding position

### Scanning Mode
- Row highlighting
- Scanning progress indicator
- Speed control buttons in control bar

### Voice Dictation Mode
- Recording button highlighted in red
- Audio waveform visualization
- Dictated text highlighted in red

### Settings View
- Categorical side menu
- Clear section headers
- Toggle switches and slider controls
- Save button prominently positioned

## Responsive Design

The interface adjusts based on:

1. **Zoom Level**
   - Keys and buttons scale proportionally
   - Maintain minimum touch target size of 44x44px
   - Text scales appropriately

2. **Mode Changes**
   - Elements appear/disappear based on active mode
   - Smooth transitions between states
   - Consistent placement of persistent elements

## Accessibility Considerations

1. **High Contrast Mode**
   - Increased contrast between text and background
   - Bolder outlines around interactive elements
   - Removal of subtle gray distinctions

2. **Text Size Options**
   - Ability to increase text size independently of layout

3. **Color Blindness Considerations**
   - Use of patterns in addition to colors for distinctions
   - Avoidance of red/green combinations for critical functions

## Implementation Notes

1. **HTML Structure**
   - Semantic markup for accessibility
   - Proper heading hierarchy
   - ARIA attributes where appropriate

2. **CSS Approach**
   - Mobile-first responsive design
   - Flexbox for layout
   - Custom properties for theming
   - Media queries for orientation changes

3. **JavaScript Considerations**
   - Event delegation for performance
   - Throttling for trackpad events
   - Local storage for persistent settings

## Next Steps

1. Interactive prototype development
2. User testing with target users (both disabled user and assistant)
3. Refinement based on feedback
4. Implementation of full HTML/CSS/JavaScript solution
5. Testing on target iPad devices
