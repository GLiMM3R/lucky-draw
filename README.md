<!-- GETTING STARTED -->

## Description

🎉[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```
## Running the app 🚀

```bash
# development
$ npm run dev

# watch mode
$ npm run dev

# production mode
$ npm run prod
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Test 🧪

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run e2e
```

## Get into local server 📌
When you run the project and the application is run on:
```typescript
http://127.0.0.1:3000/api-docs
```
The port can be changed port later, when you click on that local ip you will get swagger ui in browser

## Swagger UI 📺

Simplify API development for users, teams, and enterprises with the Swagger open source and professional toolset. Find out how Swagger can help you design and document your APIs at scale. [read more here](https://swagger.io/)

## Git Commit Message Convention for Team 🤜🏻🤛🏻
A Git commit message convention is a set of guidelines for writing commit messages that are clear, concise, and informative. These guidelines help to ensure that commit messages are consistent, easy to understand, and provide important information about the changes made in a commit. Developers can more easily collaborate on projects, track changes, and understand the history of a project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### A standard git commit message typically appears as follows:
```bash
<type>(<scope>): <subject>
```

### The “type” field must be chosen from the options listed below:
- chore: Changes that do not affect the external user (e.g. updating the .gitignore file or .prettierrc file).
<blockquote>
- chore(docker): add Dockerfile and .dockerignore.
</blockquote>

- feat: A new feature.
<blockquote>
- feat(auth): make authentication and authorization.

  - we secure by guard and identify with roles but not the best way.

  - we should encrypt jwt before production.
</blockquote>

- fix: A bug fix.
<blockquote>
- fix(token): AECK-613 API query profile with token
</blockquote>

- docs: Documentation a related changes.
<blockquote> - docs: BAC-66 write visual studio code document guide lines.

  - add logo-stable for vscode
  - add vscode.md
  - mod readme.md
</blockquote>

- refactor: A code that neither fix bug nor adds a feature. (eg: You can use this when there is semantic changes like renaming a variable/ function name).
<blockquote>
- refactor: BAC-66 refactor login and register controller.
</blockquote>

- perf: A code that improves performance style: A code that is related to styling.
<blockquote>
- perf: BAC-66 add prettier and eslint.
</blockquote>

- test: Adding new test or making changes to existing test
<blockquote>
- test: BAC-66 add unit test for login and register controller.
</blockquote>

### The “scope” is optional
The “scope” field should be a noun that represents the part of the codebase affected by the commit.

For example, if the commit changes the login page, the scope could be “login”. If the commit affects multiple areas of the codebase, “global” or “all” could be used as the scope.

Refer this [link](https://karma-runner.github.io/1.0/dev/git-commit-msg.html) for example related to scope.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Write understandable “Subject”
“The “subject” field should be a brief description of the commit, written in the imperative present tense. It should not end with a period and the first letter should not be capitalized.

For example, “add login page” or “fix bug in search functionality” are both appropriate subjects.”

## Support ⚙️

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch 🫱🏻‍🫲🏻

- Website - [https://iquritech.com/](https://iquritech.com/)


## License

Nest is [MIT licensed](LICENSE).
