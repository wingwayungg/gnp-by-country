# GNP per person employed
This is a simple website, listing the Gross National Product(GNP) per person employed of each country in the year 2020. The data is taken from [WorldBank](https://data.worldbank.org/indicator/SL.GDP.PCAP.EM.KD?end=2020&view=map). The features of this project include:
  - searching by keywords
  - filtering by range of GDP
  - sorting by name or value of GDP
  - pagination
  - dark mode (upcoming)

## Technical Features
  - **Static-site Generation (SSG)**. GNP data in 2020 is a past record, and is thus static. The data is fetched via WorldBank API, and the site is pre-renderd at build time. The users need not to wait when entering the webpage as the table is already loaded. This techniques also benefit the page for Search Engine Optimization (SEO). While users searchs for this webpage in google, the data rather than the word "No Result" will be displayed on the search result page.

  - **React hook Memoization**. The webpage allows user to search by page and filter by keywords. The last search result is memorized, and when users change pages, the list will not be filtered again.

  - **Pagination**. The search result is recorded in the URL. This enable user to reload, store and share the search result using the URL link.

## Quality Control
Lighthouse serve as an excellent tool to measure and ensure the quality of the webpage. 
<br />
<p align="center"><img width="400" alt="Screenshot 2022-05-23 at 11 20 34 PM" src="https://user-images.githubusercontent.com/82010421/169856518-250b3003-f55d-4579-8a2c-547fdb7d1708.png"></p>


## Programming Languages
The languages I used is React, TypeScript, Scss under Next.js framework. The site is also developed with the help of additional libraries, including Bootstrap, React-Bootstrap and Ramda.

## Deployment
Please visit https://gnp-by-country.wingwayung.com/
