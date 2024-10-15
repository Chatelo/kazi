import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendEmail } from "@/lib/email";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json(savedJobs);
  } catch (error) {
    console.error("[SAVED_JOBS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { jobId } = body;

    const savedJob = await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        jobId,
      },
      include: {
        job: true,
      },
    });

    // Send email notification for saved job
    const emailHtml = `
      <h1>Job Saved</h1>
      <p>You have successfully saved a new job:</p>
      <ul>
        <li>
          <strong>${savedJob.job.title}</strong> at ${savedJob.job.company}<br>
          Location: ${savedJob.job.location}<br>
          <a href="${savedJob.job.url}">View Job</a>
        </li>
      </ul>
    `;
    await sendEmail(session.user.email, "Job Saved", emailHtml);

    return NextResponse.json(savedJob);
  } catch (error) {
    console.error("[SAVED_JOBS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
