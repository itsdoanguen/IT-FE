const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildJobsUrl(params = {}) {
  const endpoint = API_BASE_URL
    ? new URL('/api/jobs/posts/', API_BASE_URL)
    : new URL('/api/jobs/posts/', window.location.origin);
  const searchParams = new URLSearchParams();

  if (params.keyword) {
    searchParams.set('q', params.keyword.trim());
  }

  if (params.location && params.location !== 'Tất cả') {
    searchParams.set('dia_diem', params.location.trim());
  }

  searchParams.set('page', String(params.page || 1));
  searchParams.set('limit', String(params.limit || 20));

  endpoint.search = searchParams.toString();
  return endpoint.toString();
}

function normalizeJobPost(item) {
  return {
    id: item.tin_id ?? item.id,
    title: item.title || item.tieu_de || 'Chưa có tiêu đề',
    summary: item.summary || item.description || item.noi_dung || '',
    openings: item.openings || 1,
    location: item.location || item.dia_diem_lam_viec || 'Chưa cập nhật',
    status: item.status || item.trang_thai || '',
  };
}

export async function fetchJobPosts(params = {}) {
  let response;
  try {
    response = await fetch(buildJobsUrl(params), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: params.signal,
    });
  } catch (_networkError) {
    throw new ApiError('Không thể kết nối tới API backend', 0, null);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.detail || payload?.message || 'Không thể tải dữ liệu tuyển dụng';
    throw new ApiError(message, response.status, payload);
  }

  const rawItems = Array.isArray(payload?.results) ? payload.results : [];
  return {
    page: payload?.page || 1,
    limit: payload?.limit || rawItems.length,
    total: payload?.total || rawItems.length,
    results: rawItems.map(normalizeJobPost),
  };
}

export { ApiError };
