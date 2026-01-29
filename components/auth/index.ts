/**
 * Local Authentication Components
 * 
 * Main entry point for local authentication components.
 * Exports all components used in the local auth flow.
 */

// Main orchestrator components
export { default as LocalAuthModal } from "./LocalAuthModal";
export { default as LocalAuthSetup } from "./LocalAuthSetup";
export { default as PinEntry } from "./PinEntry";

// Virtual keyboard
export { default as VirtualKeyboard } from "./VirtualKeyboard";

// Bottom sheet components
export * from "./bottom-sheet";

// PIN components
export * from "./pin";

// Setup components
export * from "./setup";
