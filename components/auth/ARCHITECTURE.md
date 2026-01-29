# Local Authentication Component Architecture

## Overview

The local authentication flow has been decomposed into small, focused components with single responsibilities. Each component handles a specific aspect of the authentication process, making the codebase more maintainable and testable.

## Component Hierarchy

```
LocalAuthModal (Orchestrator)
├── BottomSheetBackdrop
└── BottomSheet
    └── PinEntry (Orchestrator)
        └── PinEntryContent
            ├── PinEntryHeader
            ├── PinInputSection
            └── VirtualKeyboard

LocalAuthSetup (Orchestrator)
└── BottomSheet
    ├── BiometricPrompt (Step 1)
    ├── PinSetupStep (Step 2)
    │   ├── PinInputSection
    │   └── VirtualKeyboard
    └── PinConfirmStep (Step 3)
        ├── PinInputSection
        └── VirtualKeyboard
```

## Component Responsibilities

### Orchestrator Components

These components coordinate the flow and manage state:

1. **LocalAuthModal** (`LocalAuthModal.tsx`)
   - Manages modal visibility lifecycle
   - Checks local auth status
   - Coordinates PIN entry display
   - Handles authentication success

2. **LocalAuthSetup** (`LocalAuthSetup.tsx`)
   - Manages multi-step setup flow
   - Coordinates biometric → PIN → confirm steps
   - Handles PIN validation and storage
   - Manages setup state transitions

3. **PinEntry** (`PinEntry.tsx`)
   - Manages PIN authentication logic
   - Tracks failed attempts
   - Handles biometric fallback
   - Enforces attempt limits

### Presentation Components

These components handle UI rendering:

#### Bottom Sheet Components
- **BottomSheet** (`bottom-sheet/BottomSheet.tsx`)
  - Container with drag indicator
  - Theme-aware styling
  - Positioning and sizing

- **BottomSheetBackdrop** (`bottom-sheet/BottomSheetBackdrop.tsx`)
  - Semi-transparent overlay
  - Optional dismissal handler

#### PIN Components
- **PinEntryHeader** (`pin/PinEntryHeader.tsx`)
  - Title and subtitle display
  - Consistent header styling

- **PinInputSection** (`pin/PinInputSection.tsx`)
  - PIN input field display
  - Visual feedback
  - Auto-complete detection

- **PinEntryContent** (`pin/PinEntryContent.tsx`)
  - Complete PIN entry interface
  - Composes header, input, keyboard
  - Manages keyboard interactions

#### Setup Components
- **BiometricPrompt** (`setup/BiometricPrompt.tsx`)
  - Biometric authentication prompt
  - Action buttons (authenticate, skip, cancel)
  - Loading state

- **PinSetupStep** (`setup/PinSetupStep.tsx`)
  - PIN creation interface
  - Virtual keyboard integration
  - Auto-submit on completion

- **PinConfirmStep** (`setup/PinConfirmStep.tsx`)
  - PIN confirmation interface
  - Validation feedback
  - Auto-submit on match

#### Shared Components
- **VirtualKeyboard** (`VirtualKeyboard.tsx`)
  - Number keypad (0-9)
  - Optional biometric button
  - Delete/backspace button
  - Theme-aware styling

## Data Flow

### PIN Entry Flow
```
User Input → VirtualKeyboard → PinEntryContent → PinEntry
                                              ↓
                                    authenticateWithPin()
                                              ↓
                                    Success/Failure Handler
```

### Setup Flow
```
BiometricPrompt → PinSetupStep → PinConfirmStep
      ↓                ↓               ↓
  setBiometric    setPin()      setupPin()
  Enabled()                      ↓
                            Secure Storage
```

## State Management

### LocalAuthModal
- `showPinEntry`: Boolean - whether to show PIN entry
- Uses `useLocalAuth` hook for status

### LocalAuthSetup
- `step`: "biometric" | "pin" | "confirm"
- `pin`: string - PIN being created
- `confirmPin`: string - confirmation PIN
- `isLoading`: boolean - async operation state
- `biometricAvailable`: boolean - device capability

### PinEntry
- `pin`: string - current PIN input
- `attempts`: number - failed attempt count
- `isLoading`: boolean - authentication state
- `isBiometricLoading`: boolean - biometric auth state

## Key Design Patterns

### 1. Composition Over Inheritance
Components are composed together rather than extended:
```tsx
<BottomSheet>
  <PinEntryContent {...props} />
</BottomSheet>
```

### 2. Single Responsibility Principle
Each component has one clear purpose:
- `PinInputSection` - only displays PIN input
- `PinEntryHeader` - only displays header text
- `VirtualKeyboard` - only handles keyboard input

### 3. Controlled Components
All state is managed by parent components:
- PIN value flows down via props
- Changes flow up via callbacks

### 4. Separation of Concerns
- **Orchestrators**: Business logic and state
- **Presenters**: UI rendering and user interaction
- **Utilities**: Reusable UI components

## Benefits of This Architecture

1. **Maintainability**: Small, focused components are easier to understand and modify
2. **Testability**: Each component can be tested in isolation
3. **Reusability**: Components like `BottomSheet` can be reused elsewhere
4. **Readability**: Clear component names and responsibilities
5. **Scalability**: Easy to add new steps or modify existing ones

## Adding New Features

### Adding a New Setup Step
1. Create new component in `setup/` directory
2. Add step to `LocalAuthSetup` state
3. Add conditional rendering in `LocalAuthSetup`
4. Update step transitions

### Modifying PIN Input
1. Update `PinInputSection` for display changes
2. Update `VirtualKeyboard` for input changes
3. Update `PinEntry` for validation changes

### Changing Bottom Sheet Style
1. Update `BottomSheet` component
2. All modals using it will automatically update

## Constants

All PIN-related constants are centralized in `constants/schemas.ts`:
- `PIN_LENGTH`: Maximum PIN length
- `PIN_MIN_LENGTH`: Minimum PIN length

Change these values in one place to update the entire flow.

