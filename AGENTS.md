<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Verification Commands (Obligatorio)
Whenever you modify files or implement new features in this repository, you MUST execute these commands to ensure everything is correct and built successfully before ending your turn:
1. `pnpm run lint` - Runs ESLint.
2. `pnpm exec tsc --noEmit` - Checks TypeScript types.
3. `pnpm run build` - Tests the full Next.js production build.

You must fix any issues reported by these checks before presenting your final answer.
