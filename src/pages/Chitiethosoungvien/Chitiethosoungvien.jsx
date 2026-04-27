import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchCandidateDetail } from '../../services/api';
import { buildInDevelopmentPath, ROUTES } from '../../constants/routes';
import styles from './Chitiethosoungvien.module.css';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=360&q=80';

const MOCK_PROFILE = {
  candidate_id: 1024,
  full_name: 'Nguyễn Văn An',
  avatar_url: DEFAULT_AVATAR,
  phone_number: '+84 90 123 4567',
  email: 'nguyen.van.a@example.com',
  location: 'Hồ Chí Minh, Việt Nam',
  headline: 'Senior Software Engineer',
  overview:
    'Là một Senior Software Engineer với hơn 5 năm kinh nghiệm trong việc thiết kế và phát triển các ứng dụng web có quy mô lớn. Tôi đam mê xây dựng các giải pháp tối ưu, chú trọng vào hiệu suất và trải nghiệm người dùng. Từng dẫn dắt các nhóm nhỏ áp dụng Agile/Scrum và thành thạo hệ sinh thái JavaScript (React, Node.js). Luôn mong muốn tìm kiếm môi trường làm việc sáng tạo để tiếp tục phát triển chuyên môn và đóng góp vào những sản phẩm mang lại giá trị thực tiễn.',
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
  languages: [
    { name: 'Tiếng Việt', level: 'Bản ngữ' },
    { name: 'Tiếng Anh', level: 'Lưu loát (IELTS 7.5)' },
  ],
  projects: [
    {
      title: 'E-Commerce Platform Redesign',
      description:
        'Kiến trúc lại toàn bộ frontend sang Next.js, cải thiện tốc độ tải trang 40% và tăng tỉ lệ chuyển đổi 18%.',
      tags: ['Next.js', 'Tailwind', 'GraphQL'],
    },
    {
      title: 'Real-time Analytics Dashboard',
      description:
        'Xây dựng dashboard xử lý hàng triệu data points mỗi ngày bằng WebSocket và pipeline event-driven.',
      tags: ['React', 'Node.js', 'Socket.IO'],
    },
  ],
  education_timeline: [
    {
      title: 'Đại học Khoa học Tự nhiên TP.HCM',
      subtitle: 'Cử nhân Công nghệ Thông tin',
      period: '2014 - 2018',
      description:
        'Tốt nghiệp loại Giỏi. Tham gia đội tuyển thi Olympic Tin học sinh viên và đạt giải Ba toàn quốc.',
    },
    {
      title: 'Chứng chỉ Quốc tế',
      subtitle: '',
      period: '',
      description: '',
      certificates: [
        { name: 'AWS Certified Solutions Architect - Associate', year: '2021' },
        { name: 'Scrum Master Certified (SMC)', year: '2020' },
      ],
    },
  ],
  matched_employers: [
    { company: 'TechCorp Global', role: 'Senior Frontend Engineer', score: 'Độ phù hợp 95%' },
    { company: 'Innova Solutions', role: 'Fullstack Developer', score: 'Độ phù hợp 88%' },
    { company: 'Nexus Labs', role: 'Lead React Developer', score: 'Độ phù hợp 75%' },
  ],
};

function normalizeCandidateProfile(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const skills = Array.isArray(payload.skills)
    ? payload.skills
    : payload.ky_nang
      ? String(payload.ky_nang)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : MOCK_PROFILE.skills;

  return {
    candidate_id: payload.candidate_id || payload.ung_vien_id || MOCK_PROFILE.candidate_id,
    full_name: payload.full_name || payload.ho_ten || payload.name || MOCK_PROFILE.full_name,
    avatar_url: payload.avatar_url || payload.avatar || MOCK_PROFILE.avatar_url,
    phone_number: payload.phone_number || payload.so_dien_thoai || MOCK_PROFILE.phone_number,
    email: payload.email || payload.thu_dien_tu || payload.gmail || MOCK_PROFILE.email,
    location: payload.location || payload.vi_tri_mong_muon || MOCK_PROFILE.location,
    headline: payload.headline || payload.vi_tri_mong_muon || MOCK_PROFILE.headline,
    overview: payload.overview || payload.gioi_thieu || MOCK_PROFILE.overview,
    skills,
    languages: payload.languages || MOCK_PROFILE.languages,
    projects: payload.projects || MOCK_PROFILE.projects,
    education_timeline: payload.education_timeline || payload.education || MOCK_PROFILE.education_timeline,
    matched_employers: payload.matched_employers || MOCK_PROFILE.matched_employers,
  };
}

