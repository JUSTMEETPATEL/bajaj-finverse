import { NextRequest, NextResponse } from "next/server";
import { processBfhl } from "@/services/bfhl.service";

export const runtime = "edge";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { operation_code: 1 },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json(
        { error: "Invalid request: 'data' must be an array of strings" },
        { status: 400, headers: corsHeaders }
      );
    }

    const userId = process.env.USER_ID ?? "";
    const emailId = process.env.EMAIL_ID ?? "";
    const rollNumber = process.env.ROLL_NUMBER ?? "";

    const result = processBfhl(body.data, userId, emailId, rollNumber);

    return NextResponse.json(result, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders }
    );
  }
}
