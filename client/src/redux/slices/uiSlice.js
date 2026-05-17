import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('theme') || 'light';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: savedTheme,
    sidebarOpen: true,
    sidebarMobileOpen: false,
    activeModal: null,
    editingTransaction: null,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    toggleMobileSidebar: (state) => { state.sidebarMobileOpen = !state.sidebarMobileOpen; },
    closeMobileSidebar: (state) => { state.sidebarMobileOpen = false; },
    openModal: (state, action) => { state.activeModal = action.payload; },
    closeModal: (state) => { state.activeModal = null; state.editingTransaction = null; },
    setEditingTransaction: (state, action) => { state.editingTransaction = action.payload; },
  },
});

export const {
  toggleTheme, setTheme, toggleSidebar, toggleMobileSidebar,
  closeMobileSidebar, openModal, closeModal, setEditingTransaction,
} = uiSlice.actions;
export default uiSlice.reducer;
