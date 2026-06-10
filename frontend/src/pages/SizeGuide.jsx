import './SizeGuide.css';
import './pages.css';

const SIZE_DATA = {
  tops: [
    { size:'XS', chest:'31-33"', waist:'24-26"', hip:'34-36"' },
    { size:'S',  chest:'34-36"', waist:'27-29"', hip:'37-39"' },
    { size:'M',  chest:'37-39"', waist:'30-32"', hip:'40-42"' },
    { size:'L',  chest:'40-42"', waist:'33-35"', hip:'43-45"' },
    { size:'XL', chest:'43-45"', waist:'36-38"', hip:'46-48"' },
  ],
  bottoms: [
    { size:'XS', waist:'24-26"', hip:'34-36"', inseam:'30"' },
    { size:'S',  waist:'27-29"', hip:'37-39"', inseam:'30"' },
    { size:'M',  waist:'30-32"', hip:'40-42"', inseam:'31"' },
    { size:'L',  waist:'33-35"', hip:'43-45"', inseam:'32"' },
    { size:'XL', waist:'36-38"', hip:'46-48"', inseam:'32"' },
  ],
};

export default function SizeGuide() {
  const data = SIZE_DATA.tops;
  const cols = Object.keys(data[0]);

  return (
    <div className="page container page-top">
      <p className="muted">All measurements are in inches. When between sizes, size up.</p>

      <div className="sg-table-wrap">
        <table className="sg-table">
          <thead>
            <tr>{cols.map(c => <th key={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</th>)}</tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.size}>
                {cols.map(c => <td key={c} className={c==='size'?'sg-size':''}>{row[c]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sg-tips">
        <p><strong>How to measure:</strong></p>
        <p><strong>Chest:</strong> Measure around the fullest part of your chest.</p>
        <p><strong>Waist:</strong> Measure around your natural waistline.</p>
        <p><strong>Hip:</strong> Measure around the fullest part of your hips.</p>
      </div>
    </div>
  );
}
