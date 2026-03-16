import { h } from 'preact';
import { route } from 'preact-router';
import '../app.css';

export default function Login() {
  return (
    <div class="container">
      <h1>Login Page</h1>
      <p>This is a placeholder for the login page.</p>
      <button onClick={() => route('/')}>Back to Home</button>
    </div>
  );
}
