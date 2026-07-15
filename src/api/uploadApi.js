import api from './axiosInstance';

const uploadApi = {
  uploadSingle: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
        : undefined
    });
  },
  uploadMultiple: (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
        : undefined
    });
  }
};

export default uploadApi;
