import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import robotsParser from "robots-parser";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const location = searchParams.get("location");

  console.log("Web jobs API called", { query, location });

  if (!query) {
    return new NextResponse("Missing query parameter", { status: 400 });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Example: Scraping Indeed (replace with actual job board URL)
    const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(
      query
    )}&l=${encodeURIComponent(location || "")}`;

    console.log("Fetching URL:", url);

    // Check robots.txt
    const robotsTxt = await fetch("https://www.indeed.com/robots.txt").then(
      (res) => res.text()
    );
    const robots = robotsParser("https://www.indeed.com/robots.txt", robotsTxt);

    if (!robots.isAllowed(url)) {
      await browser.close();
      console.log("URL not allowed by robots.txt");
      return new NextResponse(
        "Access to this page is not allowed by robots.txt",
        { status: 403 }
      );
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
    }[] = [];

    // Example: Parse job listings (adjust selectors based on the actual structure)
    $(".jobsearch-ResultsList > div").each((i, el) => {
      const title = $(el).find(".jobTitle").text().trim();
      const company = $(el).find(".companyName").text().trim();
      const location = $(el).find(".companyLocation").text().trim();
      const snippet = $(el).find(".job-snippet").text().trim();
      const link = "https://www.indeed.com" + $(el).find("a").attr("href");

      jobs.push({ title, company, location, snippet, link });
    });

    await browser.close();

    console.log(`Found ${jobs.length} jobs`);

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("[WEB_JOBS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
