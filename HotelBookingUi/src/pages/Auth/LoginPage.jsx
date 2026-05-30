import React, { useState } from 'react';

// src/pages/Auth/LoginPage.jsx - quân
// TODO: Form đăng nhập (email, password) + validate + gọi API
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Validate và gọi API
    console.log('Login data:', { email, password });
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
              <div className="text-sm">
                <a href="#" className="font-medium text-gold-600 hover:text-gold-700">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gold-600 hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors"
              >
                Đăng nhập
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
