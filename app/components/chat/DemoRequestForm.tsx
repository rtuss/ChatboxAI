import styles from "./FloatingChat.module.css";
import type { DemoFormData } from "./chat.types";

type DemoRequestFormProps = {
  formData: DemoFormData;
  errorMessage: string;
  successMessage: string;
  onChange: (field: keyof DemoFormData, value: string | boolean) => void;
  onSubmit: () => void;
};

export default function DemoRequestForm({
  formData,
  errorMessage,
  successMessage,
  onChange,
  onSubmit,
}: DemoRequestFormProps) {
  return (
    <div className={styles.demoFormCard}>
      <h3 className={styles.demoFormTitle}>ĐĂNG KÝ SỬ DỤNG DEMO</h3>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>Họ và tên *</label>
        <input
          type="text"
          className={styles.demoInput}
          placeholder="Nhập họ và tên"
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>Email *</label>
        <input
          type="email"
          className={styles.demoInput}
          placeholder="Nhập email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>Số điện thoại/Zalo *</label>
        <input
          type="text"
          className={styles.demoInput}
          placeholder="Ví dụ: 0912345678"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>Công ty *</label>
        <input
          type="text"
          className={styles.demoInput}
          placeholder="Nhập tên công ty"
          value={formData.company}
          onChange={(e) => onChange("company", e.target.value)}
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>Dịch vụ *</label>
        <select
          className={styles.demoSelect}
          value={formData.service}
          onChange={(e) => onChange("service", e.target.value)}
        >
          <option value="">Chọn dịch vụ</option>
          <option value="CRM quản lý khách hàng">CRM quản lý khách hàng</option>
          <option value="Quản lý tour ghép/đoàn">Quản lý tour ghép/đoàn</option>
          <option value="App khách hàng">App khách hàng</option>
          <option value="Kế toán / Hoa hồng">Kế toán / Hoa hồng</option>
          <option value="Demo tổng thể">Demo tổng thể</option>
        </select>
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>Quy mô công ty</label>
        <select
          className={styles.demoSelect}
          value={formData.companySize}
          onChange={(e) => onChange("companySize", e.target.value)}
        >
          <option value="">Chọn quy mô</option>
          <option value="1-10 nhân sự">1-10 nhân sự</option>
          <option value="11-30 nhân sự">11-30 nhân sự</option>
          <option value="31-50 nhân sự">31-50 nhân sự</option>
          <option value="Trên 50 nhân sự">Trên 50 nhân sự</option>
        </select>
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>Lời nhắc</label>
        <textarea
          className={styles.demoTextarea}
          placeholder="Nhập lời nhắc hoặc câu hỏi của bạn"
          value={formData.note}
          onChange={(e) => onChange("note", e.target.value)}
        />
      </div>

      <label className={styles.demoCheckboxRow}>
        <input
          type="checkbox"
          checked={formData.agreed}
          onChange={(e) => onChange("agreed", e.target.checked)}
        />
        <span>
          Tôi đồng ý để Nhanh Travel liên hệ tư vấn.{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Chi tiết các quy định
          </a>
        </span>
      </label>

      {errorMessage && <p className={styles.demoError}>{errorMessage}</p>}
      {successMessage && <p className={styles.demoSuccess}>{successMessage}</p>}

      <button
        type="button"
        className={styles.demoSubmitButton}
        onClick={onSubmit}
      >
        Đăng ký demo
      </button>
    </div>
  );
}