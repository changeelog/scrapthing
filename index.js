const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const config = {
  searchQueries: ['земельное право "принципы" filetype:pdf'],
  maxPages: 3,
  allowedDomains: [".ru", ".by"],
  searchEngine: "Google",
  concurrency: 5,
  logFilePrefix: "scraping",
};

function isAllowedDomain(url) {
  return config.allowedDomains.some((domain) => url.includes(domain));
}

function getFileTypeParam() {
  return config.searchEngine === "Google" ? "filetype" : "mime";
}

function createLogFile() {
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  return `${config.logFilePrefix}_${timestamp}.log`;
}

function logToFile(message, error = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] ${message}\n`;
  if (error) {
    logMessage += `Error details: ${error.message}\n`;
    logMessage += `Error stack trace: ${error.stack}\n`;
  }
  fs.appendFileSync(config.logFile, logMessage);
}

function sanitizeDirectoryName(name) {
  return name.replace(/[<>:"/\\|?*\s]/g, "_");
}

function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

async function scrapeSearchResults(query, browser) {
  const page = await browser.newPage();
  const directory = path.join(__dirname, sanitizeDirectoryName(query));
  createDirectory(directory);

  for (let i = 0; i < config.maxPages; i++) {
    const url =
      config.searchEngine === "Google"
        ? `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${
            i * 10
          }`
        : `https://yandex.ru/search/?text=${encodeURIComponent(query)}&p=${i}`;

    await page.goto(url, { waitUntil: "networkidle0" });

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a"))
        .map((a) => a.href)
        .filter((href) => href && href.includes(".pdf"));
    });

    for (const link of links) {
      if (isAllowedDomain(link)) {
        const filename = decodeURIComponent(link.split("/").pop());
        const filePath = path.join(directory, filename);

        try {
          const pdfPage = await browser.newPage();
          await pdfPage.goto(link, { waitUntil: "networkidle0" });
          const pdf = await pdfPage.pdf({ format: "A4" });
          fs.writeFileSync(filePath, pdf);
          console.log(`Downloaded: ${filename}`);
          logToFile(`Downloaded: ${filename} from ${link}`);
          await pdfPage.close();
        } catch (error) {
          console.error(`Error downloading ${link}: ${error.message}`);
          logToFile(`Error downloading ${link}`, error);
        }
      }
    }
  }

  await page.close();
}

async function main() {
  config.logFile = createLogFile();
  const browser = await puppeteer.launch();

  const fileTypeParam = getFileTypeParam();
  const updatedQueries = config.searchQueries.map((query) =>
    query.replace("filetype", fileTypeParam)
  );

  const chunks = chunkArray(updatedQueries, config.concurrency);

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map((query) => scrapeSearchResults(query, browser))
    );
  }

  await browser.close();
}

function chunkArray(array, size) {
  const chunkedArray = [];
  let index = 0;
  while (index < array.length) {
    chunkedArray.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArray;
}

main().catch((error) => {
  console.error(error);
  logToFile(`Error: ${error.message}`, error);
});
