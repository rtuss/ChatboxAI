import styles from "./FloatingChat.module.css";

type QuickQuestionsProps = {
  questions: string[];
  onAsk: (question: string) => void;
  disabled?: boolean;
};

export default function QuickQuestions({
  questions,
  onAsk,
  disabled = false,
}: QuickQuestionsProps) {
  return (
    <div className={styles.quickQuestionWrapper}>
      <h3 className={styles.quickQuestionTitle}>
        Em chào anh chị! Anh chị quan tâm các dịch vụ nào
        <br />
        của Nhanhtravel ạ ?
      </h3>

      <div className={styles.quickQuestionList}>
        {questions.map((question, index) => (
          <button
            key={index}
            className={styles.quickQuestionBtn}
            onClick={() => onAsk(question)}
            disabled={disabled}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}