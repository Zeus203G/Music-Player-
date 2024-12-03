import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';  // Import file CSS

const Dashboard = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Trạng thái tiến độ của bài hát
  const audioRef = useRef(null); // Sử dụng ref để tham chiếu đến <audio>
  const [cdImage, setCdImage] = useState(''); // Dùng để thay đổi hình ảnh đĩa
  const [isRepeat, setIsRepeat] = useState(false);
  const [isRandom, setIsRandom] = useState(false); // Trạng thái chế độ ngẫu nhiên
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);  // State lưu kết quả tìm kiếm
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Chuyển về trang đăng nhập nếu chưa đăng nhập
    } else {
      fetchSongs(token); // Lấy danh sách bài hát khi có token
    }
  }, [navigate]);

  useEffect(() => {
    if (audioRef.current) {
      // Cập nhật tiến độ bài hát khi thời gian bài hát thay đổi
      audioRef.current.addEventListener('timeupdate', updateProgress);
    }
  
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, [isPlaying]); // Chạy lại khi trạng thái isPlaying thay đổi
 // dky sự kiện ended 

 useEffect(() => {
    if (audioRef.current) {
      // Lắng nghe sự kiện 'ended' và xử lý theo chế độ repeat
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }
  
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [isRepeat, currentSong]);

  const fetchSongs = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/songs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Dữ liệu bài hát nhận được:', data);
      if (data && Array.isArray(data)) {
        setSongs(data); // Lưu dữ liệu vào state songs
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài hát:', error);
    }
  };
// chọn bài hát 
  const handleSongSelect = (song) => {
    setCurrentSong(song); // Cập nhật bài hát hiện tại
    setIsPlaying(true); // Đánh dấu là đang phát
    setCdImage(song.images); // Đảm bảo hình ảnh đĩa được cập nhật đúng
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    navigate('/'); // Quay về trang đăng nhập
  };
// dừng và phát nhạc 
const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying); // Đổi trạng thái phát
  };
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false); // Khi bài hát kết thúc, dừng đĩa
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
    };
  }, []);

const updateProgress = () => {
  if (audioRef.current && audioRef.current.duration) {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress); // Cập nhật tiến độ thanh trượt
  }
};
// thanh tiến độ 
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration; // Cập nhật thời gian phát của bài hát
    }
  };
