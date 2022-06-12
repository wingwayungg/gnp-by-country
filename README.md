# GNP per person employed
This is a simple website, listing the Gross National Product(GNP) per person employed of each country in the year 2020. The data is taken from [WorldBank](https://data.worldbank.org/indicator/SL.GDP.PCAP.EM.KD?end=2020&view=map). This webpage has two main purposes. First, the CNP per capita is widely discussed around the world, while the data of GNP per person employed is often overlooked. Second, this project serves as an exercise to practice my favourite framework - Next.js! The features of this project include:
  - searching by keywords
  - filtering by GNP
  - sorting by name or value of GNP
  - pagination
  - dark mode (upcoming)

## Technical Features
  - **Static-site Generation (SSG)**. The GNP figures in 2020 are a past record, and are therefore static. The data is firstly fetched through WorldBank API, and the site is pre-renderd at build time. The users need not to wait when entering the webpage as the table is already loaded. This techniques also benefit the page for Search Engine Optimization (SEO). While users searchs for this webpage in google, the data rather than the word "No Result" will be displayed on the search result page.

  - **React hook Memoization**. The webpage allows users to change page quickly with the help of built-in useMemo hook. The current search result list is stored as React state. When users change pages by clicking the pagination items, instead of sorting or filtering the entire list again, the result could be retrieved by returning a different index from the current search result list.

  - **Pagination**. The search results are recorded in the URL. This enables users to reload, store and share the search results using URL links.

  - **Form Optimization**. An external library react-hook-form is used to optimize the form performance. The form is built with uncontrolled components and does not re-render when the user types in the input fields.

## Quality Control
Lighthouse serve as an excellent tool to measure and ensure the quality of the webpage. 
<br />
<p align="center"><img width="400" alt="Screenshot 2022-05-23 at 11 20 34 PM" src="https://user-images.githubusercontent.com/82010421/169856518-250b3003-f55d-4579-8a2c-547fdb7d1708.png"></p>


## Programming Languages
The languages I used is React, TypeScript, Scss under Next.js framework. The site is also developed with the help of additional libraries including Bootstrap, React-Bootstrap, React-hook-form and Ramda.

## Deployment
Please visit https://gnp-by-country.wingwayung.com/
