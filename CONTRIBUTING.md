# Contributing to URL Extractor Pro

First off, thank you for considering contributing! Your help is appreciated to make this extension even better.

This document provides guidelines for contributing to the project.

## How Can I Contribute?

- **Reporting Bugs:** Find something not working as expected? Please open an issue on the GitHub repository!
- **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue to discuss it.
- **Submitting Code Changes:** Found a bug you can fix or want to implement a feature? Awesome! Please follow the Pull Request process below.

## Reporting Bugs

When reporting a bug, please include the following details in your GitHub issue:

1.  **Clear Title:** A concise summary of the issue.
2.  **Description:** A detailed description of the problem.
3.  **Steps to Reproduce:** Provide clear, numbered steps on how to trigger the bug.
4.  **Expected Behavior:** What did you expect to happen?
5.  **Actual Behavior:** What actually happened? Include any error messages shown in the extension popup or the browser's Developer Console (F12 -> Console).
6.  **Environment:** Your operating system, Chrome browser version.
7.  **Screenshots (Optional):** Visual aids are often very helpful.

## Suggesting Enhancements

When suggesting an enhancement:

1.  **Clear Title:** A concise summary of the feature request.
2.  **Motivation:** Why is this enhancement needed? What problem does it solve?
3.  **Proposed Solution:** Describe how you envision the feature working. Mockups or detailed descriptions are welcome.
4.  **Alternatives (Optional):** Have you considered other ways to achieve the same goal?

## Submitting Code Changes (Pull Requests)

1.  **Fork the Repository:** Create your own copy of the repository on GitHub.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/html-url-extractor-enhanced.git
    cd html-url-extractor-enhanced
    ```
3.  **Create a Branch:** Create a new branch for your changes. Use a descriptive name (e.g., `fix-history-sorting`, `feature-regex-export`).
    ```bash
    git checkout -b name-of-your-branch
    ```
4.  **Make Changes:** Implement your fix or feature.
5.  **Test Your Changes:**
    - Load the extension into Chrome as an unpacked extension (using the `html-url-extractor-enhanced` directory).
    - Thoroughly test the functionality you added or modified. Ensure existing features still work correctly. Check for errors in the console.
6.  **Commit Your Changes:** Write clear, concise commit messages explaining _what_ change was made and _why_.
    ```bash
    git add .
    git commit -m "Fix: Corrected history sorting logic"
    ```
7.  **Push to Your Fork:** Push your branch to your forked repository on GitHub.
    ```bash
    git push origin name-of-your-branch
    ```
8.  **Open a Pull Request (PR):**
    - Go to your fork on GitHub.com.
    - Click the "Compare & pull request" button for your branch.
    - Ensure the base repository is the original project and the head repository is your fork/branch.
    - Provide a clear title and description for your PR, explaining the changes and referencing any related GitHub issues (e.g., "Closes #12").
    - Submit the Pull Request.

## Code Style

- **Consistency:** Try to maintain consistency with the existing code style.
- **Readability:** Write clear, readable code. Add comments where necessary to explain complex parts.
- **JavaScript:** Follow general modern JavaScript best practices (e.g., use `const` and `let` appropriately, use async/await for promises).

## Conduct

Please interact respectfully with other contributors and maintainers. We aim for a positive and collaborative environment.

Thank you again for your interest in contributing!
