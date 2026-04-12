import { useState } from "react";
import styles from "./FloatingChat.module.css";

type QuickQuestionsProps = {
  questions: string[];
  onAsk: (question: string) => void | Promise<void>;
  disabled?: boolean;
  compact?: boolean;
};

export default function QuickQuestions({
  questions,
  onAsk,
  disabled = false,
  compact = false,
}: QuickQuestionsProps) {
  const [isOpen, setIsOpen] = useState(!compact);

  return (
    <div
      className={
        compact
          ? styles.quickQuestionWrapperCompact
          : styles.quickQuestionWrapper
      }
    >
      <div
        className={
          compact ? styles.quickHeaderCompact : styles.quickHeader
        }
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>Câu hỏi gợi ý</span>
        <span className={`${styles.arrow} ${isOpen ? styles.up : ""}`}>▾</span>
      </div>

      {isOpen && (
        <>
          {!compact && (
            <h3 className={styles.quickQuestionTitle}>
              Em chào anh chị! Anh chị quan tâm các dịch vụ nào
              <br />
              của Nhanhtravel ạ ?
            </h3>
          )}

          <div
            className={
              compact
                ? styles.quickQuestionListCompact
                : styles.quickQuestionList
            }
          >
            {questions.map((question, index) => (
              <button
                key={`${question}-${index}`}
                type="button"
                className={
                  compact
                    ? styles.quickQuestionBtnCompact
                    : styles.quickQuestionBtn
                }
                onClick={() => {
                  if (!disabled) void onAsk(question);
                }}
                disabled={disabled}
              >
                {question}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}