# Security Policy

PlanNote is an early-stage personal planning app. Security work currently focuses on safe handling of reminder credentials, local data, and future AI integrations.

## Supported Versions

Security fixes are currently applied to the `main` branch.

## Reporting A Vulnerability

Please open a GitHub issue if the report does not contain sensitive information. If the issue includes secrets, private keys, or personal data, contact the maintainer privately before posting details publicly.

## Secret Handling

Do not commit real ServerChan SendKeys, OpenAI API keys, or other credentials.

Use example files such as `sendkey.example.json` for documentation only. Real keys should be entered locally by the user or stored through a safe environment configuration if a backend is added later.

## Known Security Priorities

- Remove any previously committed reminder keys and rotate them
- Review notification and reminder code paths
- Document what data is stored locally
- Add dependency checks and build checks
- Review future OpenAI API integration before release

## Data Storage

PlanNote currently stores tasks, notes, and reminder settings in the user's browser through local storage. Users should avoid storing highly sensitive personal information until stronger privacy controls are added.
