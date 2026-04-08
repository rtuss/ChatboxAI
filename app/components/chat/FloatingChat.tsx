"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./FloatingChat.module.css";
import WelcomeForm from "./welcomeForm";
import QuickQuestions from "./QuickQuestions";
import ChatMessages from "./ChatMessages";
import { quickQuestions } from "./chat.constants";
import type { ChatStep, Message, DemoFormData, InlineFormType } from "./chat.types";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); /* Quản lý phóng to thu nhỏ */
  const [currentStep, setCurrentStep] = useState<ChatStep>("welcomeForm");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
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

  const handleOpenChat = () => {
    setIsOpen(true);
  };

/* Khi đóng chat reset luôn trạng thái mở rộng */
  const handleCloseChat = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  /*  Thêm hàm toggle để phóng to thu nhỏ chat */
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleDemoFormChange = (field: keyof DemoFormData, value: string | boolean) => {
    setDemoForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const isValidPhone = (value: string) => {
    const phoneRegex = /^[0-9]{9,11}$/;
    return phoneRegex.test(value);
  };

  const handleStart = () => {
    const nameTrimmed = fullName.trim();
    const phoneTrimmed = phone.trim();

    if (!nameTrimmed || !phoneTrimmed) {
      setErrorMessage("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }

    if (!isValidPhone(phoneTrimmed)) {
      setErrorMessage("Số điện thoại chưa đúng định dạng.");
      return;
    }

    setErrorMessage("");
    setCurrentStep("quickQuestions");
  };

  const normalizeText = (text: string) => text.toLowerCase().trim();

  const shouldOpenDemoForm = (text: string) => {
    const msg = normalizeText(text);

    return (
      msg.includes("demo") ||
      msg.includes("dùng thử") ||
      msg.includes("đăng ký dùng thử") ||
      msg.includes("xem giao diện") ||
      msg.includes("tư vấn") ||
      msg.includes("liên hệ")
    );
  };

  const shouldUseStaticReply = (text: string) => {
    const msg = normalizeText(text);

    return (
      msg.includes("nhanh travel là gì") ||
      msg.includes("phù hợp với loại hình nào") ||
      msg.includes("app khách hàng") ||
      msg.includes("kế toán") ||
      msg.includes("hoa hồng") ||
      msg.includes("crm") ||
      msg.includes("công nợ") ||
      msg.includes("nhà cung cấp") ||
      msg.includes("tour ghép") ||
      msg.includes("tour đoàn")
    );
  };

  const isOutOfScope = (text: string) => {
    const msg = normalizeText(text);

    const inScopeKeywords = [
      "nhanh travel",
      "crm",
      "tour",
      "demo",
      "dùng thử",
      "bảng giá",
      "báo giá",
      "app khách hàng",
      "app admin",
      "app nhân viên",
      "kế toán",
      "hoa hồng",
      "công nợ",
      "nhà cung cấp",
      "điều hành",
      "khách hàng",
      "lữ hành",
    ];

    return !inScopeKeywords.some((keyword) => msg.includes(keyword));
  };

  const getStaticReply = (text: string) => {
    const msg = normalizeText(text);

    if (msg.includes("nhanh travel là gì")) {
      return "Nhanh Travel là giải pháp quản lý doanh nghiệp du lịch, hỗ trợ vận hành, điều hành tour, CRM khách hàng, kế toán, hoa hồng và các ứng dụng dành cho admin, nhân viên và khách hàng.";
    }

    if (msg.includes("phù hợp với loại hình nào")) {
      return "Hệ thống phù hợp cho doanh nghiệp lữ hành, đơn vị tổ chức tour, vận hành tour ghép/tour đoàn và các mô hình kinh doanh dịch vụ du lịch cần quản lý khách hàng, điều hành và bán hàng tập trung.";
    }

    if (msg.includes("app khách hàng")) {
      return "Hệ thống có thể hỗ trợ app cho khách hàng để tra cứu hành trình, theo dõi thông tin dịch vụ và tương tác thuận tiện hơn.";
    }

    if (msg.includes("kế toán") || msg.includes("hoa hồng")) {
      return "Hệ thống có hỗ trợ các nghiệp vụ kế toán, theo dõi doanh thu, chi phí và quản lý hoa hồng để phục vụ vận hành doanh nghiệp du lịch.";
    }

    if (msg.includes("crm")) {
      return "Nhanh Travel có CRM để quản lý khách hàng, theo dõi lịch sử giao dịch, hỗ trợ chăm sóc và tối ưu quy trình bán hàng.";
    }

    if (msg.includes("công nợ") || msg.includes("nhà cung cấp")) {
      return "Hệ thống có thể hỗ trợ quản lý nhà cung cấp và theo dõi công nợ để kiểm soát thanh toán, chi phí và đối soát tốt hơn.";
    }

    if (msg.includes("tour ghép") || msg.includes("tour đoàn")) {
      return "Hệ thống hỗ trợ quản lý tour ghép và tour đoàn, giúp theo dõi điều hành, lịch trình và vận hành tour rõ ràng hơn.";
    }

    return "Em đang hỗ trợ thông tin về các giải pháp và tính năng của Nhanh Travel. Anh/chị có thể hỏi thêm về demo, CRM, app khách hàng, bảng giá hoặc quản lý tour.";
  };

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      role: "user",
      text: trimmed,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setCurrentStep("chatView");
    setInputMessage("");

    if (shouldOpenDemoForm(trimmed)) {
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          text: "Vui lòng điền những thông tin dưới đây để đội ngũ tư vấn hỗ trợ anh/chị nhanh hơn.",
        },
      ]);

      return;
    }

    if (shouldUseStaticReply(trimmed)) {
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          text: getStaticReply(trimmed),
        },
      ]);

      return;
    }

    if (isOutOfScope(trimmed)) {
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          text: "Em chỉ hỗ trợ thông tin về sản phẩm, tính năng, demo, bảng giá và giải pháp quản lý du lịch của Nhanh Travel. Anh/chị có thể hỏi về CRM, app khách hàng, tour ghép/đoàn, kế toán, hoa hồng hoặc đăng ký dùng thử.",
        },
      ]);

      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          fullName,
          phone,
          history: updatedMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Có lỗi xảy ra");
      }

      const botMessage: Message = {
        role: "bot",
        text: data.reply || "Xin lỗi, hiện tại tôi chưa thể trả lời.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Send message error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Xin lỗi anh/chị, hệ thống AI đang bận. Anh/chị vui lòng thử lại sau ít phút.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {isOpen ? (
        <div
          className={`${styles.chatBox} ${
            isExpanded ? styles.chatBoxExpanded : ""
          }`}
        >
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <Image
                src="/images/Home/chatbot-icon.png"
                alt="Bot"
                width={20}
                height={20}
                className={styles.headerBotIcon}
              />
              <Image
                src="/images/Home/logo1.png"
                alt="Nhanh Travel"
                width={120}
                height={24}
                className={styles.headerCompanyLogo}
              />
            </div>

            <div className={styles.headerActions}>
              <button
                onClick={handleToggleExpand}
                className={styles.expandButton}
                aria-label={isExpanded ? "Thu nhỏ chat" : "Mở rộng chat"}
                title={isExpanded ? "Thu nhỏ" : "Mở rộng"}
                type="button"
              >
                {isExpanded ? "↙" : "↗"}
              </button>

              <button
                onClick={handleCloseChat}
                className={styles.closeButton}
                aria-label="Đóng chat"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.chatBody} ref={chatBodyRef}>
            {currentStep === "welcomeForm" && (
              <>
                <div className={styles.formGlow}></div>
                <div className={styles.formCard}>
                  <WelcomeForm
                    fullName={fullName}
                    phone={phone}
                    errorMessage={errorMessage}
                    onFullNameChange={setFullName}
                    onPhoneChange={setPhone}
                    onStart={handleStart}
                  />
                </div>
              </>
            )}

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
  <div className={styles.chatFooter}>
  <div className={styles.composerBar}>
    <button
      type="button"
      className={styles.plusButton}
      aria-label="Thêm"
    >
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
        </div>
      ) : (
        <button
          onClick={handleOpenChat}
          className={styles.floatingButton}
          aria-label="Mở chat"
          type="button"
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