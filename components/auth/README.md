# Local Authentication Components

This directory contains all components related to local authentication (PIN and biometric) functionality.

## Architecture

The local auth flow is decomposed into small, focused components with single responsibilities. Components are organized by their purpose:

```
components/auth/
├── bottom-sheet/          # Reusable bottom sheet UI components
│   ├── BottomSheet.tsx    # Bottom sheet container with drag indicator
│   └── BottomSheetBackdrop.tsx  # Backdrop overlay
├── pin/                   # PIN entry components
│   ├── PinEntryHeader.tsx # Header text component
│   ├── PinInputSection.tsx # PIN input display
│   └── PinEntryContent.tsx # Complete PIN entry interface
├── setup/                 # Setup flow components
│   ├── BiometricPrompt.tsx # Biometric authentication prompt
│   ├── PinSetupStep.tsx   # PIN creation step
│   └── PinConfirmStep.tsx # PIN confirmation step
├── VirtualKeyboard.tsx    # Virtual keyboard component
├── LocalAuthModal.tsx     # Main modal orchestrator
├── LocalAuthSetup.tsx     # Setup flow orchestrator
└── PinEntry.tsx           # PIN entry orchestrator
```

## Component Responsibilities

### Bottom Sheet Components

#### `BottomSheet`
- **Purpose**: Reusable container for bottom sheet modals
- **Responsibilities**:
  - Provides consistent bottom sheet styling
  - Renders drag indicator
  - Handles theme-aware colors
  - Manages positioning and sizing

#### `BottomSheetBackdrop`
- **Purpose**: Backdrop overlay for modals
- **Responsibilities**:
  - Provides semi-transparent overlay
  - Theme-aware opacity
  - Optional dismissal handler

### PIN Components

#### `PinEntryHeader`
- **Purpose**: Header section for PIN screens
- **Responsibilities**:
  - Displays title and subtitle
  - Consistent styling

#### `PinInputSection`
- **Purpose**: PIN input field display
- **Responsibilities**:
  - Renders PIN boxes
  - Handles visual feedback
  - Auto-complete detection
  - Error state indication

#### `PinEntryContent`
- **Purpose**: Complete PIN entry interface
- **Responsibilities**:
  - Composes header, input, and keyboard
  - Manages virtual keyboard interactions
  - Displays attempt counter
  - Handles PIN completion

### Setup Components

#### `BiometricPrompt`
- **Purpose**: Biometric authentication prompt
- **Responsibilities**:
  - Displays biometric setup UI
  - Handles authentication action
  - Provides skip and cancel options
  - Shows loading state

#### `PinSetupStep`
- **Purpose**: PIN creation step
- **Responsibilities**:
  - Displays PIN setup UI
  - Manages PIN input via virtual keyboard
  - Auto-submits when PIN is complete
  - Provides cancel option

#### `PinConfirmStep`
- **Purpose**: PIN confirmation step
- **Responsibilities**:
  - Displays PIN confirmation UI
  - Validates PIN match
  - Shows error feedback
  - Auto-submits when PIN matches
  - Provides back navigation

### Orchestrator Components

#### `LocalAuthModal`
- **Purpose**: Main modal for local auth when app regains focus
- **Responsibilities**:
  - Manages modal visibility
  - Checks local auth status
  - Displays PIN entry when needed
  - Handles authentication success

#### `LocalAuthSetup`
- **Purpose**: Main orchestrator for setup flow
- **Responsibilities**:
  - Manages multi-step setup flow
  - Handles biometric authentication
  - Validates PIN creation
  - Stores PIN securely

#### `PinEntry`
- **Purpose**: PIN entry orchestrator
- **Responsibilities**:
  - Manages PIN state and attempts
  - Handles PIN authentication
  - Manages biometric fallback
  - Enforces attempt limits

## Usage Examples

### Local Auth Modal (App Focus)

```tsx
import LocalAuthModal from "@/components/auth/LocalAuthModal";

<LocalAuthModal
  visible={showModal}
  onSuccess={() => setShowModal(false)}
/>
```

### Local Auth Setup

```tsx
import LocalAuthSetup from "@/components/auth/LocalAuthSetup";

<LocalAuthSetup
  onComplete={() => console.log("Setup complete")}
  onCancel={() => console.log("Setup cancelled")}
/>
```

### PIN Entry

```tsx
import PinEntry from "@/components/auth/PinEntry";

<PinEntry
  onSuccess={handleSuccess}
  showBiometricButton={true}
  maxAttempts={5}
/>
```

## Component Composition

Components are designed to be composed together:

1. **Bottom Sheet Pattern**:
   ```tsx
   <BottomSheet>
     <YourContent />
   </BottomSheet>
   ```

2. **PIN Entry Pattern**:
   ```tsx
   <PinEntryContent
     pin={pin}
     onPinChange={setPin}
     onSuccess={handleSuccess}
     ...
   />
   ```

3. **Setup Flow Pattern**:
   ```tsx
   <BottomSheet>
     <PinSetupStep
       pin={pin}
       onPinChange={setPin}
       onComplete={handleComplete}
       ...
     />
   </BottomSheet>
   ```

## Constants

PIN-related constants are defined in `constants/schemas.ts`:
- `PIN_LENGTH`: Maximum PIN length (default: 4)
- `PIN_MIN_LENGTH`: Minimum PIN length (default: 4)

## Virtual Keyboard

The `VirtualKeyboard` component provides:
- Number keys (0-9)
- Optional biometric button
- Delete/backspace button
- Theme-aware styling
- Disabled state support

## Security Considerations

1. **Modal Dismissal**: Local auth modals cannot be dismissed by tapping backdrop or using back button
2. **Attempt Limits**: PIN entry enforces maximum attempt limits
3. **Secure Storage**: All PINs are stored using `expo-secure-store`
4. **Auto-Submit**: PINs auto-submit when complete to prevent unnecessary button presses

## Theme Support

All components support light/dark themes through:
- `useColorScheme` hook
- Gluestack UI theme system
- Automatic color adaptation

## Testing

When testing local auth components:
1. Ensure local auth is enabled in settings
2. Set up a PIN first
3. Background the app to trigger modal
4. Test PIN entry and biometric authentication
5. Test attempt limits and error states

