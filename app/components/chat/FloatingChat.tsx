"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./FloatingChat.module.css";
import QuickQuestions from "./QuickQuestions";
import ChatMessages from "./ChatMessages";
import { quickQuestions } from "./chat.constants";
import type { ChatStep, Message, DemoFormData, InlineFormType } from "./chat.types";

type StaticMatchResult = {
  matched: boolean;
  reply: string;
};

const QUICK_ANSWERS: Record<string, string> = {
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
    "Có, hệ thống hỗ trợ đầy đủ các nghiệp vụ kế toán, theo dõi doanh thu, chi phí, hoa hồng và reporting cho quản lý tài chính.",
  "quản lý công nợ nhà cung cấp":
    "Hệ thống hỗ trợ quản lý nhà cung cấp, theo dõi công nợ, thanh toán, chi phí và đối soát để kiểm soát tài chính tốt hơn.",
  "crm quản lý khách hàng":
    "Nhanh Travel có CRM mạnh mẽ để quản lý khách hàng, theo dõi lịch sử giao dịch, hỗ trợ chăm sóc khách hàng và tối ưu quy trình bán hàng.",
  "bảng giá chi tiết":
    "Để xem bảng giá chi tiết, bạn vui lòng truy cập mục 'Bảng giá' trên website hoặc liên hệ tư vấn để nhận báo giá phù hợp với nhu cầu.",
};

let cachedFirebase:
  | {
      database: any;
      ref: any;
      push: any;
      get: any;
    }
  | null = null;

function getFirebaseModules() {
  if (cachedFirebase) return cachedFirebase;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const firebaseModule = require("@/app/lib/firebase");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const firebaseDbModule = require("firebase/database");

    cachedFirebase = {
      database: firebaseModule.database,
      ref: firebaseDbModule.ref,
      push: firebaseDbModule.push,
      get: firebaseDbModule.get,
    };

    return cachedFirebase;
  } catch (error) {
    console.warn("Firebase not available:", error);
    return null;
  }
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[?.!,]/g, "")
    .replace(/\s+/g, " ");
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function shouldOpenDemoForm(text: string) {
  const msg = normalizeText(text);

  return includesAny(msg, [
    "demo",
    "dang ky demo",
    "dang ky dung thu",
    "dung thu",
    "dung thu 15 ngay",
    "dung thu mien phi",
    "tu van demo",
    "xem demo",
    "lam sao de dang ky dung thu",
    "lien he tu van",
  ]);
}

function getStaticReply(text: string): StaticMatchResult {
  const msg = normalizeText(text);

  if (
    includesAny(msg, [
      "nhanh travel la gi",
      "nhanhtravel la gi",
      "nhanh travel lam gi",
      "nhanh travel lam ve gi",
    ])
  ) {
    return { matched: true, reply: QUICK_ANSWERS["nhanh travel là gì"] };
  }

  if (
    includesAny(msg, [
      "phu hop voi loai hinh nao",
      "phu hop voi ai",
      "danh cho ai",
      "doi tuong su dung",
    ])
  ) {
    return { matched: true, reply: QUICK_ANSWERS["phù hợp với loại hình nào"] };
  }

  if (includesAny(msg, ["xem giao dien", "giao dien thuc te", "demo giao dien"])) {
    return { matched: true, reply: QUICK_ANSWERS["xem giao diện thực tế"] };
  }

  if (includesAny(msg, ["dia chi van phong", "van phong o dau", "dia chi o dau"])) {
    return { matched: true, reply: QUICK_ANSWERS["địa chỉ văn phòng ở đâu"] };
  }

  if (includesAny(msg, ["tour ghep", "tour doan", "quan ly tour"])) {
    return { matched: true, reply: QUICK_ANSWERS["quản lý tour ghép/đoàn thế nào"] };
  }

  if (msg.includes("app") && includesAny(msg, ["khach", "khach hang"])) {
    return { matched: true, reply: QUICK_ANSWERS["có app cho khách hàng không"] };
  }

  if (msg.includes("app") && includesAny(msg, ["admin", "quan tri", "quan ly"])) {
    return {
      matched: true,
      reply:
        "Có, Nhanh Travel cung cấp web quản trị cho admin và các công cụ quản lý giúp theo dõi vận hành, khách hàng, tour, doanh thu và hoạt động doanh nghiệp du lịch.",
    };
  }

  if (includesAny(msg, ["ke toan", "hoa hong", "doanh thu", "chi phi"])) {
    return { matched: true, reply: QUICK_ANSWERS["có tính năng kế toán/hoa hồng không"] };
  }

  if (includesAny(msg, ["cong no", "nha cung cap", "doi soat"])) {
    return { matched: true, reply: QUICK_ANSWERS["quản lý công nợ nhà cung cấp"] };
  }

  if (includesAny(msg, ["crm", "quan ly khach hang", "cham soc khach hang"])) {
    return { matched: true, reply: QUICK_ANSWERS["crm quản lý khách hàng"] };
  }

  if (includesAny(msg, ["bang gia", "gia chi tiet", "bao gia", "chi phi"])) {
    return { matched: true, reply: QUICK_ANSWERS["bảng giá chi tiết"] };
  }

  if (shouldOpenDemoForm(msg)) {
    return {
      matched: true,
      reply: "Vui lòng điền những thông tin dưới đây để đội ngũ Nhanh Travel hỗ trợ demo hoặc dùng thử phù hợp với nhu cầu của anh/chị.",
    };
  }

  return { matched: false, reply: "" };
}

