import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { companyKnowledge } from "@/app/lib/nhanhtravel-knowledge";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("OPENAI_API_KEY is missing");
      return NextResponse.json(
        { error: "Thiếu OPENAI_API_KEY trong file .env.local" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Thiếu nội dung câu hỏi." },
        { status: 400 }
      );
    }

    const systemPrompt = `
Bạn là chatbot tư vấn chính thức của Nhanh Travel.

Dưới đây là thông tin nội bộ của công ty:

${companyKnowledge}

Quy tắc trả lời:
- Chỉ được trả lời dựa trên thông tin ở trên.
- Không được tự bịa thêm thông tin.
- Nếu câu hỏi không liên quan đến công ty, hãy trả lời:
  "Xin lỗi, tôi chỉ hỗ trợ các câu hỏi liên quan đến Nhanh Travel."
- Nếu câu hỏi có liên quan nhưng chưa có đủ dữ liệu chi tiết, hãy trả lời:
  "Thông tin này cần đội ngũ tư vấn của Nhanh Travel hỗ trợ chi tiết hơn. Anh/chị vui lòng để lại nhu cầu để được hỗ trợ thêm."
- Trả lời ngắn gọn, rõ ràng, thân thiện, bằng tiếng Việt.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.2,
    });

    const reply =
      response.choices[0]?.message?.content ||
      "Xin lỗi, hiện tại tôi chưa thể trả lời.";

    return NextResponse.json({
      reply,
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    console.error("OpenAI API status:", error?.status);
    console.error("OpenAI API message:", error?.message);

    const readableError =
      error?.status === 429
        ? "Hệ thống AI đang quá tải tạm thời. Anh chị vui lòng thử lại sau ít phút."
        : error?.message || "Có lỗi khi gọi OpenAI API.";

    return NextResponse.json(
      { error: readableError, status: error?.status || 500 },
      { status: 500 }
    );
  }
}