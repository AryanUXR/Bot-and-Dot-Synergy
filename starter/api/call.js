// Vercel: serves POST /api/call
import { handleCall } from "./_lib/call.js";
export async function POST(request) { return handleCall(request, process.env); }
