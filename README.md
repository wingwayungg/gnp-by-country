# GNP per person employed
This is a simple website, listing the Gross National Product(GNP) per person employed of each country in the year 2020. The data is taken from [WorldBank](https://data.worldbank.org/indicator/SL.GDP.PCAP.EM.KD?end=2020&view=map). This webpage has two main purposes. First, the CNP per capita is widely discussed around the world, while the data of GNP per person employed is often overlooked. Second, this project serves as an exercise to practice Next.js and AI integration. The features of this project include:
  - AI assistant(powered by [Google Gemini](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/sdks/overview))
  - searching by keywords
  - filtering by GNP
  - sorting by name or value of GNP
  - pagination
  - dark mode

## Ask AI

[![Powered by Google Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)

A prompt bar sits above the table. It sends the question, together with the full 2020 dataset, to Gemini (`gemini-3.1-flash-lite`) and renders back a short, grounded answer — the model is instructed to answer only from the dataset, never from outside knowledge, so it can't hallucinate a figure for a country or year that isn't in front of it. Below are real exchanges against the live 2020 dataset:

| Prompt | Answer |
| --- | --- |
| What is the GNP per person employed in Japan? | 83,657 |
| Top 5 countries by GNP per person employed | Luxembourg, Ireland, Singapore, Brunei Darussalam, Norway |
| Which country has the lowest GNP per person employed? | Burundi |
| Compare the United States and Canada | United States: 145,940; Canada: 111,042 |
| What's the capital of France? | Irrelevant |
| Write me a poem about Ireland | Irrelevant |
| Hi | Irrelevant |
| What was North Korea's GNP per person employed? | No data |

The last four rows show the guardrails: a question unrelated to the dataset gets `Irrelevant`, and a question about the right topic but a country the World Bank doesn't publish data for gets `No data` — rather than the model guessing or reaching for outside knowledge.

> **Note:** this runs on Google AI Studio's free tier, which is heavily contended — answers can be quick or can take several seconds, and the server action gives up after 12s and returns an error rather than leaving the request hanging. If you see a timeout or "unavailable" error, it's usually free-tier congestion — try again in a moment.

## Technical Features
  - **Pre-rendering**. The GNP figures in 2020 are a past record, and are therefore static. The data is firstly pre-fetched using WorldBank API at build time. The users need not wait for fetching the data when entering the webpage as the pre-fetched data is already passed to client components. Furthermore, as the data is fetched, all the navigation, such as searching by country name or going to next/previous pagination, is done on client side to avoid unnecessary API calls (thus the page works during offline!). Since the pre-render result is static and cached, a hard reload or request through url won't trigger further server rerender.

  - **Pagination**. The search results are recorded in the URL. This enables users to reload, store and share the search results using URL links.

  - **React hook Memoization**. This page provides lots of tools for users to inspect the data, like sorting, pagination, searching by country name and GNP data. When using these tools, there are some operations that involves less computation costs using the following useMemo trick: The current search result list is stored as React state and memorized. For example, when users change pages by clicking the next pagination items, instead of sorting or filtering the entire data again, the new result could be retrieved by returning a different index from the current memorized search result list. 

  - **Form Optimization**. Form action provided by React v19 is used such that the form is built with uncontrolled components and does not re-render when the user types in the input fields and form values are obtained when submitting.

  - **AI Question Answering**. The entire dataset (pre-sorted by value) passed in as a system instruction plus the user's question are sent to Gemini. The pre-sorting allows ranking questions like "top 5" are answered by reading consecutive lines rather than sorting 176 numbers in model, prone to error from my testing result. Gemini by default uses implicit context caching as it recognizes identical instruction (i.e. dataset) on every request even thought the question changes, so the LLM answers faster by reusing internal cached neural states. Explicit caching is avoided on purpose: it makes no sense to keep the data in memory for a low-traffic personal site every hour.

## Quality Control
Lighthouse serve as an excellent tool to measure and ensure the quality of the webpage.
<br />
<p align="center"><img width="556" alt="Screenshot 2024-03-20 at 11 34 43 AM" src="https://github.com/user-attachments/assets/58ce2483-7d27-4334-9fcc-cf3e2e42a9cd"></p>



## Programming Languages
The languages I used is React, TypeScript, Scss under Next.js framework. The site is also developed with the help of additional libraries including Google Gemini SDK, Bootstrap, React-Bootstrap and Ramda.

## Deployment
Please visit https://gnp-by-country-yung.vercel.app/
