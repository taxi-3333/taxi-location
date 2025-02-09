import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'import.meta.env.VITE_API_KEY': process.env.VITE_API_KEY
      ? JSON.stringify(process.env.VITE_API_KEY)
      : JSON.stringify(""),
    'import.meta.env.VITE_SPREADSHEET_ID': process.env.VITE_SPREADSHEET_ID
      ? JSON.stringify(process.env.VITE_SPREADSHEET_ID)
      : JSON.stringify(""),
    'import.meta.env.VITE_SHEET_NAME': process.env.VITE_SHEET_NAME
      ? JSON.stringify(process.env.VITE_SHEET_NAME)
      : JSON.stringify(""),
  }
});
