import { formatDate, formatTime } from './format';
import './PropertyDetail.css';
 
// all_data is a JSON string; the remarks live inside it.
export function getOpenHouseRemarks(allData) {
  try {
    let data = allData;
    if (typeof data === 'string') data = JSON.parse(data);
    if (typeof data === 'string') data = JSON.parse(data); // double-encoded
    return data && typeof data.OpenHouseRemarks === 'string'
      ? data.OpenHouseRemarks.trim()
      : '';
  } catch {
    return '';
  }
}
 
export default function OpenHouses({ openHouses }) {
  const list = Array.isArray(openHouses) ? openHouses : [];
 
  return (
    <section className="detail-section">
      <h2>Open Houses</h2>
      {list.length === 0 ? (
        <p>No open houses scheduled</p>
      ) : (
        <ul className="open-houses">
          {list.map((oh, i) => {
            const remarks = getOpenHouseRemarks(oh.all_data);
            const start = formatTime(oh.OH_StartTime);
            const end = formatTime(oh.OH_EndTime);
            return (
              <li key={`${oh.OpenHouseDate}-${oh.OH_StartTime}-${i}`}>
                <strong>{formatDate(oh.OpenHouseDate)}</strong>
                {start && (
                  <span>
                    {' '}
                    {start}
                    {end ? ` – ${end}` : ''}
                  </span>
                )}
                {remarks && <p>{remarks}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
 