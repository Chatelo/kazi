import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("[APPLICATIONS_GET]", error);
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

    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        jobId,
      },
      include: {
        job: true,
      },
    });

    // Send email notification for job application
    const emailHtml = `
      <h1>Job Application Submitted</h1>
      <p>You have successfully applied for the following job:</p>
      <ul>
        <li>
          <strong>${application.job.title}</strong> at ${application.job.company}<br>
          Location: ${application.job.location}<br>
          <a href="${application.job.url}">View Job</a>
        </li>
      </ul>
      <p>Good luck with your application!</p>
    `;
    await sendEmail(session.user.email, "Job Application Submitted", emailHtml);

    return NextResponse.json(application);
  } catch (error) {
    console.error("[APPLICATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}