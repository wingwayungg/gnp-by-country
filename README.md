# GNP per person employed
This is a simple website, listing the Gross National Product(GNP) per person employed of each country in the year 2020. The data is taken from [WorldBank](https://data.worldbank.org/indicator/SL.GDP.PCAP.EM.KD?end=2020&view=map). This webpage has two main purposes. First, the CNP per capita is widely discussed around the world, while the data of GNP per person employed is often overlooked. Second, this project serves as an exercise to practice my favourite framework - Next.js! The features of this project include:
  - searching by keywords
  - filtering by GNP
  - sorting by name or value of GNP
  - pagination
  - dark mode (upcoming)

## Technical Features
  - **Pre-rendering**. The GNP figures in 2020 are a past record, and are therefore static. The data is firstly pre-fetched using WorldBank API at build time. The users need not wait for fetching the data when entering the webpage as the page storing the data is already pre-rendered. Furthermore, as the data is fetched, all the navigation, such as searching by country name or going to next/previous pagination, is done on client side to avoid unnecessary API call.

  - **Pagination**. The search results are recorded in the URL. This enables users to reload, store and share the search results using URL links.

  - **React hook Memoization**. This page provides lots of tools for users to inspect the data, like sorting, pagination, searching by country name and GNP data. When using these tools, there are some operations that involves less computation costs using the following useMemo trick: The current search result list is stored as React state and memorized. For example, when users change pages by clicking the next pagination items, instead of sorting or filtering the entire data again, the new result could be retrieved by returning a different index from the current memorized search result list. 

  - **Form Optimization**. An external library react-hook-form is used to optimize the form performance. The form is built with uncontrolled components and does not re-render when the user types in the input fields.

## Quality Control
Lighthouse serve as an excellent tool to measure and ensure the quality of the webpage. 
<br />
<p align="center"><img width="556" alt="Screenshot 2024-03-20 at 11 34 43 AM" src="https://github.com/wingwayungg/gnp-by-country/assets/82010421/49ceaf4e-6f83-48d5-a168-3577b3dc29ec"></p>



## Programming Languages
The languages I used is React, TypeScript, Scss under Next.js framework. The site is also developed with the help of additional libraries including Bootstrap, React-Bootstrap, React-hook-form and Ramda.

## Deployment
Please visit https://gnp-by-country.wingwayung.com/
