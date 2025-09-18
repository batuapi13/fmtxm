# SNMP FM Transmitter Dashboard Design Guidelines

## Design Approach: Design System Approach
**Selected System:** Material Design with industrial monitoring customizations
**Justification:** This is a utility-focused, information-dense application for mission-critical monitoring where clarity, readability, and immediate status recognition are paramount.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary (24-hour operation environment):**
- Background: `220 15% 8%` (Deep blue-gray)
- Surface: `220 15% 12%` (Elevated cards)
- Primary: `200 100% 60%` (Bright blue for active states)
- Success: `120 60% 50%` (Green for operational status)
- Warning: `45 100% 55%` (Amber for alerts)
- Error: `0 70% 55%` (Red for failures)
- Text Primary: `0 0% 95%`
- Text Secondary: `0 0% 70%`

### B. Typography
**Font Families:** Inter (via Google Fonts) for high legibility
- Headlines: 600 weight, 1.5rem-2rem
- Body: 400 weight, 0.875rem-1rem
- Data displays: 500 weight, monospace numbers
- Status labels: 500 weight, 0.75rem

### C. Layout System
**Tailwind Spacing:** Primary units of 2, 4, and 8 (p-2, m-4, h-8, etc.)
- Card grid: 4-unit gaps between cards
- Inner card padding: 8 units
- Status indicator spacing: 2 units
- Section margins: 8 units

### D. Component Library

**Site Cards:**
- Elevated surface with subtle border
- Header with site name and overall status indicator
- Two-column layout for main/reserve transmitters
- Compact metric displays with color-coded status dots
- Real-time power level mini-charts

**Status Indicators:**
- Large circular indicators for primary status
- Small dot indicators for secondary metrics
- Pulsing animation for active polling states
- Color coding: Green (operational), Red (fault), Amber (warning), Gray (offline)

**Data Displays:**
- Monospace numbers for precise readings
- Unit labels in smaller, secondary text
- Threshold bars for power levels
- Timestamp displays for last update

**Navigation:**
- Top header with system title and global controls
- Filter/search for sites
- Settings panel for SNMP configuration
- Alert summary indicator

### E. Visual Hierarchy
**Primary Focus:** Site operational status (largest, most prominent)
**Secondary:** Individual transmitter metrics
**Tertiary:** Detailed readings and timestamps

## Layout Strategy
- Responsive grid layout (2-4 cards per row based on screen size)
- Sticky header for navigation
- Fixed card dimensions with internal scrolling if needed
- Alert panel slides in from right when triggered

## Interaction Patterns
- Hover states reveal additional detail tooltips
- Click cards to expand for detailed metrics
- Real-time updates with subtle highlight animations
- Keyboard navigation for accessibility in control room environments

## Performance Considerations
- Efficient data polling with visual feedback
- Minimal animations to reduce cognitive load
- High contrast for 24/7 operation visibility
- Large touch targets for industrial environments