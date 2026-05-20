import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('theme') || 'light';
const savedDateFormat = localStorage.getItem('dateFormat') || 'AD';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: savedTheme,
    dateFormat: savedDateFormat,
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
    toggleDateFormat: (state) => {
      state.dateFormat = state.dateFormat === 'AD' ? 'BS' : 'AD';
      localStorage.setItem('dateFormat', state.dateFormat);
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
  toggleTheme, setTheme, toggleDateFormat, toggleSidebar, toggleMobileSidebar,
  closeMobileSidebar, openModal, closeModal, setEditingTransaction,
} = uiSlice.actions;
export default uiSlice.reducer;
