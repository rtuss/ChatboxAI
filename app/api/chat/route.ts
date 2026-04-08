import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "Thiếu GEMINI_API_KEY trong file .env.local" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Thiếu nội dung câu hỏi." },
        { status: 400 }
      );
    }

    const prompt = `
Bạn là chatbot tư vấn của Nhanh Travel.
Chỉ trả lời các câu hỏi liên quan đến sản phẩm, tính năng, demo, bảng giá, CRM, app khách hàng, tour ghép/đoàn, kế toán, hoa hồng, nhà cung cấp, công nợ và giải pháp quản lý du lịch của công ty.
Nếu câu hỏi ngoài phạm vi công ty, hãy từ chối lịch sự và hướng người dùng quay lại các chủ đề của công ty.
Hãy trả lời ngắn gọn, rõ ràng, thân thiện, bằng tiếng Việt.
Nếu chưa có thông tin chính xác thì nói rõ rằng đội ngũ tư vấn sẽ hỗ trợ thêm, không tự bịa thông tin.

Câu hỏi của khách: ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      reply: response.text || "Xin lỗi, hiện tại tôi chưa thể trả lời.",
    });
  } catch (error: any) {
    console.error("Gemini API full error:", error);
    console.error("Gemini API status:", error?.status);
    console.error("Gemini API message:", error?.message);

    const readableError =
      error?.status === 503
        ? "Hệ thống AI đang quá tải tạm thời. Anh chị vui lòng thử lại sau ít phút."
        : error?.message || "Có lỗi khi gọi Gemini API.";

    return NextResponse.json(
      { error: readableError, status: error?.status || 500 },
      { status: 500 }
    );
  }
}