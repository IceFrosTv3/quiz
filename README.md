# Quiz App

An interactive quiz platform rebuilt as a Single Page Application using Angular 18. The application provides user authentication through JWT tokens, quiz browsing and selection, timed multiple-choice tests with navigation, results viewing with detailed answer breakdown, and automatic token refresh via HTTP interceptor.

## Tech Stack

- Angular 18 (standalone components)
- TypeScript (strict mode)
- SCSS
- RxJS
- Angular Material
- Angular ESLint

## Project Structure

```
src/
├── app/
│   ├── core/              # Auth service, interceptor, guard
│   ├── features/          # Pages: main, auth, test, result
│   └── shared/            # Directives, types, services, layout
├── assets/                # Images, fonts
├── environments/          # Dev / prod environment config
└── styles/                # Global SCSS styles
```

## Getting Started

Node.js 18+ and a running backend API at `localhost:3000` are required.

```bash
npm install
ng serve
```

The development server will be available at `http://localhost:4200`.

For production build:

```bash
ng build
```

## Linting

```bash
ng lint
```

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/signup` | Registration |
| `/login` | Login |
| `/choice` | Quiz selection |
| `/test/:id` | Quiz passing |
| `/result` | Results |
| `/result-details` | Detailed results with correct answers |
