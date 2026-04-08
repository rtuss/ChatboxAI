import styles from "./FloatingChat.module.css";

type WelcomeFormProps = {
  fullName: string;
  phone: string;
  errorMessage: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onStart: () => void;
};

export default function WelcomeForm({
  fullName,
  phone,
  errorMessage,
  onFullNameChange,
  onPhoneChange,
  onStart,
}: WelcomeFormProps) {
  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>
        Vui lòng cung cấp thông tin để
        <br />
        được tư vấn miễn phí
      </h3>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Họ và tên <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          placeholder="Vui lòng nhập họ tên"
          className={styles.formInput}
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Số điện thoại <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          placeholder="Vui lòng nhập số điện thoại"
          className={styles.formInput}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>

      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

      <button className={styles.startButton} onClick={onStart}>
        Bắt đầu
      </button>
    </div>
  );
}