// Netlify: serves POST /api/call
import { handleCall } from "../../api/_lib/call.js";
export default async (request) => handleCall(request, process.env);
export const config = { path: "/api/call" };
