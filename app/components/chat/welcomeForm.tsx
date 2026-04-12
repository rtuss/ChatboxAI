"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./FloatingChat.module.css";
import QuickQuestions from "./QuickQuestions";
import ChatMessages from "./ChatMessages";
import { quickQuestions } from "./chat.constants";
import type { ChatStep, Message, DemoFormData, InlineFormType } from "./chat.types";

let database: any = null;
let ref: any = null;
let onValue: any = null;
let push: any = null;

// Lazy load Firebase to prevent build errors
try {
  const firebaseModule = require("@/app/lib/firebase");
  const firebaseDbModule = require("firebase/database");
  database = firebaseModule.database;
  ref = firebaseDbModule.ref;
  onValue = firebaseDbModule.onValue;
  push = firebaseDbModule.push;
} catch (error) {
  console.warn("Firebase not available:", error);
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState<ChatStep>("quickQuestions");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [activeInlineForm, setActiveInlineForm] = useState<InlineFormType>(null);
  const [demoForm, setDemoForm] = useState<DemoFormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    companySize: "",
    note: "",
    agreed: false,
  });
  const [demoFormError, setDemoFormError] = useState("");
  const [demoSubmitSuccess, setDemoSubmitSuccess] = useState("");

  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const getOrCreateSessionId = () => {
    const existing = localStorage.getItem("chat_session_id");

    if (existing) return existing;

    const newId = "sess_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("chat_session_id", newId);
    return newId;
  };

  const areMessagesEqual = (a: Message[], b: Message[]) => {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (
        a[i].role !== b[i].role ||
        a[i].text !== b[i].text ||
        (a[i].timestamp ?? 0) !== (b[i].timestamp ?? 0)
      ) {
        return false;
      }
    }

    return true;
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    const id = getOrCreateSessionId();
    setSessionId(id);
    setCurrentStep("quickQuestions");
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsExpanded(false);
    setMessages([]);
    setCurrentStep("quickQuestions");
    setInputMessage("");
    setIsLoading(false);
    setActiveInlineForm(null);
  };

  const handleToggleExpand = () => setIsExpanded((prev) => !prev);

  const handleDemoFormChange = (field: keyof DemoFormData, value: string | boolean) => {
    setDemoForm((prev) => ({ ...prev, [field]: value }));
    setDemoFormError("");
  };

  const handleDemoFormSubmit = () => {
    if (!demoForm.fullName || !demoForm.email || !demoForm.phone || !demoForm.agreed) {
      setDemoFormError("Vui lòng điền đầy đủ thông tin và đồng ý điều khoản.");
      return;
    }

    setDemoSubmitSuccess("Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm.");

    setTimeout(() => {
      setDemoSubmitSuccess("");
      setDemoForm({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        companySize: "",
        note: "",
        agreed: false,
      });
    }, 3000);
  };

  useEffect(() => {
    if (!sessionId || !database || !ref || !onValue) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const chatRef = ref(database, "nhanhtravel-website/camtu/chats/" + sessionId);

    const unsubscribe = onValue(chatRef, (snapshot: any) => {
      const chatData = snapshot.val();

      if (!chatData) return;

      const chatMessages: Message[] = Object.values(chatData)
        .map((message: any) => ({
          role: message.role,
          text: message.message,
          timestamp: message.timestamp ?? 0,
        }))
        .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

      setMessages((prev) => {
        if (areMessagesEqual(prev, chatMessages)) {
          return prev;
        }
        return chatMessages;
      });

      if (chatMessages.length > 0) {
        setCurrentStep("chatView");
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [sessionId]);

  const normalizeText = (text: string) => text.toLowerCase().trim();

  const quickAnswers: { [key: string]: string } = {
    "nhanh travel là gì":
      "Nhanh Travel là giải pháp quản lý doanh nghiệp du lịch toàn diện, hỗ trợ vận hành, điều hành tour, CRM khách hàng, kế toán, hoa hồng và các ứng dụng dành cho admin, nhân viên và khách hàng.",
    "phù hợp với loại hình nào":
      "Hệ thống phù hợp cho doanh nghiệp lữ hành, đơn vị tổ chức tour, vận hành tour ghép/tour đoàn và các mô hình kinh doanh dịch vụ du lịch cần quản lý khách hàng, điều hành và bán hàng tập trung.",
    "xem giao diện thực tế":
      "Chúng tôi có sẵn các giao diện minh họa cho hệ thống admin, app khách hàng, app nhân viên. Bạn có thể yêu cầu demo hoặc liên hệ tư vấn để xem trực tiếp.",
    "địa chỉ văn phòng ở đâu":
      "Để biết địa chỉ văn phòng chi tiết, bạn vui lòng liên hệ tư vấn hoặc xem mục 'Về chúng tôi' trên website.",
    "quản lý tour ghép/đoàn thế nào":
      "Hệ thống hỗ trợ quản lý tour ghép và tour đoàn, giúp theo dõi điều hành, lịch trình, danh sách khách hàng, chi phí và vận hành tour rõ ràng hơn.",
    "có app cho khách hàng không":
      "Có, Nhanh Travel cung cấp App khách hàng để khách hàng tra cứu hành trình, theo dõi thông tin dịch vụ, booking, ví điện tử, tích điểm và tương tác thuận tiện.",
    "có tính năng kế toán/hoa hồng không":
      "Có, hệ thống hỗ trợ đầy đủ các nghiệp vụ kế toán, theo dõi doanh thu, chi phí, hoa hồng và raporting cho quản lý tài chính.",
    "quản lý công nợ nhà cung cấp":
      "Hệ thống hỗ trợ quản lý nhà cung cấp, theo dõi công nợ, thanh toán, chi phí và đối soát để kiểm soát tài chính tốt hơn.",
    "crm quản lý khách hàng":
      "Nhanh Travel có CRM mạnh mẽ để quản lý khách hàng, theo dõi lịch sử giao dịch, hỗ trợ chăm sóc khách hàng và tối ưu quy trình bán hàng.",
    "bảng giá chi tiết":
      "Để xem bảng giá chi tiết, bạn vui lòng truy cập mục 'Bảng giá' trên website hoặc liên hệ tư vấn để nhận báo giá phù hợp với nhu cầu.",
  };

  const shouldOpenDemoForm = (text: string) => {
    const msg = normalizeText(text);
    return msg.includes("demo") || msg.includes("dùng thử") || msg.includes("liên hệ");
  };

  const shouldUseStaticReply = (text: string) => {
    const msg = normalizeText(text);
    return Object.keys(quickAnswers).some((key) => msg.includes(key));
  };

  const getStaticReply = (text: string) => {
    const msg = normalizeText(text);

    for (const key in quickAnswers) {
      if (msg.includes(key)) {
        return quickAnswers[key];
      }
    }

    return "Em đang hỗ trợ thông tin về Nhanh Travel. Anh/chị có thể hỏi về các tính năng, giải pháp, demo, bảng giá hoặc đăng ký dùng thử.";
  };

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || !sessionId || !database || !ref || !push) return;

    const chatRef = ref(database, "nhanhtravel-website/camtu/chats/" + sessionId);

    const userTimestamp = Date.now();
    const userMessage: Message = {
      role: "user",
      text: trimmed,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentStep("chatView");
    setInputMessage("");
    setActiveInlineForm(null);

    await push(chatRef, {
      role: "user",
      message: trimmed,
      timestamp: userTimestamp,
    });

    setIsLoading(true);

    try {
      let botReply = "";

      if (shouldUseStaticReply(trimmed)) {
        botReply = getStaticReply(trimmed);
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        const data = await res.json();
        botReply =
          data.reply ||
          data.error ||
          "Em đang hỗ trợ thông tin về Nhanh Travel. Anh/chị có thể hỏi về tính năng, giải pháp, demo hoặc bảng giá.";
      }

      const botTimestamp = Date.now();
      const botMessage: Message = {
        role: "bot",
        text: botReply,
        timestamp: botTimestamp,
      };

      setMessages((prev) => [...prev, botMessage]);

      await push(chatRef, {
        role: "bot",
        message: botReply,
        timestamp: botTimestamp,
      });

      if (shouldOpenDemoForm(trimmed)) {
        setActiveInlineForm("demoRequest");
      }
    } catch (error) {
      console.error(error);

      const fallbackReply = "Xin lỗi, hiện tại hệ thống đang bận. Bạn vui lòng thử lại sau nhé!";
      const botTimestamp = Date.now();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: fallbackReply,
          timestamp: botTimestamp,
        },
      ]);

      await push(chatRef, {
        role: "bot",
        message: fallbackReply,
        timestamp: botTimestamp,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isLoading, activeInlineForm]);

  return (
    <div>
      {isOpen ? (
        <div className={`${styles.chatBox} ${isExpanded ? styles.chatBoxExpanded : ""}`}>
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <Image src="/images/Home/chatbot-icon.png" alt="Bot" width={20} height={20} />
              <Image src="/images/Home/logo1.png" alt="Nhanh Travel" width={120} height={24} />
            </div>
            <div className={styles.headerActions}>
              <button onClick={handleToggleExpand} className={styles.expandButton}>
                {isExpanded ? "↙" : "↗"}
              </button>
              <button onClick={handleCloseChat} className={styles.closeButton}>
                ✕
              </button>
            </div>
          </div>

          <div className={styles.chatBody} ref={chatBodyRef}>
            {currentStep === "quickQuestions" && (
              <QuickQuestions
                questions={quickQuestions}
                onAsk={handleSendMessage}
                disabled={isLoading}
              />
            )}

            {currentStep === "chatView" && (
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                activeInlineForm={activeInlineForm}
                demoForm={demoForm}
                demoFormError={demoFormError}
                demoSubmitSuccess={demoSubmitSuccess}
                onDemoFormChange={handleDemoFormChange}
                onDemoFormSubmit={handleDemoFormSubmit}
              />
            )}
          </div>

          <div className={styles.chatFooter}>
            <div className={styles.composerBar}>
              <button type="button" className={styles.plusButton} aria-label="Thêm">
                +
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage(inputMessage);
                  }
                }}
                placeholder="Nhập tin nhắn của bạn"
                disabled={isLoading}
                className={styles.chatInput}
              />

              <button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={isLoading || !inputMessage.trim()}
                className={styles.sendButton}
                aria-label="Gửi tin nhắn"
                type="button"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleOpenChat}
          className={styles.floatingButton}
          style={{ display: "flex" }}
        >
          <Image
            src="/images/Home/chatbot-icon.png"
            alt="Chat"
            width={72}
            height={72}
            className={styles.floatingImage}
            priority
          />
        </button>
      )}
    </div>
  );
}