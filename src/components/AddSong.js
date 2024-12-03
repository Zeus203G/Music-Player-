import React, { useState } from 'react';

const AddSong = () => {
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    duration: 0,
    url: '',
    images: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    url: '',
    images: ''
  });

  const [message, setMessage] = useState(''); // Để hiển thị thông báo cho người dùng

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSong({
      ...newSong,
      [name]: value
    });
  };

  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;

    // Kiểm tra các trường
    if (!newSong.title) {
      formErrors.title = 'Tên bài hát là bắt buộc';
      isValid = false;
    } else {
      formErrors.title = '';
    }

    if (!newSong.artist) {
      formErrors.artist = 'Nghệ sĩ là bắt buộc';
      isValid = false;
    } else {
      formErrors.artist = '';
    }

    if (!newSong.album) {
      formErrors.album = 'Album là bắt buộc';
      isValid = false;
    } else {
      formErrors.album = '';
    }

    if (newSong.duration <= 0) {
      formErrors.duration = 'Thời gian phải là số dương';
      isValid = false;
    } else {
      formErrors.duration = '';
    }

    if (!newSong.url) {
      formErrors.url = 'URL bài hát là bắt buộc';
      isValid = false;
    } else {
      formErrors.url = '';
    }

    if (!newSong.images) {
      formErrors.images = 'URL ảnh là bắt buộc';
      isValid = false;
    } else {
      formErrors.images = '';
    }

    setErrors(formErrors); // Cập nhật lỗi
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Đang thêm bài hát:', newSong);

      try {
        // Gửi dữ liệu lên API
        const response = await fetch('http://localhost:3000/api/songs/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newSong) // Gửi dữ liệu bài hát dưới dạng JSON
        });

        // Kiểm tra nếu phản hồi từ API thành công
        if (response.ok) {
          const data = await response.json();
          console.log('Bài hát đã được thêm:', data);
          setMessage('Thêm bài hát thành công!');

          // Reset các trường dữ liệu
          setNewSong({
            title: '',
            artist: '',
            album: '',
            duration: 0,
            url: '',
            images: ''
          });

        } else {
          setMessage('Có lỗi khi thêm bài hát. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu:', error);
        setMessage('Không thể kết nối đến server. Vui lòng thử lại sau.');
      }
    } else {
      console.log('Dữ liệu không hợp lệ');
    }
  };

  return (
    <div>
      <h2>Thêm bài hát mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Tên bài hát"
            value={newSong.title}
            onChange={handleInputChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div>
          <input
            type="text"
            name="artist"
            placeholder="Nghệ sĩ"
            value={newSong.artist}
            onChange={handleInputChange}
          />
          {errors.artist && <span className="error">{errors.artist}</span>}
        </div>
        <div>
          <input
            type="text"
            name="album"
            placeholder="Album"
            value={newSong.album}
            onChange={handleInputChange}
          />
          {errors.album && <span className="error">{errors.album}</span>}
        </div>
        <div>
          <input
            type="number"
            name="duration"
            placeholder="Thời gian (giây)"
            value={newSong.duration}
            onChange={handleInputChange}
          />
          {errors.duration && <span className="error">{errors.duration}</span>}
        </div>
        <div>
          <input
            type="text"
            name="url"
            placeholder="URL bài hát"
            value={newSong.url}
            onChange={handleInputChange}
          />
          {errors.url && <span className="error">{errors.url}</span>}
        </div>
        <div>
          <input
            type="text"
            name="images"
            placeholder="URL ảnh bài hát"
            value={newSong.images}
            onChange={handleInputChange}
          />
          {errors.images && <span className="error">{errors.images}</span>}
        </div>
        <button type="submit">Thêm bài hát</button>
      </form>

      {/* Hiển thị thông báo kết quả */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddSong;
