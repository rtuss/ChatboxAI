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
        <label className={styles.demoLabel}>
          Họ và tên <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.demoInput}
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="Nhập họ và tên"
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          className={styles.demoInput}
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="Nhập email"
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>
          Số điện thoại/Zalo <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.demoInput}
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="Nhập số điện thoại/Zalo"
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>
          Công ty <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.demoInput}
          value={formData.company}
          onChange={(e) => onChange("company", e.target.value)}
          placeholder="Nhập tên công ty"
        />
      </div>

      <div className={styles.demoField}>
        <label className={styles.demoLabel}>
          Dịch vụ quan tâm <span className={styles.required}>*</span>
        </label>
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
        <label className={styles.demoLabel}>Ghi chú</label>
        <textarea
          className={styles.demoTextarea}
          rows={3}
          value={formData.note}
          onChange={(e) => onChange("note", e.target.value)}
          placeholder="Nhập thêm nhu cầu nếu có"
        />
      </div>

      <label className={styles.demoCheckboxRow}>
        <input
          type="checkbox"
          checked={formData.agreed}
          onChange={(e) => onChange("agreed", e.target.checked)}
        />
        <span>Tôi đồng ý để Nhanh Travel liên hệ tư vấn.</span>
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