import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchJobPosts } from '../../services/api';
import { ROUTES, buildInDevelopmentPath } from '../../constants/routes';
import './Timkiemcongviec.css';
import danangImage from './danang.jpg';

const navItems = [
  { label: 'Việc làm', to: ROUTES.JOB_SEARCH },
  { label: 'Doanh nghiệp', to: buildInDevelopmentPath('companies') },
  { label: 'Về chúng tôi', to: buildInDevelopmentPath('about') },
];

const jobSuggestions = [
  {
    title: 'Giám đốc Chiến lược Cấp cao',
    description:
      'Dẫn dắt tầm nhìn sản phẩm và phối hợp với các nhóm để mở rộng tác động kinh doanh trong toàn tổ chức.',
    salary: '$180k - $240k',
    badges: ['Toàn thời gian', 'Từ xa'],
    status: 'Sắp hết hạn',
  },
  {
    title: 'Trưởng phòng Vận hành Sáng tạo',
    description:
      'Điều phối các nhóm sáng tạo, tối ưu quy trình và giữ nhịp vận hành cho các chiến dịch lớn.',
    salary: '$140k - $190k',
    badges: ['Toàn thời gian'],
    status: null,
  },
  {
    title: 'Phó Chủ tịch Đổi mới Sản phẩm',
    description:
      'Tạo các hướng đi mới cho sản phẩm, kết nối kỹ thuật và chiến lược để tăng tốc tăng trưởng.',
    salary: '$300k+ cố định',
    badges: ['Hợp đồng', 'Linh hoạt'],
    status: 'Mới',
  },
];

const daNangWards = [
  'phường Hải Châu',
  'phường Hòa Cường',
  'phường Thanh Khê',
  'phường An Khê',
  'phường An Hải',
  'phường Sơn Trà',
  'phường Ngũ Hành Sơn',
  'phường Hòa Khánh',
  'phường Hải Vân',
  'phường Cẩm Lệ',
  'phường Liên chiểu',
];

const footerLinks = [
  { label: 'Chính sách bảo mật', to: buildInDevelopmentPath('privacy-policy') },
  { label: 'Điều khoản dịch vụ', to: buildInDevelopmentPath('terms') },
  { label: 'Liên hệ', to: buildInDevelopmentPath('contact') },
  { label: 'Cài đặt Cookie', to: buildInDevelopmentPath('cookies') },
];

function JobCard({ job }) {
  const badges = Array.isArray(job.badges) && job.badges.length > 0 ? job.badges : ['Tuyển dụng'];

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="job-avatar" aria-hidden="true">
          <span>◻</span>
        </div>
        {job.status ? <span className={`job-status ${job.status === 'Mới' ? 'is-new' : ''}`}>{job.status}</span> : null}
      </div>

      <h3>{job.title}</h3>
      <p>{job.description}</p>

      <div className="job-tags">
        {badges.map((badge) => (
          <span key={badge}>{badge}</span>
        ))}
      </div>

      <div className="job-meta">
        <strong>{job.salary}</strong>
      </div>
    </article>
  );
}

