import { useState } from 'react';
import './pages.css';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple client-side: open mail client
    const form = new FormData(e.target);
    const subject = encodeURIComponent(`Support request: ${form.get('subject')}`);
    const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`);
    window.location.href = `mailto:support@yourstore.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="page container page-top">
      <p>If you need help, email <a href="mailto:support@yourstore.com">support@yourstore.com</a> or send us a message here.</p>
      {sent && <p className="muted">Your message was prepared in your email client.</p>}

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>Name<input name="name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Subject<input name="subject" required /></label>
        <label>Message<textarea name="message" rows="6" required /></label>
        <button type="submit" className="btn">Send</button>
      </form>
    </div>
  );
}
