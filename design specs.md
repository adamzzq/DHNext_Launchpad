this is the the spec
build a functional Forge app prototype that showcases a Rovo-powered compliance check, alongside the other two "Startup Suite" modules. The goal is to demonstrate an intelligent, automated workflow and the core persistence concept.

Core MVP Features (The "Must-Haves")

Legal & Compliance Checker (ROVO-POWERED):

What it is: A button that triggers a Rovo agent to read a simple Confluence page. The UI will then display the compliance items that Rovo has verified.

Key Feature to Build: A Forge backend function that calls the Rovo API. The UI must dynamically display the results returned by Rovo. The result state must persist on reload.

What to Fake: Rovo will read a very simple, structured Confluence page (e.g., a page with checklist items and "STATUS: COMPLETE" text), not complex legal documents.

Customer Validation Tracker (CONFLUENCE LINK):

What it is: A single text input field to paste a Confluence URL.

Key Feature to Build: The link must be saved using Forge's storage API and persist on reload. This is a quick win to prove basic persistence.

What to Fake: No dynamic status dropdowns or complex link parsing.

Impact Metric Summary (STATIC):

What it is: A display of 2-3 key business metrics.

Key Feature to Build: Display hardcoded numbers for "MRR" and "Churn Rate" for visual context.

What to Fake: No API calls to external metric services. The data is static.

