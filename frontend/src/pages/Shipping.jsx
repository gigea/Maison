import './pages.css';

export default function Shipping() {
  return (
    <div className="page container page-top">
      <p>We offer shipping options to keep delivery simple.</p>
      <ul>
        <li><strong>Standard:</strong> 5–7 business days (free over $100).</li>
        <li><strong>Express:</strong> 2–3 business days ($14.99).</li>
        <li><strong>Overnight:</strong> Next business day ($29.99).</li>
      </ul>
      <p>Orders placed before 1pm local time are often processed same day, and tracking details are sent once your order ships.</p>
      <p><strong>International:</strong> timing and fees vary by destination; duties and taxes may apply.</p>
    </div>
  );
}
