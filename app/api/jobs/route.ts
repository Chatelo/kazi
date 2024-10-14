import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const location = searchParams.get("location");
  const jobType = searchParams.get("jobType");
  const salaryMin = searchParams.get("salaryMin");
  const salaryMax = searchParams.get("salaryMax");

  try {
    const jobs = await prisma.job.findMany({
      where: {
        title: {
          contains: query || undefined,
          mode: "insensitive",
        },
        location: {
          contains: location || undefined,
          mode: "insensitive",
        },
        jobType: jobType || undefined,
        salary: {
          gte: salaryMin ? parseInt(salaryMin) : undefined,
          lte: salaryMax ? parseInt(salaryMax) : undefined,
        },
      },
      orderBy: {
        postedAt: "desc",
      },
    });

    // Send email notifications for new job matches
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      const newJobs = jobs.filter(
        (job) => job.postedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      if (newJobs.length > 0) {
        const emailHtml = `
          <h1>New Job Matches</h1>
          <p>We found ${
            newJobs.length
          } new job(s) that match your search criteria:</p>
          <ul>
            ${newJobs
              .map(
                (job) => `
              <li>
                <strong>${job.title}</strong> at ${job.company}<br>
                Location: ${job.location}<br>
                <a href="${job.url}">View Job</a>
              </li>
            `
              )
              .join("")}
          </ul>
        `;
        await sendEmail(session.user.email, "New Job Matches", emailHtml);
      }
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("[JOBS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// ... (rest of the file remains unchanged)
