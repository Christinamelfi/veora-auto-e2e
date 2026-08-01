# Veora Auto - E2E Test Suite 🧪

Complete end-to-end test suite for Veora Auto using Playwright. This suite covers all critical user paths across authentication, dossier management, inspections, and purchase workflows.

## 📊 Test Coverage

| Suite | Tests | Coverage |
|-------|-------|----------|
| **Authentication** | 6 | Login, logout, password reset, session persistence |
| **Dossiers** | 8 | Create, read, update, filter, timeline |
| **Inspection** | 9 | Checklists (identity, exterior, interior, mechanical), VIN check, auto-save |
| **Purchase/Acquisition** | 9 | Confir
---

**Status**: ✅ E2E test suite ready to runmation, payment, reception, costs, margin |
| **TOTAL** | **32** | **✅ All critical paths** |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.test` and update credentials:

```bash
cp .env.example .env.test
```

Edit `.env.test` with your test credentials:
```env
TEST_USER_EMAIL=your.test@email.com
TEST_USER_PASSWORD=YourTestPassword!@#
```

### 3. Run Tests Locally

Start the dev server in one terminal:
```bash
npm run dev
```

Run tests in another terminal:
```bash
npm run test:e2e
```

## 📋 Available Commands

```bash
# Run all tests (headless mode)
npm run test:e2e

# Run tests with interactive UI (recommended for debugging)
npm run test:e2e:ui

# Run tests with debugger
npm run test:e2e:debug

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# View test report from last run
npm run test:e2e:report
```

## 🎯 Running Specific Tests

```bash
# Run only authentication tests
npx playwright test e2e/auth.spec.ts

# Run a specific test by name
npx playwright test -g "should display login page"

# Run on a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile devices
npx playwright test --project="Mobile Chrome"
npx playwright test --project="iPhone 12"
```

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5 (Chrome), iPhone 12 (Safari)
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Enabled on retry for debugging
- **Timeout**: 30 seconds per test, 120 seconds for server startup

### Test Structure

```
e2e/
├── auth.spec.ts        - Authentication flow tests
├── dossiers.spec.ts    - Dossier management tests
├── inspection.spec.ts  - Inspection workflow tests
└── achat.spec.ts       - Purchase flow tests
```

## 🔄 CI/CD Integration

This project includes GitHub Actions workflow for automated testing:

- **Trigger**: On push to `main`/`develop` and pull requests
- **Parallelization**: 4 shards for faster execution
- **Retries**: 2 attempts on failure in CI
- **Artifacts**: Test reports, videos, and traces uploaded on failure
- **PR Comments**: Automatic test results summary on pull requests

### Setting up GitHub Secrets

For CI/CD to work, add these secrets to your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Add:
   - `TEST_USER_EMAIL`: Your test user email
   - `TEST_USER_PASSWORD`: Your test user password

```bash
# Or via GitHub CLI:
gh secret set TEST_USER_EMAIL --body "demo@veora.local"
gh secret set TEST_USER_PASSWORD --body "Demo123!@#"
```

## 📝 Test Scenarios

### Authentication (`auth.spec.ts`)
- ✅ Display login page with form
- ✅ Show error on invalid credentials
- ✅ Redirect to dashboard on valid login
- ✅ Logout successfully
- ✅ Handle password reset flow
- ✅ Persist session after page reload

### Dossiers (`dossiers.spec.ts`)
- ✅ Display dossiers list for Manager role
- ✅ Display dossiers list for Office role
- ✅ Create new dossier
- ✅ Display dossier detail
- ✅ Change dossier status
- ✅ Display vehicle information
- ✅ Filter dossiers by status
- ✅ Display dossier timeline/activity

### Inspection (`inspection.spec.ts`)
- ✅ Access inspection form
- ✅ Display identity checklist
- ✅ Complete exterior checklist (19 points)
- ✅ Complete interior checklist (17 points)
- ✅ Complete mechanical checklist (19 points)
- ✅ Block inspection on VIN mismatch
- ✅ Auto-save inspection form
- ✅ Display comparison table (declared vs estimated vs actual)
- ✅ Persist inspection data after reload

### Purchase/Acquisition (`achat.spec.ts`)
- ✅ Display purchase panel
- ✅ Confirm purchase
- ✅ Track payment status
- ✅ Handle vehicle reception
- ✅ Change payment status
- ✅ Display actual costs
- ✅ Display revised margin
- ✅ Display cost summary
- ✅ Block purchase on VIN mismatch

## 🛠️ Troubleshooting

### Tests fail locally but pass in CI
- Verify test credentials are correct
- Check that base URL matches your dev server
- Ensure dev server is running on `http://localhost:5173`

### Element not found errors
Use Playwright's code generator to record correct selectors:

```bash
npx playwright codegen http://localhost:5173
```

Then click elements in the browser to generate selectors automatically.

### Timeout errors
- Increase timeout in `playwright.config.ts` if needed
- Check that dev server started successfully
- Verify network connectivity

### Authentication failures
- Verify `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` are valid
- Check test user exists in your database
- Ensure test account has required permissions (Manager/Office roles)

## 📊 Test Reports

After running tests, reports are available at:

```bash
# View HTML report
npm run test:e2e:report

# Access reports from last run
open playwright-report/index.html
```

Reports include:
- ✅ Test execution summary
- 📊 Pass/fail breakdown by suite
- 📹 Video recordings of failed tests
- 📸 Screenshots on failure
- 🔍 Detailed traces for debugging

## 🚀 Deployment

### 1. Commit and Push

```bash
git add .
git commit -m "Add E2E tests with Playwright"
git push origin main
```

### 2. GitHub Actions

Tests will run automatically on push. Check status in:
- **Pull Requests** - Test summary comment
- **Actions** tab - Full workflow logs
- **Artifacts** - Detailed reports and videos

### 3. Require Tests in Branch Protection

1. Go to **Settings → Branches**
2. Edit branch protection rule for `main`
3. Check "Require status checks to pass before merging"
4. Select `test` workflow

## 📚 Documentation

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)

## 🤝 Contributing

When adding new tests:
1. Follow existing test structure and naming conventions
2. Use descriptive test names (what should happen, not how)
3. Add `data-testid` attributes to components for stable selectors
4. Group related tests in `describe()` blocks
5. Keep tests independent and idempotent

## 📞 Support

For issues or questions:
1. Check test output and logs
2. Run in UI mode: `npm run test:e2e:ui`
3. Check Playwright docs: https://playwright.dev
4. Enable debug mode: `PWDEBUG=1 npm run test:e2e`

---

**Status**: ✅ Ready for production use

Last updated: August 2026
