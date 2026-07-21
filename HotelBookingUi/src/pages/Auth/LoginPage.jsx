import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../services/api/authApi';
import { useAuth } from '../../context/AuthContext';

// src/pages/Auth/LoginPage.jsx - quân
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPasswordBtn, setShowForgotPasswordBtn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authApi.login({ email, password });
      // Giả sử API trả về đối tượng có chứa token và user info
      // NOTE: In a real system, you'd pass rememberMe to login() to save in localStorage vs sessionStorage
      login(response);
      
      if (response.role === 'ADMIN') {
        navigate('/admin'); // Chuyển hướng thẳng vào Admin Dashboard
      } else {
        navigate('/'); // Chuyển hướng về trang chủ
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      setShowForgotPasswordBtn(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Vui lòng nhập email trước khi nhấn Quên mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.forgotPassword({ email });
      alert(response.message || `Đã gửi mã khôi phục đến email: ${email}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi mã khôi phục. Vui lòng kiểm tra lại email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900">
          Đăng nhập vào tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md border border-stone-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                Địa chỉ Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-200 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-gold-400 focus:border-gold-400 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-200 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-gold-400 focus:border-gold-400 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-stone-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                {showForgotPasswordBtn && (
                  <button type="button" onClick={handleForgotPassword} disabled={loading} className="font-medium text-gold-600 hover:text-gold-700">
                    Quên mật khẩu?
                  </button>
                )}
              </div>
            </div>

            {error && <div className="text-sm font-medium text-red-600">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gold-600 hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-stone-500">Chưa có tài khoản? </span>
            <a href="/register" className="font-medium text-gold-600 hover:text-gold-700">
              Đăng ký ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
