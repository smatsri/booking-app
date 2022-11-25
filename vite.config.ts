import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig as testConfig } from 'vitest/config'


// https://vitejs.dev/config/
const base = defineConfig({
  plugins: [react()],
})

const test = testConfig({
  test: {

  }
})

export default { ...base, ...test }