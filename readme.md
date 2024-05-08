# PDF Scraper

PDF Scraper is a Node.js script that downloads PDF files from search engine results. It uses the Puppeteer library to automate web browsing and scrape PDF links from Google or Yandex search results.

## Features

- Search for PDF files based on specified queries
- Limit the number of search result pages to scrape
- Filter results by allowed domains
- Support for Google and Yandex search engines
- Concurrent scraping with configurable concurrency level
- Log file generation for tracking downloads and errors
- Create separate directories for each search query

## Installation

1. Clone the repository:

```bash
git clone https://github.com/changeelog/scrapthing.git
```

2. Navigate to the project directory:

```bash
cd scrapthing
```

3. Install all dependencies:

```bash
npm install
```

## Configuration

The script can be configured by modifying the config object in the code. Here are the available options:

- `searchQueries`: An array of search queries to use for finding PDF files.
- `maxPages`: The maximum number of search result pages to scrape for each query.
- `allowedDomains`: An array of allowed domains to filter the PDF links.
- `searchEngine`: The search engine to use, either "Google" or "Yandex".
- `concurrency`: The number of concurrent scraping processes to run.
- `logFilePrefix`: The prefix for the log file name.

## Usage

1. Configure the script by modifying the config object in the code.
2. Run the script.

```bash
node index.js
```

The script will start scraping the search results based on the provided queries and configurations. Downloaded PDF files will be saved in separate directories named after the search queries. A log file will be generated with the specified prefix, containing information about downloaded files and any errors that occurred during the scraping process.

## API

The script does not currently have an API. It is designed to be run as a standalone Node.js script.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

[Puppeteer](https://github.com/puppeteer/puppeteer) - The library used for web automation and scraping.
[Node.js](https://nodejs.org/) - The JavaScript runtime used for the script.
