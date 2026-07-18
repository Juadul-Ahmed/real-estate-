import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/validate";
import { ChatMessage } from "../models/chat.model";

const systemPrompt = `You are EstateHub AI, a helpful assistant for a real estate platform called EstateHub.

Application context:
- EstateHub connects buyers, brokers, and admins.
- Buyers can browse listings (rent/sale), save favorites, and send inquiries.
- Brokers can create listings, manage inquiries, and view stats.
- Admins approve listings, manage users, and oversee the platform.
- Listings have types: rent or sale, with categories like Apartment, Villa, Office, Land, etc.
- Users authenticate via email/password.

Guidelines:
- Be concise and helpful.
- Guide users to the right pages: /listings (browse), /register (sign up), /login (sign in), /buyer (buyer dashboard), /broker (broker dashboard), /admin (admin dashboard).
- For property questions, suggest filters or browsing.
- If you don't know something specific about the data, suggest how the user can find it on the platform.
- Do not make up property details.`;

function generateLocalResponse(message: string, user?: { id: string; role: string }): string {
  const lower = message.toLowerCase();
  const roleContext = user ? `Current user role: ${user.role}.` : "User is not authenticated.";

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hello! I'm EstateHub AI. ${roleContext} How can I help you today? You can ask me about listings, how to sign up, or how to use the platform.`;
  }

  if (lower.includes("list") || lower.includes("add property") || lower.includes("publish")) {
    if (user?.role === "broker" || user?.role === "admin") {
      return "To list a property, go to your broker dashboard at /broker and click 'Add Property'. Fill in the details and submit for admin approval.";
    }
    return "Brokers can list properties from their dashboard at /broker. If you're a buyer, you can browse listings at /listings or sign up as a broker at /register.";
  }

  if (lower.includes("browse") || lower.includes("search") || lower.includes("find") || lower.includes("property")) {
    return "You can browse all approved listings at /listings. Use filters for type (rent/sale), city, category, price range, and bedrooms to find exactly what you need.";
  }

  if (lower.includes("rent") || lower.includes("apartment")) {
    return "We have many rental listings. Visit /listings and select 'Rent' as the type, or filter by categories like Apartment, Villa, or Office.";
  }

  if (lower.includes("buy") || lower.includes("sale") || lower.includes("purchase")) {
    return "For properties for sale, head to /listings and choose the 'Sale' type. You can filter by price, location, and category.";
  }

  if (lower.includes("contact") || lower.includes("message") || lower.includes("broker") || lower.includes("inquiry")) {
    return "You can contact brokers directly through the inquiry form on any property page. Just click 'Send Inquiry' on the listing you're interested in.";
  }

  if (lower.includes("sign up") || lower.includes("register") || lower.includes("create account")) {
    return "You can create an account at /register. Choose your role: Buyer, Broker, or Admin. Brokers require admin approval before accessing the dashboard.";
  }

  if (lower.includes("login") || lower.includes("sign in") || lower.includes("log in")) {
    return "If you already have an account, sign in at /login. Use the email and password you registered with.";
  }

  if (lower.includes("dashboard") || lower.includes("my space")) {
    if (user?.role === "buyer") return "Your buyer dashboard is at /buyer. There you can view favorites, inquiries, and saved properties.";
    if (user?.role === "broker") return "Your broker dashboard is at /broker. Manage listings, track inquiries, and view stats there.";
    if (user?.role === "admin") return "The admin dashboard is at /admin. Approve listings, manage users, and monitor platform activity.";
    return "After logging in, you'll be redirected to your dashboard based on your role: /buyer, /broker, or /admin.";
  }

  if (lower.includes("favorite") || lower.includes("save") || lower.includes("wishlist")) {
    return "As a buyer, you can save properties to your favorites. Click the heart icon on any listing, and find them all in your buyer dashboard at /buyer.";
  }

  if (lower.includes("price") || lower.includes("cost") || lower.includes("expensive")) {
    return "Prices vary by property. Use the price filters on /listings to find properties within your budget. You can set min and max price ranges.";
  }

  if (lower.includes("category") || lower.includes("type")) {
    return "EstateHub supports categories like Apartment, Villa, Office, and Land. Types are Rent or Sale. Filter by both on the /listings page.";
  }

  if (lower.includes("approve") || lower.includes("pending") || lower.includes("admin")) {
    if (user?.role === "admin") return "As an admin, you can approve or reject listings from the admin dashboard at /admin. Pending listings await your review.";
    return "Admins review and approve new listings. Brokers will see their listing status update once approved.";
  }

  if (lower.includes("thank")) {
    return "You're welcome! Let me know if you need anything else.";
  }

  const generic = `I understand you're asking about "${message}". `;
  if (!user) {
    return generic + "To get personalized help, please sign up or log in. Otherwise, try browsing listings at /listings or learn more at /register.";
  }
  return generic + `You're signed in as a ${user.role}. Try visiting your dashboard at /${user.role} or browse listings at /listings.`;
}

export const chatStream = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { message, sessionId } = req.body as { message: string; sessionId: string };
  if (!message || !sessionId) {
    res.status(400).json({ message: "message and sessionId are required" });
    return;
  }

  const user = req.user;
  await ChatMessage.create({ sessionId, role: "user", text: message });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const responseText = generateLocalResponse(message, user);
    const words = responseText.split(" ");

    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? "" : " ") + words[i];
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
    }

    await ChatMessage.create({ sessionId, role: "assistant", text: responseText });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    console.error("Chat stream error:", err);
    res.write(`data: ${JSON.stringify({ text: "Sorry, something went wrong. Please try again." })}\n\n`);
  } finally {
    res.end();
  }
});

export const getChatHistory = asyncHandler(async (req: any, res: Response) => {
  const { sessionId } = req.query as { sessionId: string };
  if (!sessionId) {
    res.status(400).json({ message: "sessionId is required" });
    return;
  }
  const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();
  res.json({ messages });
});