function areMessagesEqual(a: Message[], b: Message[]) {
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
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState<ChatStep>("quickQuestions");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queuedQuestion, setQueuedQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  const isSendingRef = useRef(false);

  const getOrCreateSessionId = () => {
    const existing = localStorage.getItem("chat_session_id");
    if (existing) return existing;

    const newId = "sess_" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("chat_session_id", newId);
    return newId;
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    const id = getOrCreateSessionId();
    setSessionId(id);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsExpanded(false);
    setInputMessage("");
    setQueuedQuestion(null);
    setIsLoading(false);
    setActiveInlineForm(null);
    setDemoFormError("");
    setDemoSubmitSuccess("");
    isSendingRef.current = false;
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleDemoFormChange = (field: keyof DemoFormData, value: string | boolean) => {
    setDemoForm((prev) => ({ ...prev, [field]: value }));
    setDemoFormError("");
  };

  const handleDemoFormSubmit = () => {
    if (
      !demoForm.fullName.trim() ||
      !demoForm.email.trim() ||
      !demoForm.phone.trim() ||
      !demoForm.company.trim() ||
      !demoForm.service.trim()
    ) {
      setDemoFormError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (!demoForm.agreed) {
      setDemoFormError("Vui lòng đồng ý điều khoản để tiếp tục.");
      return;
    }

    setDemoFormError("");
    setDemoSubmitSuccess(
      "Cảm ơn anh/chị! Nhanh Travel đã ghi nhận thông tin và sẽ liên hệ tư vấn sớm."
    );

    setTimeout(() => {
      setDemoSubmitSuccess("");
    }, 4000);
  };

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    let cancelled = false;

    const loadHistory = async () => {
      const firebase = getFirebaseModules();
      if (!firebase?.database || !firebase?.ref || !firebase?.get) return;

      try {
        const chatRef = firebase.ref(
          firebase.database,
          "nhanhtravel-website/camtu/chats/" + sessionId
        );

        const snapshot = await firebase.get(chatRef);
        if (cancelled) return;

        const chatData = snapshot.val();

        if (!chatData) {
          setMessages((prev) => (prev.length === 0 ? prev : []));
          setCurrentStep("quickQuestions");
          return;
        }

        const chatMessages: Message[] = Object.values(chatData)
          .map((message: any) => ({
            role: message.role,
            text: message.message,
            timestamp: message.timestamp ?? 0,
          }))
          .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

        setMessages((prev) => {
          if (areMessagesEqual(prev, chatMessages)) return prev;
          return chatMessages;
        });

        if (chatMessages.length > 0) {
          setCurrentStep("chatView");
        } else {
          setCurrentStep("quickQuestions");
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [isOpen, sessionId]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !sessionId || isSendingRef.current) return;

    const firebase = getFirebaseModules();
    if (!firebase?.database || !firebase?.ref || !firebase?.push) return;

    isSendingRef.current = true;
    setIsLoading(true);
    setActiveInlineForm(null);
    setDemoFormError("");
    setDemoSubmitSuccess("");

    const chatRef = firebase.ref(
      firebase.database,
      "nhanhtravel-website/camtu/chats/" + sessionId
    );

    const userTimestamp = Date.now();
    const userMessage: Message = {
      role: "user",
      text: trimmed,
      timestamp: userTimestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setCurrentStep("chatView");

    try {
      await firebase.push(chatRef, {
        role: "user",
        message: trimmed,
        timestamp: userTimestamp,
      });

      const staticResult = getStaticReply(trimmed);
      let botReply = "";

      if (staticResult.matched) {
        botReply = staticResult.reply;
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
          "Xin lỗi, hiện tại tôi chưa thể trả lời. Anh/chị vui lòng thử lại sau.";
      }

      const botTimestamp = Date.now();
      const botMessage: Message = {
        role: "bot",
        text: botReply,
        timestamp: botTimestamp,
      };

      setMessages((prev) => [...prev, botMessage]);

      await firebase.push(chatRef, {
        role: "bot",
        message: botReply,
        timestamp: botTimestamp,
      });

      if (shouldOpenDemoForm(trimmed)) {
        setActiveInlineForm("demoRequest");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const fallbackReply =
        "Xin lỗi, hiện tại hệ thống đang bận. Anh/chị vui lòng thử lại sau nhé!";
      const botTimestamp = Date.now();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: fallbackReply,
          timestamp: botTimestamp,
        },
      ]);

      try {
        await firebase.push(chatRef, {
          role: "bot",
          message: fallbackReply,
          timestamp: botTimestamp,
        });
      } catch (pushError) {
        console.error("Error pushing fallback message:", pushError);
      }
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  };

  const handleQuickQuestionAsk = (question: string) => {
    if (isLoading || isSendingRef.current) return;
    setQueuedQuestion(question);
  };

  useEffect(() => {
    if (!queuedQuestion) return;
    if (!sessionId || isLoading || isSendingRef.current) return;

    void handleSendMessage(queuedQuestion);
    setQueuedQuestion(null);
  }, [queuedQuestion, sessionId, isLoading]);

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
                onAsk={handleQuickQuestionAsk}
                disabled={isLoading}
              />
            )}

            {currentStep === "chatView" && (
              <>
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

                <QuickQuestions
                  questions={quickQuestions}
                  onAsk={handleQuickQuestionAsk}
                  disabled={isLoading}
                  compact={true}
                />
              </>
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
                    void handleSendMessage(inputMessage);
                  }
                }}
                placeholder="Nhập tin nhắn của bạn"
                disabled={isLoading}
                className={styles.chatInput}
              />

              <button
                type="button"
                onClick={() => void handleSendMessage(inputMessage)}
                disabled={isLoading || !inputMessage.trim()}
                className={styles.sendButton}
                aria-label="Gửi tin nhắn"
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