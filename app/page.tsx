import Image from "next/image";
import styles from "./page.module.css";
import Footer from "./components/Footer";
import FloatingChat from "./components/chat/FloatingChat";

const features = [
  {
    id: 1,
    image: "/images/home/feature-1 (2).png",
    title: "GIAO DIỆN DỄ SỬ DỤNG",
    description:
      'Giao diện thân thiện, đẹp mắt. Các tính năng được thiết kế linh hoạt dành cho những khách hàng "khó tính" nhất',
  },
  {
    id: 2,
    image: "/images/home/feature-4.png",
    title: "NỀN TẢNG CÔNG NGHỆ CLOUD",
    description:
      "Truy cập bằng công nghệ Cloud nhanh chóng và miễn phí dung lượng. Cam kết bảo mật dữ liệu tuyệt đối an toàn",
  },
  {
    id: 3,
    image: "/images/home/feature-2.png",
    title: "KHÔNG NGỪNG ĐỔI MỚI",
    description:
      "Liên tục cập nhật và hoàn thiện các tính năng mới dựa trên nhu cầu của khách hàng",
  },
  {
    id: 4,
    image: "/images/home/feature-3.png",
    title: "ĐỒNG BỘ HÓA TẤT CẢ THIẾT BỊ",
    description:
      "Tự động đồng bộ hệ thống trên mọi thiết bị Laptop, Tablet, Mobile giúp khách hàng dễ dàng truy cập Online mọi lúc, mọi nơi",
  },
];

const solutions = [
  {
    id: 1,
    image: "/images/home/adminweb-1.png",
    title: "HỆ THỐNG QUẢN LÝ WEB",
    desc: "Phiên bản Web hoàn hảo, đầy đủ tính năng, hệ thống vận hành liên phòng ban giúp doanh nghiệp chuyển đổi số toàn diện",
  },
  {
    id: 2,
    image: "/images/home/app-admin.png",
    title: "APP ADMIN",
    desc: "Dành cho CEO - Nhà quản lý nắm toàn bộ hệ thống vận hành của doanh nghiệp chỉ vài cú chạm",
  },
  {
    id: 3,
    image: "/images/home/app-nhanvien.png",
    title: "APP NHÂN VIÊN",
    desc: "Dành cho nhân sự, quản lý chi tiết công việc, đơn hàng, lương, thưởng, chấm công, nghỉ phép, lộ trình thăng tiến, nhiệm vụ, qui định và các yêu cầu đề xuất",
  },
  {
    id: 4,
    image: "/images/home/app-khachhang.png",
    title: "APP KHÁCH HÀNG",
    desc: "Dành riêng cho khách hàng của mỗi doanh nghiệp du lịch. Tích hợp đầy đủ tính năng: booking, lịch trình, ví điện tử, tích điểm, nhận tin nhắn và thông báo",
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logoWrap}>
            <Image
              src="/images/Home/logo1.png"
              alt="Nhanh Travel"
              width={260}
              height={60}
              className={styles.logo}
            />
          </div>

          <nav className={styles.nav}>
            <a href="#" className={styles.activeNav}>
              • TRANG CHỦ
            </a>
            <a href="#">TÍNH NĂNG</a>
            <a href="#">SẢN PHẨM</a>
            <a href="#">GIẢI PHÁP</a>
            <a href="#">BẢNG GIÁ</a>
            <a href="#">BLOG</a>
            <a href="#">VỀ CHÚNG TÔI</a>
          </nav>

          <div className={styles.headerIcons}>
            <span className={styles.searchIcon}>⌕</span>
            <button className={styles.menuButton}>≡</button>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <p className={styles.heroSub}>Nền tảng quản trị du lịch toàn diện</p>
            <h1 className={styles.heroTitle}>CHỈ VỚI MỘT CHẠM</h1>

            <p className={styles.heroDesc}>
              Phần mềm du lịch chuyên sâu mới nhất 2025 dành cho doanh nghiệp du lịch
              Inbound, Outbound, Nội địa, Khu du lịch, Nhà xe, Khách sạn, Hướng dẫn viên,
              Vé tham quan và các sản phẩm du lịch.
            </p>

            <ul className={styles.heroList}>
              <li>Tối ưu toàn bộ quy trình doanh nghiệp du lịch trên một nền tảng.</li>
              <li>Support 24/7, Bảo hành toàn thời gian, Miễn phí dùng thử 15 ngày</li>
              <li>Miễn phí set up hệ thống, miễn phí đào tạo 100%</li>
            </ul>

            <div className={styles.heroButtons}>
              <button className={styles.primaryBtn}>ĐĂNG KÝ NGAY</button>
              <button className={styles.secondaryBtn}>LIÊN HỆ TƯ VẤN</button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <Image
              src="/images/home/nhanhtravel-home.png"
              alt="Nhanh Travel dashboard"
              width={540}
              height={360}
              className={styles.heroImage}
            />
          </div>
        </section>

        <section className={styles.featureSection}>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <div key={feature.id} className={styles.featureCard}>
                <div className={styles.featureImageWrap}>
  <div className={styles.featureImageBox}>
    <Image
      src={feature.image}
      alt={feature.title}
      fill
      className={styles.featureImage}
    />
  </div>
</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.solutionSection}>
          <h2 className={styles.solutionTitle}>
            NHANH TRAVEL - GIẢI PHÁP CHUYỂN ĐỔI SỐ
            <br />
            HÀNG ĐẦU CHO DOANH NGHIỆP DU LỊCH
          </h2>

          <div className={styles.solutionContent}>
            <div className={styles.solutionImageCol}>
              <Image
                src="/images/home/solution-main.png"
                alt="Giải pháp Nhanh Travel"
                width={520}
                height={430}
                className={styles.solutionImage}
              />
            </div>

            <div className={styles.solutionCards}>
              {solutions.map((item) => (
                <div key={item.id} className={styles.solutionCard}>
                  <div className={styles.solutionIconWrap}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={150}
                      height={100}
                      className={styles.solutionIconImage}
                    />
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
        <FloatingChat />
      </div>
    </main>
    
  );
}
