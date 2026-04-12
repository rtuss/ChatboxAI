import styles from "./FloatingChat.module.css";
import DemoRequestForm from "./DemoRequestForm";
import type {
  DemoFormData,
  InlineFormType,
  Message,
} from "./chat.types";

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  activeInlineForm: InlineFormType;
  demoForm: DemoFormData;
  demoFormError: string;
  demoSubmitSuccess: string;
  onDemoFormChange: (
    field: keyof DemoFormData,
    value: string | boolean
  ) => void;
  onDemoFormSubmit: () => void;
};

export default function ChatMessages({
  messages,
  isLoading,
  activeInlineForm,
  demoForm,
  demoFormError,
  demoSubmitSuccess,
  onDemoFormChange,
  onDemoFormSubmit,
}: ChatMessagesProps) {
  return (
    <div className={styles.messageList}>
      {messages.map((msg, index) => {
        const messageKey =
          msg.timestamp !== undefined
            ? `${msg.role}-${msg.timestamp}-${index}`
            : `${msg.role}-${msg.text}-${index}`;

        return (
          <div
            key={messageKey}
            className={msg.role === "user" ? styles.userRow : styles.botRow}
          >
            <div
              className={
                msg.role === "user" ? styles.userMessage : styles.botMessage
              }
            >
              {msg.text}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className={styles.botRow}>
          <div className={styles.botMessage}>Đang trả lời...</div>
        </div>
      )}

      {activeInlineForm === "demoRequest" && (
        <div className={styles.botRow}>
          <DemoRequestForm
            formData={demoForm}
            errorMessage={demoFormError}
            successMessage={demoSubmitSuccess}
            onChange={onDemoFormChange}
            onSubmit={onDemoFormSubmit}
          />
        </div>
      )}
    </div>
  );
}