import { h } from 'preact';
import { route } from 'preact-router';
import '../app.css';

export default function Home() {
  const goToLogin = () => {
    route('/login');
  };

  const goToRules = () => {
    route('/rules');
  };

  return (
    <div class="container">
      <h1>Đây là hệ thống tổ chức giải TFT</h1>
      <div class="actions">
        <button onClick={goToLogin}>Login</button>
        <button onClick={goToRules}>Xem thể thức</button>
      </div>
    </div>
  );
}
