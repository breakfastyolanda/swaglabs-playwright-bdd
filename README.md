# Swag Labs Playwright BDD Test Automation Framework

**Author:** Yolanda Breakfast  

## Overview
## Overview

This project is an automated end-to-end testing framework for the Swag Labs web application. It was developed using Playwright, Cucumber BDD, and TypeScript.

The framework follows the Page Object Model (POM) design pattern to separate page interactions from test scenarios and step definitions, improving readability, maintainability, and reusability.

The automated test suite covers the complete customer journey, including login, product browsing, sorting, cart management, checkout validation, successful order completion, post-checkout behaviour, navigation, and logout.

## Tech Stack

- Playwright
- Cucumber.js
- TypeScript
- Node.js
- Page Object Model (POM)
- Gherkin / Behaviour-Driven Development (BDD)

## Project Structure

```text
swaglabs-playwright-bdd/
├── features/
│   ├── step-definitions/
│   │   └── swaglabs.steps.ts
│   └── swaglabs.feature
├── pages/
│   └── SwagLabsPage.ts
├── reports/
├── support/
│   ├── hooks.ts
│   └── world.ts
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json