function Chitiethosoungvien() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const candidateId = params?.id ?? location.state?.candidateId ?? '';

  const [profile, setProfile] = useState(() => normalizeCandidateProfile(location.state?.candidateData));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!candidateId || location.state?.candidateData) {
      if (!profile) setProfile(MOCK_PROFILE);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setErrorMessage('');

    fetchCandidateDetail(candidateId)
      .then((data) => {
        if (!isActive) return;
        const normalized = normalizeCandidateProfile(data);
        setProfile(normalized || MOCK_PROFILE);
      })
      .catch((error) => {
        if (!isActive) return;
        setErrorMessage(error?.message || 'Không thể tải thông tin ứng viên.');
        setProfile(MOCK_PROFILE);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [candidateId, location.state]);

  const displayProfile = profile || MOCK_PROFILE;

  if (isLoading) {
    return (
      <section className={styles['candidate-profile-page']}>
        <div className={styles['candidate-profile-shell']}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles['candidate-profile-page']}>
      <div className={styles['candidate-profile-shell']}>
        {errorMessage ? (
          <p className={styles['error']}>{errorMessage}</p>
        ) : null}

        <div className={styles['candidate-layout']}>
          <aside className={styles['left-column']}>
            <article className={styles['profile-card']}>
              <div className={styles['avatar-wrap']}>
                <img src={displayProfile.avatar_url || DEFAULT_AVATAR} alt={displayProfile.full_name || 'Candidate avatar'} />
                <span className={styles['online-dot']} />
              </div>

              <h1>{displayProfile.full_name}</h1>
              <p>{displayProfile.headline}</p>

              <div className={styles['section-title']}>Thông tin liên hệ</div>
              <ul className={styles['info-list']}>
                <li>
                  <span>☎</span>
                  <strong>{displayProfile.phone_number}</strong>
                </li>
                <li>
                  <span>✉</span>
                  <strong>{displayProfile.email}</strong>
                </li>
                <li>
                  <span>⌖</span>
                  <strong>{displayProfile.location}</strong>
                </li>
              </ul>
            </article>

            <article className={styles['side-card']}>
              <h3>Kỹ năng</h3>
              <div className={styles['chips']}>
                {displayProfile.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>

            <article className={styles['side-card']}>
              <h3>Ngôn ngữ</h3>
              <ul className={styles['language-list']}>
                {displayProfile.languages.map((language) => (
                  <li key={language.name}>
                    <span>{language.name}</span>
                    <strong>{language.level}</strong>
                  </li>
                ))}
              </ul>
            </article>
          </aside>

          <main className={styles['middle-column']}>
            <article className={styles['main-card']}>
              <div className={styles['card-head']}>
                <h2>Giới thiệu bản thân</h2>
                <div className={styles['card-actions']}>
                  <button
                    type="button"
                    className={styles['ghost-button']}
                    onClick={() => navigate(ROUTES.CANDIDATE_EDIT)}
                  >
                    Chỉnh sửa HS
                  </button>
                  <button
                    type="button"
                    className={styles['primary-button']}
                    onClick={() => navigate(buildInDevelopmentPath('candidate-profile-viewer'))}
                  >
                    Tải hồ sơ
                  </button>
                </div>
              <p className={styles['intro-text']}>{displayProfile.overview}</p>
            </article>

            <article className={styles['main-card']}>
              <div className={styles['card-head']}>
                <h2>Project nổi bật</h2>
                <button
                  type="button"
                  className={styles['link-button']}
                  onClick={() => navigate(buildInDevelopmentPath('candidate-projects'))}
                >
                  Xem tất cả
                </button>
              </div>

              <div className={styles['project-grid']}>
                {displayProfile.projects.map((project) => (
                  <article key={project.title} className={styles['project-item']}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className={styles['project-tags']}>
                      {project.tags.map((tag) => (
                        <span key={`${project.title}-${tag}`}>{tag}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className={styles['main-card']}>
              <h2>Trình độ học vấn</h2>
              <div className={styles['timeline']}>
                {displayProfile.education_timeline.map((item, index) => (
                  <article key={`${item.title}-${index}`} className={styles['timeline-item']}>
                    <span className={styles['timeline-dot']} />
                    <div>
                      <h3>{item.title}</h3>
                      {item.subtitle ? <p className={styles['timeline-subtitle']}>{item.subtitle}</p> : null}
                      {item.period ? <p className={styles['timeline-period']}>{item.period}</p> : null}
                      {item.description ? <p>{item.description}</p> : null}

                      {Array.isArray(item.certificates) && item.certificates.length > 0 ? (
                        <div className={styles['certificate-list']}>
                          {item.certificates.map((certificate) => (
                            <div key={certificate.name} className={styles['certificate-item']}>
                              <span>{certificate.name}</span>
                              <strong>{certificate.year}</strong>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </main>

          <aside className={styles['right-column']}>
            <article className={styles['right-card']}>
              <h3>Nhà tuyển dụng phù hợp</h3>
              <div className={styles['employer-list']}>
                {displayProfile.matched_employers.map((employer, index) => (
                  <article key={`${employer.company}-${index}`} className={styles['employer-item']}>
                    <span className={styles['employer-logo']}>{employer.company.charAt(0)}</span>
                    <div>
                      <h4>{employer.company}</h4>
                      <p>{employer.role}</p>
                      <small>{employer.score}</small>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className={styles['suggestion-button']}
                onClick={() => navigate(buildInDevelopmentPath('matched-employers'))}
              >
                Xem tất cả gợi ý
              </button>
            </article>
          </aside>
        </div>
    </section>
  );
}

export default Chitiethosoungvien;
