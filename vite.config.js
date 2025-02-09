import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
    'import.meta.env.VITE_SPREADSHEET_ID': JSON.stringify(process.env.VITE_SPREADSHEET_ID),
    'import.meta.env.VITE_SHEET_NAME': JSON.stringify(process.env.VITE_SHEET_NAME),
  }
});
