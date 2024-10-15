import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import robotsParser from "robots-parser";

interface JobBoard {
  name: string;
  url: string;
  robotsUrl: string;
  selectors: {
    container: string;
    title: string;
    company: string;
    location: string;
    snippet: string;
    link: string;
  };
}

const jobBoards: JobBoard[] = [
  {
    name: "Indeed",
    url: "https://www.indeed.com/jobs?q={query}&l={location}&sort=date",
    robotsUrl: "https://www.indeed.com/robots.txt",
    selectors: {
      container: ".jobsearch-ResultsList > .job_seen_beacon",
      title: ".jobTitle",
      company: ".companyName",
      location: ".companyLocation",
      snippet: ".job-snippet",
      link: ".jcs-JobTitle",
    },
  },
  {
    name: "Glassdoor",
    url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword={query}&locT=C&locId=1&locKeyword={location}",
    robotsUrl: "https://www.glassdoor.com/robots.txt",
    selectors: {
      container: ".react-job-listing",
      title: ".job-title",
      company: ".employer-name",
      location: ".job-location",
      snippet: ".job-description",
      link: ".jobLink",
    },
  },
  {
    name: "SimplyHired",
    url: "https://www.simplyhired.com/search?q={query}&l={location}",
    robotsUrl: "https://www.simplyhired.com/robots.txt",
    selectors: {
      container: ".SerpJob",
      title: ".card-link",
      company: ".jobposting-company",
      location: ".jobposting-location",
      snippet: ".jobposting-snippet",
      link: ".card-link",
    },
  },
];

async function scrapeJobBoard(
  jobBoard: JobBoard,
  query: string,
  location: string
) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a custom user agent to avoid being blocked
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  const url = jobBoard.url
    .replace("{query}", encodeURIComponent(query))
    .replace("{location}", encodeURIComponent(location || ""));

  console.log(`Fetching ${jobBoard.name} URL:`, url);

  // Check robots.txt
  const robotsTxt = await fetch(jobBoard.robotsUrl).then((res) => res.text());
  const robots = robotsParser(jobBoard.robotsUrl, robotsTxt);

  if (!robots.isAllowed(url)) {
    await browser.close();
    console.log(`URL not allowed by ${jobBoard.name}'s robots.txt`);
    return [];
  }

  await page.goto(url, { waitUntil: "networkidle0" });
  const content = await page.content();
  const $ = cheerio.load(content);

  const jobs: {
    title: string;
    company: string;
    location: string;
    snippet: string;
    link: string;
    source: string;
  }[] = [];

  $(jobBoard.selectors.container).each((i, el) => {
    const title = $(el).find(jobBoard.selectors.title).text().trim();
    const company = $(el).find(jobBoard.selectors.company).text().trim();
    const location = $(el).find(jobBoard.selectors.location).text().trim();
    const snippet = $(el).find(jobBoard.selectors.snippet).text().trim();
    let link = $(el).find(jobBoard.selectors.link).attr("href") || "";

    if (!link.startsWith("http")) {
      link = new URL(link, url).toString();
    }

    jobs.push({
      title,
      company,
      location,
      snippet,
      link,
      source: jobBoard.name,
    });
  });

  await browser.close();

  console.log(`Found ${jobs.length} jobs on ${jobBoard.name}`);
  return jobs;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const location = searchParams.get("location");

  console.log("Multi Job Board API called", { query, location });

  if (!query) {
    return new NextResponse("Missing query parameter", { status: 400 });
  }

  try {
    let allJobs: any[] = [];

    for (const jobBoard of jobBoards) {
      const jobs = await scrapeJobBoard(jobBoard, query, location || "");
      allJobs = allJobs.concat(jobs);

      if (allJobs.length > 0) {
        break; // Stop searching if we found jobs from this board
      }
    }

    console.log(`Found a total of ${allJobs.length} jobs`);

    return NextResponse.json(allJobs);
  } catch (error) {
    console.error("[MULTI_JOB_BOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
