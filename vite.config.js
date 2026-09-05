import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' && repositoryName

  return {
    plugins: [react()],
    base: isGitHubPages ? `/${repositoryName}/` : '/',
    server: {
      port: 5173,
      host: true,
    },
  }
})
