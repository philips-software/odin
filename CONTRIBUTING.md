# Contributing to `odin`

Thank you for considering contributing. Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

# Expectations

This project aims to provide a simple way to dependency injection, and be a foundation for more custom approaches. The intention is to only implement generic features and avoid too specific ones. If you want to do something specific, you should build it on top of and not into `odin`.

# Making changes

Changes are welcome via GitHub pull requests.  For all contributions, please respect the following guidelines:

* Each pull request should implement **only one** feature or bugfix. If you want to add or fix more than one thing, submit more than one pull request.
* Do not commit changes to files that are irrelevant to your feature or bugfix (eg: .gitignore).
* Create issues for any major changes and enhancements that you wish to make. Discuss things transparently and get community feedback.
* Don't add any classes to the codebase unless absolutely needed. Err on the side of using functions.
* Be willing to accept criticism and work on improving your code.
* Be aware that the pull request review process is not immediate, and is generally proportional to the size of the pull request.
* Ensure that your changes follow our [conventions](#conventions).

# Conventions

1. Everything (code and otherwise) must be written in english.
2. Commit messages must follow the standard semantic release pattern.
3. File names must follow the kebab case pattern.
4. All code and configuration must be written using TypeScript instead of JavaScript (wherever possible).
5. All properties and methods must be documented using [JSDoc](https://jsdoc.app)
6. All `catches` and `rejections` must be handled
7. No dangling `@ts-ignore` comments without an explanation in it (e.g. `// @ts-ignore: why`)
8. No dangling `eslint-disable[...]` comments

# How to report a bug

### Security

You must never report security related issues, vulnerabilities or bugs including sensitive information through issues, or elsewhere in public.
Instead, sensitive bugs reports must be sent by email to **ALL** the [maintainers](./MAINTAINERS.md).

### Other

1. **Determine if your bug is really a bug**  
   You shouldn't file a bug if you're requesting support
2. **Make sure your bug hasn't already been reported**  
   Search through the issues. If you find a bug like yours, check to see if you have new information that could be reported to help someone fix the bug.
3. **Try it with the latest version**  
   A bug could be fixed by some other improvements and fixes, and it might not have an existing issue (open or closed), so try using the latest version.
4. **Collect information about the bug**  
   The more information we have, the more likely of having a bug fixed. We need to be able to reproduce the conditions that caused it.
   Thoroughly explain the conditions in the issue and provide a repository with the code that reproduces the problem.  
5. **Notifications**  
   By default GitHub will email you to let you know when new comments have been made on your bug.
   In the event you've turned this feature off, you should consider checking it back on occasion to ensure you don't miss any questions a maintainer trying to fix the bug might ask.
6. **Submit the bug**
   1. Explain the problem and include additional details to help maintainers reproduce the problem:
      * **Use a clear and descriptive title** for the issue to identify the problem.
      * **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you started Atom, e.g. which command exactly you used in the terminal, or how you started Atom otherwise. When listing steps, **don't just say what you did, but explain how you did it**. For example, if you moved the cursor to the end of a line, explain if you used the mouse, or a keyboard shortcut or an Atom command, and if so which one?
      * **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
      * **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
      * **Explain which behavior you expected to see instead and why.**
      * **Feel free to include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
   2. Make sure to also answer these questions:
      1. **What version of `odin` are you using?**
      2. **What version of `odin` was the last one to work correctly?**
      3. **What did you do?**
      4. **What did you expect to see?**
      5. **What did you see instead?**
      6. **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.
