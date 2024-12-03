import React, { useState } from "react";
import AuthForm from "../components/AuthForm";  // Đảm bảo đường dẫn chính xác

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-page">
      <AuthForm type={isLogin ? "login" : "signup"} />
      <div className="auth-toggle">
        <p>
          {isLogin ? (
            <>
              Chưa có tài khoản?{" "}
              <button onClick={toggleForm}>Đăng Ký</button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button onClick={toggleForm}>Đăng Nhập</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