function Timkiemcongviec() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleClear = () => {
    setKeyword('');
    setLocation('');
    setSalary('');
    setSearchError('');
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsSearching(true);
    setSearchError('');

    try {
      const jobs = await fetchJobPosts({
        q: keyword,
        dia_diem: location,
        luong_min: salary,
      });

      navigate(ROUTES.RECRUITMENT_LIST, {
        state: {
          jobs,
          filters: {
            q: keyword,
            dia_diem: location,
            luong_min: salary,
          },
        },
      });
    } catch (error) {
      setSearchError(error.message || 'Không thể tải dữ liệu công việc.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="job-search-page">
      <header className="job-topbar">
        <div className="job-brand">
          <strong>Executive Curator</strong>
        </div>

        <nav className="job-nav" aria-label="Điều hướng chính">
          {navItems.map((item, index) => (
            <button
              className={`job-nav-link ${index === 0 ? 'is-active' : ''}`}
              type="button"
              onClick={() => navigate(item.to)}
              key={item.label}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="job-actions">
          <div className="job-lang" aria-label="Chọn ngôn ngữ">
            <button type="button">EN</button>
            <button className="is-active" type="button">
              VN
            </button>
            <button type="button">JP</button>
          </div>
          <button
            className="job-login"
            type="button"
            onClick={() => navigate(buildInDevelopmentPath('login'))}
          >
            Đăng nhập
          </button>
        </div>
      </header>

      <main className="job-page">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Dành riêng cho bạn</p>
            <h1>Định hình bước tiến sự nghiệp tiếp theo của bạn</h1>
            <p className="hero-text">
              Tiếp cận những cơ hội đặc quyền tại các công ty dẫn đầu ngành, được tuyển chọn kỹ lưỡng
              dành cho các chuyên gia ưu tú.
            </p>

            <form className="search-panel" aria-label="Thanh tìm kiếm việc làm" onSubmit={handleSearch}>
              <div className="search-inputs">
                <label className="search-field">
                  <span className="search-icon" aria-hidden="true">
                    ⌕
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm việc làm, công ty..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                </label>

                <label className="search-field">
                  <span className="search-icon" aria-hidden="true">
                    ⌖
                  </span>
                  <select
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    aria-label="Địa điểm mong muốn"
                  >
                    <option value="" disabled>
                      Địa điểm mong muốn
                    </option>
                    {daNangWards.map((ward) => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="search-field">
                  <span className="search-icon" aria-hidden="true">
                    ◫
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Mức lương mong muốn"
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                  />
                </label>
              </div>

              <div className="search-actions">
                <button className="clear-link" type="button" onClick={handleClear}>
                  Xóa
                </button>
                <button className="search-button" type="submit" disabled={isSearching}>
                  <span aria-hidden="true">⌕</span>
                  {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                </button>
              </div>
            </form>

            {searchError ? <p className="search-error">{searchError}</p> : null}
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-overlay">
              <img src={danangImage} alt="Hình ảnh minh họa công việc" />
            </div>
          </div>
        </section>

        <section className="job-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Dành riêng cho bạn</p>
              <h2>Gợi ý công việc</h2>
            </div>
            <button
              className="view-all-link"
              type="button"
              onClick={() => navigate(ROUTES.RECRUITMENT_LIST)}
            >
              Xem tất cả danh sách <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="job-grid">
            {jobSuggestions.map((job) => (
              <JobCard job={job} key={job.title} />
            ))}
          </div>
        </section>

        <section className="cta-band">
          <p className="eyebrow cta-eyebrow">Trải nghiệm sự hỗ trợ cá nhân hóa</p>
          <h2>Tham gia mạng lưới tài năng của chúng tôi</h2>
          <p>
            Tham gia mạng lưới tài năng của chúng tôi để nhận các gợi ý việc làm phù hợp với định
            hướng nghề nghiệp của bạn.
          </p>

          <div className="cta-actions">
            <button
              className="primary-pill"
              type="button"
              onClick={() => navigate(buildInDevelopmentPath('create-profile'))}
            >
              Tạo hồ sơ
            </button>
            <button
              className="secondary-pill"
              type="button"
              onClick={() => navigate(buildInDevelopmentPath('learn-more'))}
            >
              Tìm hiểu thêm
            </button>
          </div>
        </section>
      </main>

      <footer className="job-footer">
        <div>
          <strong>Executive Curator</strong>
          <span>© 2024 Tuyển dụng Executive Curator. Bảo lưu mọi quyền.</span>
        </div>

        <nav className="footer-links" aria-label="Liên kết chân trang">
          {footerLinks.map((item) => (
            <button type="button" key={item.label} onClick={() => navigate(item.to)}>
              {item.label}
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}

export default Timkiemcongviec;