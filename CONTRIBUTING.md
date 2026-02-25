# Contributing

Want to contribute? Great!

## Quick Guidelines

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Clinique.git
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   git checkout -b fix/bug-name
   ```

3. **Make Changes & Test**
   ```bash
   make lint
   make test
   ```

4. **Commit with Clear Message**
   ```bash
   git commit -m "feat: add patient search feature"
   git commit -m "fix: resolve login timeout issue"
   git commit -m "refactor: simplify API endpoints"
   ```

5. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Branch Naming

- `feature/name` - New features
- `fix/name` - Bug fixes
- `refactor/name` - Code refactoring
- `docs/name` - Documentation

## Commit Format

```
type: short description

Optional longer description
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

## Code Quality

Before committing:
```bash
make format-backend    # Format Python
make format-frontend   # Format JavaScript
make lint              # Check quality
```

## Testing

```bash
make test              # Run all tests
```

## Need Help?

- Check existing [Issues](https://github.com/LeuzThiam/Clinique/issues)
- Open a new issue with details
- Describe the problem and what you tried

## Standards

- Keep commits small and focused
- Write clear commit messages
- Test your changes
- Update docs if needed
- Be respectful and constructive

That's it! Thanks for contributing 🚀
