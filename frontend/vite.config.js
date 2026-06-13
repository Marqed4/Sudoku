import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    preview: {
        allowedHosts: ['sudoku.marqed.it', 'sudoku-production-7f4b.up.railway.app'],
    },
    server: {
        port: 2001,
        proxy: {
            '/api': 'http://localhost:2002',
            '/socket.io': {
                target: 'http://localhost:2002',
                ws: true,
                changeOrigin: true
            }
        }
    }
})