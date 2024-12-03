import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Thêm state cho checkbox "Nhớ mật khẩu"
  const navigate = useNavigate();

  // Tự động điền email và mật khẩu từ Local Storage nếu có
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (email, password) => {
    const url = 'http://localhost:3000/api/auth/login';
    const body = { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.message === 'Login successful') {
        setMessage('Đăng nhập thành công!');
        console.log('Login successful, token:', data.token);
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);

        if (rememberMe) {
          // Lưu email và mật khẩu vào Local Storage nếu người dùng chọn "Nhớ mật khẩu"
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('savedPassword', password);
        } else {
          // Xóa thông tin nếu người dùng không chọn "Nhớ mật khẩu"
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }

        // Chuyển hướng tới Dashboard
        navigate('/dashboard');
      } else {
        setMessage(`Đăng nhập thất bại: ${data.message}`);
      }
    } catch (error) {
      setMessage('Đã xảy ra lỗi khi đăng nhập.');
      console.error('Error:', error);
    }
  };

  const handleSignup = async (email, password, username) => {
    const url = 'http://localhost:3000/api/auth/register';
    const body = { email, password, username };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.message === 'User registered successfully') {
        setMessage('Đăng ký thành công! Hãy đăng nhập.');
      } else {
        setMessage(`Đăng ký thất bại: ${data.message}`);
      }
    } catch (error) {
      setMessage('Đã xảy ra lỗi khi đăng ký.');
      console.error('Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'login') {
      handleLogin(email, password);
    } else if (type === 'signup') {
      handleSignup(email, password, username);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1>{type === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <input
              type="text"
              placeholder="Tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {type === 'login' && (
          <div className="nhomatkhau">
          <input
            type="checkbox"
            className="remember-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label>Nhớ mật khẩu</label>
        </div>
          )}
          <button type="submit">{type === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