// bài hát trước 
const handlePrev = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length]; // Lấy bài hát trước đó
    setCurrentSong(prevSong); // Cập nhật bài hát hiện tại
    setCdImage(prevSong.images || ''); // Cập nhật ảnh đĩa
    setIsPlaying(true); // Đánh dấu đang phát
  };
  // bài hát sau
  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset thời gian bài hát
    }
  
    let nextSong;
  
    if (isRandom) {
      // Chọn bài hát ngẫu nhiên, đảm bảo không trùng với bài hiện tại
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (songs[randomIndex].id === currentSong.id);
  
      nextSong = songs[randomIndex];
    } else {
      const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      nextSong = songs[(currentIndex + 1) % songs.length];
    }
  
    setCurrentSong(nextSong); // Cập nhật bài hát hiện tại
    setCdImage(nextSong.images || ''); // Cập nhật ảnh đĩa
    setTimeout(() => {
      setIsPlaying(true); // Phát bài hát mới
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error('Lỗi khi phát bài hát:', error);
        });
      }
    }, 0);
  };
  
  
  
  //repeate 
  const handleRepeat = () => {
    setIsRepeat(!isRepeat); // Đảo ngược trạng thái repeat khi nhấn nút
  };
  const handleAudioEnd = () => {
    if (isRepeat) {
      audioRef.current.play(); // Phát lại bài hát nếu chế độ Repeat bật
    } else {
      handleNext(); // Chuyển sang bài tiếp theo nếu không có chế độ Repeat
    }
  };
  // random 
  const toggleRandom = () => {
    setIsRandom(!isRandom); // Chuyển đổi trạng thái ngẫu nhiên
  };

  //search 
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    // Nếu từ khóa tìm kiếm không rỗng, lọc các bài hát theo tên
    if (query) {
      const filteredSongs = songs.filter((song) =>
        song.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredSongs); // Lưu kết quả vào state searchResults
    } else {
      setSearchResults([]); // Nếu không có từ khóa tìm kiếm, xóa kết quả tìm kiếm
    }
  };
  const handleAddSong = () => {
    navigate('/add-song'); // Chuyển hướng đến trang /add-song
  };
  return (
    
    <div className="player">
      <div className="dashboard">
        <header>
          <h4>Now playing:</h4>
          <h2>{currentSong ? currentSong.title : 'Chưa có bài hát'}</h2>
          <p>{currentSong ? currentSong.artist : ''}</p>
        </header>

        <div className="cd">
          {currentSong && (
            <div
            className={`cd-thumb ${isPlaying ? '' : 'paused'}`} // Thêm lớp 'paused' khi không phát
              style={{
                backgroundImage: `url(${cdImage})`, // Thay đổi hình ảnh đĩa dựa trên bài hát đang phát
              }}
            ></div>
          )}
        </div>

       <div className="control">
            <div
         className={`btn btn-repeat ${isRepeat ? 'active' : ''}`}
            onClick={handleRepeat}
             >
             <i className="fas fa-redo"></i>
        </div>
        <div className="btn btn-prev" onClick={handlePrev}>
            <i className="fas fa-step-backward"></i>
        </div>
        <div className="btn btn-toggle-play" onClick={togglePlayPause}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} icon-play`}></i>
        </div>
        <div className="btn btn-next" onClick={handleNext}>
            <i className="fas fa-step-forward"></i>
        </div>
        <div
            className={`btn btn-random ${isRandom ? 'active' : ''}`}
            onClick={toggleRandom}
        >
             <i className="fas fa-random"></i>
        </div>
        </div>

        {currentSong && (
          <audio
            ref={audioRef} // Tham chiếu đến phần tử audio
            src={currentSong.url}
            autoPlay={isPlaying}
            onEnded={handleAudioEnd}
          ></audio>
        )}

        <input
        id="progress"
        className="progress"
        type="range"
        value={progress}
        step="1"
        min="0"
        max="100"
        onChange={handleProgressChange}
        />
      <div className="search">
        <input
          type="text"
          placeholder="Tìm kiếm bài hát..."
          value={searchQuery}
          onChange={handleSearchChange}  // Khi người dùng nhập vào input, update searchQuery
        />
      </div>

      {/* Hiển thị số lượng kết quả tìm kiếm */}
      {searchQuery && (
        <p>
          {isSearchEmpty
            ? 'Không có kết quả tìm kiếm nào.'
            : `Đã tìm thấy ${searchResults.length} bài hát.`}
        </p>
      )}
      </div>
      

      <div className="playlist">
  {/* Kiểm tra xem có kết quả tìm kiếm hay không */}
  {searchQuery && searchResults.length > 0 ? (
    searchResults.map((song) => (
      <div key={song.id} className="song" onClick={() => handleSongSelect(song)}>
        <div className="thumb" style={{ backgroundImage: `url(${song.images})` }}></div>
        <div className="body">
          <h3 className="title">{song.title}</h3>
          <p className="author">{song.artist}</p>
        </div>
        <div className="option">
          <i className="fas fa-ellipsis-h"></i>
        </div>
      </div>
    ))
  ) : !searchQuery && songs.length > 0 ? ( // Nếu không tìm kiếm, hiển thị lại toàn bộ bài hát
    songs.map((song) => (
      <div key={song.id} className="song" onClick={() => handleSongSelect(song)}>
        <div className="thumb" style={{ backgroundImage: `url(${song.images})` }}></div>
        <div className="body">
          <h3 className="title">{song.title}</h3>
          <p className="author">{song.artist}</p>
        </div>
        <div className="option">
          <i className="fas fa-ellipsis-h"></i>
        </div>
      </div>
    ))
  ) : (
    <p>Không có bài hát để hiển thị.</p> // Khi không tìm thấy kết quả
  )}
</div>
        <button onClick={handleAddSong}>Thêm nhạc</button>
      <button onClick={handleLogout}>Đăng Xuất</button>
    </div>
  );
};

export default Dashboard;
