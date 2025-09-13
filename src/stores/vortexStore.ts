import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type VortexMode = 'vortex' | 'groups';

interface VortexState {
  // Core state only - no frame-level animation state
  mode: VortexMode;
  
  // Actions
  setMode: (mode: VortexMode) => void;
  toggleMode: () => void;
}

export const useVortexStore = create<VortexState>()(
  devtools(
    (set, get) => ({
      // Initial state
      mode: 'vortex',
      
      // Mode actions
      setMode: (mode) => {
        console.log('🔄 Zustand: Setting mode to', mode);
        set({ mode });
      },
      
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'vortex' ? 'groups' : 'vortex';
        console.log('🔄 Zustand: Toggling mode from', currentMode, 'to', newMode);
        set({ mode: newMode });
      },
    }),
    {
      name: 'vortex-store',
    }
  )
);

// Simple selector
export const selectMode = (state: VortexState) => state.mode;
