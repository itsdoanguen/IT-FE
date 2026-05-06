import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCompanyProfileById, fetchCurrentUser, updateCompanyProfile } from '../../services/api';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const { id: routeId } = useParams();
  
  // State quản lý chế độ chỉnh sửa thông tin
  const [isEditing, setIsEditing] = useState(false);
  // State quản lý tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);
  // State quản lý lưu dữ liệu
  const [isSaving, setIsSaving] = useState(false);
  // State quản lý lỗi
  const [errorMessage, setErrorMessage] = useState('');
  // State quản lý thông báo thành công
  const [successMessage, setSuccessMessage] = useState('');
  
  // State lưu dữ liệu công ty
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    location: '',
    foundedYear: '',
    employees: '',
    headquarters: '',
    website: '',
    bio: '',
    avatar: 'https://via.placeholder.com/120',
  });
  
  // State lưu ID người dùng (ID công ty đang xem/sửa)
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        
        let targetId = routeId;
        
        // Nếu không có ID trên URL, mới lấy ID của user hiện tại
        if (!targetId) {
          const user = await fetchCurrentUser();
          targetId = user?.id;
        }

        if (targetId) {
          setUserId(targetId);
          const data = await fetchCompanyProfileById(targetId);
          
          // Chuẩn hóa dữ liệu từ BE sang FE
          setCompanyData({
            name: data.ten_cong_ty || '',
            industry: data.linh_vuc || '',
            location: data.dia_chi || '',
            foundedYear: data.nam_thanh_lap || '',
            employees: data.so_luong_nhan_vien || '',
            headquarters: data.tru_so_chinh || '',
            website: '', // BE chưa có
            bio: data.lich_su || '', // Dùng lich_su làm bio
            avatar: data.avatar || 'https://via.placeholder.com/120',
          });
        } else {
          setErrorMessage('Không thể xác thực người dùng');
        }
      } catch (error) {
        setErrorMessage(error?.message || 'Không thể tải thông tin công ty');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [routeId]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        setErrorMessage('');
        setSuccessMessage('');

        const payload = {
          ten_cong_ty: companyData.name,
          linh_vuc: companyData.industry,
          dia_chi: companyData.location,
          nam_thanh_lap: companyData.foundedYear,
          so_luong_nhan_vien: companyData.employees,
          tru_so_chinh: companyData.headquarters,
          lich_su: companyData.bio,
        };

        await updateCompanyProfile(userId, payload);
        setSuccessMessage('Cập nhật hồ sơ thành công!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage(error?.message || 'Lỗi khi cập nhật hồ sơ');
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="company-profile-page">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-container">
          <div className="avatar-container">
            <img src={companyData.avatar} alt="Company Logo" className="profile-avatar" />
            {isEditing && (
              <button className="change-avatar-overlay" title="Đổi logo">
                <span>📷</span>
              </button>
            )}
          </div>
          <div className="hero-info">
            <div className="title-row">
              {isEditing ? (
                <input 
                  type="text" 
                  name="name" 
                  value={companyData.name} 
                  onChange={handleChange} 
                  className="edit-title-input"
                  placeholder="Tên công ty"
                />
              ) : (
                <h1>{companyData.name || 'Chưa cập nhật tên công ty'}</h1>
              )}
              <button 
                className={`action-btn ${isEditing ? 'save-btn' : 'edit-btn'}`} 
                onClick={handleEditToggle}
                disabled={isSaving}
              >
                {isSaving ? '⏳' : isEditing ? '💾 Lưu hồ sơ' : '✏️ Chỉnh sửa'}
              </button>
            </div>
            <div className="meta-row">
              <span className="industry-tag">
                {isEditing ? (
                  <input 
                    type="text" 
                    name="industry" 
                    value={companyData.industry} 
                    onChange={handleChange} 
                    placeholder="Lĩnh vực kinh doanh"
                  />
                ) : (
                  <>🏢 {companyData.industry || 'Lĩnh vực chưa cập nhật'}</>
                )}
              </span>
              <span className="location-tag">
                {isEditing ? (
                  <input 
                    type="text" 
                    name="location" 
                    value={companyData.location} 
                    onChange={handleChange} 
                    placeholder="Địa điểm"
                  />
                ) : (
                  <>📍 {companyData.location || 'Địa điểm chưa cập nhật'}</>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content-container">
        {errorMessage && <div className="status-msg error">{errorMessage}</div>}
        {successMessage && <div className="status-msg success">{successMessage}</div>}
        {isLoading && <div className="status-msg loading">Đang tải thông tin...</div>}

        {!isLoading && (
          <div className="profile-grid">
            {/* Left Column: About & Details */}
            <div className="grid-main">
              <section className="profile-card">
                <h2 className="section-title">Giới thiệu doanh nghiệp</h2>
                <div className="bio-content">
                  {isEditing ? (
                    <textarea 
                      name="bio" 
                      value={companyData.bio} 
                      onChange={handleChange} 
                      placeholder="Chia sẻ về lịch sử, sứ mệnh và tầm nhìn của công ty..."
                      rows={6}
                      className="bio-textarea"
                    />
                  ) : (
                    <p className={companyData.bio ? '' : 'placeholder-text'}>
                      {companyData.bio || 'Chưa có thông tin giới thiệu. Hãy cập nhật để ứng viên hiểu rõ hơn về công ty của bạn.'}
                    </p>
                  )}
                </div>
              </section>

              <section className="profile-card">
                <h2 className="section-title">Thông tin chi tiết</h2>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="label">Năm thành lập</span>
                    {isEditing ? (
                      <input type="number" name="foundedYear" value={companyData.foundedYear} onChange={handleChange} />
                    ) : (
                      <span className="value">{companyData.foundedYear || '---'}</span>
                    )}
                  </div>
                  <div className="detail-item">
                    <span className="label">Quy mô nhân sự</span>
                    {isEditing ? (
                      <input type="number" name="employees" value={companyData.employees} onChange={handleChange} />
                    ) : (
                      <span className="value">{companyData.employees || '---'} nhân viên</span>
                    )}
                  </div>
                  <div className="detail-item">
                    <span className="label">Trụ sở chính</span>
                    {isEditing ? (
                      <input type="text" name="headquarters" value={companyData.headquarters} onChange={handleChange} />
                    ) : (
                      <span className="value">{companyData.headquarters || '---'}</span>
                    )}
                  </div>
                  <div className="detail-item">
                    <span className="label">Website</span>
                    {isEditing ? (
                      <input type="text" name="website" value={companyData.website} onChange={handleChange} />
                    ) : (
                      <span className="value">
                        {companyData.website ? (
                          <a href={companyData.website} target="_blank" rel="noreferrer">{companyData.website}</a>
                        ) : '---'}
                      </span>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Contact & Projects */}
            <div className="grid-side">
              <section className="profile-card contact-card">
                <h2 className="section-title">Liên hệ trực tiếp</h2>
                <div className="contact-person">
                  <div className="contact-avatar">CEO</div>
                  <div className="contact-info">
                    <strong>Nguyễn Văn A</strong>
                    <span>Giám đốc điều hành</span>
                    <p className="email-link">✉️ contact@company.com</p>
                  </div>
                </div>
              </section>

              <section className="profile-card">
                <div className="card-header-flex">
                  <h2 className="section-title">Dự án tiêu biểu</h2>
                  {isEditing && <button className="add-btn">+ Thêm</button>}
                </div>
                <div className="project-list">
                  <div className="project-item">
                    <div className="project-icon">🚀</div>
                    <div className="project-text">
                      <strong>Baito Link Platform</strong>
                      <p>Hệ thống kết nối nhân tài IT toàn cầu.</p>
                    </div>
                  </div>
                  <div className="project-item">
                    <div className="project-icon">📊</div>
                    <div className="project-text">
                      <strong>Enterprise Analytics</strong>
                      <p>Giải pháp phân tích dữ liệu chuyên sâu.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;