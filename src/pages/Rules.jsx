import { h } from 'preact';
import { route } from 'preact-router';
import '../app.css';

export default function Rules() {
  return (
    <div class="container">
      <h1>Thể thức thi đấu</h1>
      <p>This is a placeholder for the rules/format page.</p>
      <button onClick={() => route('/')}>Back to Home</button>
    </div>
  );
}
