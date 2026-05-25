Run the project verification suite: type-check + lint.

```bash
npx tsc --noEmit && npm run lint
```

Report:
1. **TypeScript**: Type errors found (file, line, message)
2. **ESLint**: linting warnings and errors

If everything passes cleanly, confirm that the code is in good condition.
If there are errors, list them in order of priority and suggest fixes.

> Note: No testing framework (Jest/Vitest) is installed yet. This command covers the available static verification.
