import Image from "next/image";
import styles from "../page.module.css";

const socials = [
  { id: 1, name: "Facebook", image: "/images/Home/social/facebook.png", href: "#" },
  { id: 2, name: "YouTube", image: "/images/Home/social/youtube.png", href: "#" },
  { id: 3, name: "TikTok", image: "/images/Home/social/tiktok.png", href: "#" },
  { id: 4, name: "Twitter", image: "/images/Home/social/twitter.png", href: "#" },
  { id: 5, name: "Messenger", image: "/images/Home/social/messenger.png", href: "#" },
  { id: 6, name: "Zalo", image: "/images/Home/social/zalo.png", href: "#" },
  { id: 7, name: "LinkedIn", image: "/images/Home/social/linkedin.png", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTopImage}>
        <Image
          src="/images/Home/footer-devices.png"
          alt="Nhanh Travel devices"
          width={1600}
          height={420}
          className={styles.footerDevicesImage}
        />
      </div>

      <div className={styles.footerContent}>
        <div className={styles.footerColLarge}>
          <Image
            src="/images/Home/logo2.png"
            alt="Nhanh Travel"
            width={280}
            height={60}
            className={styles.footerLogo}
          />

          <p className={styles.footerCompany}>Công ty CP Đầu tư phát triển Vigo</p>

          <p className={styles.footerText}>
            Địa chỉ: 2A Nguyễn Sỹ Sách, Phường 15, Quận Tân Bình,
            <br />
            Thành phố Hồ Chí Minh, Việt Nam
          </p>

          <p className={styles.footerText}>Hotline: (+84) 90 999 1205</p>

          <p className={styles.footerText}>
            Lĩnh vực kinh doanh: giải pháp phần mềm chuyển đổi số cho công ty du lịch
            và sân golf
          </p>
        </div>

        <div className={styles.footerCol}>
          <h3 className={styles.footerHeading}>CÔNG TY</h3>
          <ul className={styles.footerList}>
            <li>Về chúng tôi</li>
            <li>Tính năng</li>
            <li>Bảng giá</li>
            <li>Khách hàng</li>
            <li>Blog</li>
            <li>Trải nghiệm ngay</li>
          </ul>
        </div>

        <div className={styles.footerCol}>
          <h3 className={styles.footerHeading}>TÍNH NĂNG</h3>
          <ul className={styles.footerList}>
            <li>Quản lý sản phẩm</li>
            <li>Quản lý đơn hàng</li>
            <li>Điều hành tour</li>
            <li>Kế toán</li>
            <li>Hệ thống CRM</li>
            <li>Hệ thống quản lý công việc</li>
          </ul>
        </div>

        <div className={styles.footerColWide}>
          <h3 className={styles.footerHeading}>TẢI ỨNG DỤNG TẠI ĐÂY</h3>

          <div className={styles.storeButtons}>
            <Image
              src="/images/Home/appstore.png"
              alt="App Store"
              width={180}
              height={54}
              className={styles.storeImage}
            />
            <Image
              src="/images/Home/googleplay.png"
              alt="Google Play"
              width={180}
              height={54}
              className={styles.storeImage}
            />
          </div>

          <h3 className={styles.footerHeadingSecondary}>KẾT NỐI VỚI CHÚNG TÔI</h3>

          <div className={styles.socialRow}>
            {socials.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={styles.socialLink}
                aria-label={item.name}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={52}
                  height={52}
                  className={styles.socialIconImage}
                />
              </a>
            ))}
          </div>

          <p className={styles.footerDescription}>
            Hệ thống quản trị chuyên biệt cho Công ty Du lịch lữ hành, chuẩn hóa toàn
            diện quy trình vận hành doanh nghiệp, góp phần xây dựng chuyển đổi số cho
            cộng đồng du lịch Việt Nam phát triển thịnh vượng.
          </p>
        </div>
      </div>
    </footer>
  );
}