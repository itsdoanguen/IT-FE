import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Lichsucongviec.module.css';
import { fetchMyApplications } from '../../services/api';

const STATUS_MAP = {
  cho_duyet: { label: 'Đang chờ duyệt', class: 'status-pending' },
  chap_nhan: { label: 'Đã chấp nhận (Phỏng vấn)', class: 'status-accepted' },
  tu_choi: { label: 'Từ chối', class: 'status-rejected' },
  hoan_thanh: { label: 'Đã trúng tuyển', class: 'status-completed' },
  het_hieu_luc: { label: 'Hết hiệu lực', class: 'status-expired' },
};

const Lichsucongviec = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchMyApplications();
        // data usually comes as an array from the backend for this endpoint
        setApplications(Array.isArray(data) ? data : (data.results || []));
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử ứng tuyển:', error);
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) return <div className={styles.container}>Đang tải lịch sử...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Lịch sử ứng tuyển công việc</h1>
        <p>Theo dõi trạng thái các công việc bạn đã nộp đơn</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Công việc</th>
              <th>Công ty</th>
              <th>Ngày nộp</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id}>
                  <td className={styles.jobTitle}>{app.job_title}</td>
                  <td>{app.company_name}</td>
                  <td>{formatDate(app.thoi_gian_ung_tuyen)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[STATUS_MAP[app.trang_thai]?.class || 'status-pending']}`}>
                      {STATUS_MAP[app.trang_thai]?.label || app.trang_thai}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.viewButton}
                      onClick={() => navigate(`/tin-tuyen-dung/${app.tin}`)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.emptyRow}>
                  Bạn chưa ứng tuyển công việc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lichsucongviec;
