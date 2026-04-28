import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Danhgiaungvien.module.css';
import { fetchCandidateEvaluation, updateCandidateEvaluation } from '../../services/api';

const STATUS_OPTIONS = [
  { value: 'cho_duyet', label: 'Đang xem xét' },
  { value: 'chap_nhan', label: 'Phỏng vấn' },
  { value: 'tu_choi', label: 'Đã từ chối' },
  { value: 'hoan_thanh', label: 'Đã trúng tuyển' },
];

const Danhgiaungvien = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCandidateEvaluation(id);
        setCandidate(data);
        setRating(data.rating || 0);
        setComment(data.comment || '');
        setStatus(data.status || 'cho_duyet');
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thông tin đánh giá ứng viên:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateCandidateEvaluation(id, {
        status,
        rating,
        comment,
      });
      alert('Đã cập nhật thông tin đánh giá ứng viên thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật đánh giá:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  if (loading) return <div className={styles.container}>Đang tải dữ liệu...</div>;
  if (!candidate) return <div className={styles.container}>Không tìm thấy thông tin ứng viên hoặc đơn ứng tuyển.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <h1>Đánh giá ứng viên</h1>
      </div>

      {/* 1. Thông tin về ứng viên */}
      <section className={styles.section}>
        <h2>
          <span role="img" aria-label="user">👤</span> 
          Thông tin về ứng viên
        </h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Họ tên</span>
            <span className={styles.infoValue}>{candidate.full_name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{candidate.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Số điện thoại</span>
            <span className={styles.infoValue}>{candidate.phone_number}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Vị trí ứng tuyển</span>
            <span className={styles.infoValue}>{candidate.position}</span>
          </div>
        </div>
      </section>

      {/* 2. Trạng thái ứng tuyển */}
      <section className={styles.section}>
        <h2>
          <span role="img" aria-label="status">📊</span> 
          Trạng thái ứng tuyển
        </h2>
        <div className={styles.statusContainer}>
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.statusButton} ${status === option.value ? styles.statusButtonActive : ''}`}
              onClick={() => setStatus(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Đánh giá ứng viên */}
      <section className={styles.section}>
        <h2>
          <span role="img" aria-label="rating">⭐</span> 
          Đánh giá ứng viên
        </h2>
        <div className={styles.evaluationForm}>
          <div className={styles.ratingContainer}>
            <span className={styles.infoLabel}>Chấm điểm (Rating):</span>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${star <= rating ? styles.starFilled : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nhận xét:</span>
            <textarea
              className={styles.commentArea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập nhận xét về ứng viên..."
            />
          </div>
        </div>
      </section>

      {/* 4. Thông tin ứng tuyển */}
      <section className={styles.section}>
        <h2>
          <span role="img" aria-label="info">📝</span> 
          Thông tin ứng tuyển chi tiết
        </h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Vị trí ứng tuyển</span>
            <span className={styles.infoValue}>{candidate.position}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ngày nộp hồ sơ</span>
            <span className={styles.infoValue}>{candidate.applied_date}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>File CV</span>
            <a href={candidate.cv_url} className={styles.cvLink} target="_blank" rel="noopener noreferrer">
              Xem CV chi tiết
            </a>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Trạng thái hiện tại</span>
            <span className={styles.infoValue}>
              {STATUS_OPTIONS.find(o => o.value === status)?.label}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Cập nhật */}
      <div className={styles.footer}>
        <button className={styles.updateButton} onClick={handleUpdate}>
          Cập nhật thông tin
        </button>
      </div>
    </div>
  );
};

export default Danhgiaungvien;
