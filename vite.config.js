import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'import.meta.env': JSON.stringify(process.env) // 環境変数全体を `import.meta.env` に適用
  }
});
