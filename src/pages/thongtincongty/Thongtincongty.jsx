import React, { useState } from "react";
import styles from "./Thongtincongty.module.css";

const Thongtincongty = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: "Công ty Công nghệ ABC",
    industry: "Phát triển phần mềm",
    location: "Hà Nội, Việt Nam",
    founded: "2015",
    employees: "200+",
    headquarters: "Tòa nhà Innovation, Cầu Giấy",
    bio: "Chúng tôi là một công ty công nghệ hàng đầu chuyên cung cấp các giải pháp chuyển đổi số cho doanh nghiệp. Với đội ngũ kỹ sư tài năng, ABC Tech cam kết mang lại giá trị tốt nhất cho khách hàng thông qua các sản phẩm sáng tạo và dịch vụ chuyên nghiệp.",
    ceo: "Nguyễn Văn A",
    projects: [
      {
        id: 1,
        name: "Hệ thống Quản lý Nhân sự SmartHR",
        status: "Đang triển khai",
      },
      { id: 2, name: "Ứng dụng E-commerce GlobalShop", status: "Hoàn thành" },
      {
        id: 3,
        name: "Nền tảng AI Phân tích Dữ liệu",
        status: "Đang phát triển",
      },
    ],
  });

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={styles.container}>
      {/* 3. Sidebar */}
      <aside
        className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.sidebarHeader}>
          {!isSidebarCollapsed && (
            <span style={{ fontWeight: "bold" }}>Tên Công ty</span>
          )}
          <button
            onClick={toggleSidebar}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>
        <div className={styles.sidebarMenu}>
          <div className={styles.menuItem}>
            <span className={styles.menuIcon}>👤</span>
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </div>
          <div className={styles.menuItem}>
            <span className={styles.menuIcon}>👥</span>
            {!isSidebarCollapsed && <span>Team Management</span>}
          </div>
          <div className={styles.menuItem}>
            <span className={styles.menuIcon}>🏢</span>
            {!isSidebarCollapsed && <span>Department</span>}
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {/* 2. Top Navigation */}
        <nav className={styles.topNav}>
          <div className={styles.navLinks}>
            <button className={styles.navBtn}>Home</button>
            <button className={styles.navBtn}>Home</button>
            <button className={styles.navBtn}>Home</button>
          </div>
          <div className={styles.navActions}>
            <span>16:04 PM</span>
            <span className={styles.actionIcon}>🔍</span>
            <span className={styles.actionIcon}>🔔</span>
            <span className={styles.actionIcon}>👤</span>
          </div>
        </nav>

        <div className={styles.contentBody}>
          {/* 4. Basic Info & Profile Header */}
          <section className={styles.profileHeaderCard}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>1</div>
              <div className={styles.editIcon}>✎</div>
            </div>
            <div className={styles.basicInfo}>
              <h1 className={styles.companyName}>{companyInfo.name}</h1>
              <div className={styles.companyIndustry}>
                <span>🏢</span> {companyInfo.industry}
              </div>
              <div className={styles.companyLocation}>
                <span>📍</span> {companyInfo.location}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                cursor: "pointer",
              }}
            >
              ✎
            </div>
          </section>

          {/* 5. Info Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Năm thành lập</div>
              <div className={styles.statValue}>{companyInfo.founded}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Số lượng nhân viên</div>
              <div className={styles.statValue}>{companyInfo.employees}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Trụ sở chính</div>
              <div className={styles.statValue}>{companyInfo.headquarters}</div>
            </div>
          </div>

          {/* Bio Section */}
          <section className={styles.bioSection}>
            <h2 className={styles.sectionTitle}>Giới thiệu (Bio)</h2>
            <p>{companyInfo.bio}</p>
          </section>

          {/* 6. Projects & Key Contact */}
          <div className={styles.bottomGrid}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>
                Dự án đang cung cấp & phát triển
              </h2>
              <div className={styles.projectList}>
                {companyInfo.projects.map((project) => (
                  <div key={project.id} className={styles.projectItem}>
                    <div style={{ fontWeight: 500 }}>{project.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>
                      {project.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Key Contact</h2>
              <div className={styles.contactInfo}>
                <div className={styles.contactDetail}>
                  <span className={styles.contactLabel}>CEO</span>
                  <span className={styles.contactValue}>{companyInfo.ceo}</span>
                </div>
                {/* Additional contact placeholders */}
                <div className={styles.contactDetail}>
                  <span className={styles.contactLabel}>Email liên hệ</span>
                  <span className={styles.contactValue}>
                    contact@abctech.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Thongtincongty;
