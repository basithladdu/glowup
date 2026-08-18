import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const Header: React.FC = () => {
  const { selectedDate, setSelectedDate, syncStatus, syncText } = useGlowUpStore();
  const realToday = new Date().toISOString().slice(0, 10);
  const isToday = selectedDate === realToday;

  const dateObj = new Date(selectedDate);
  const formattedDate = `${DAYS[dateObj.getDay()]}, ${dateObj.getDate()} ${MONS[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  const shiftDate = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  return (
    <header className="header-container">
      <div className="brandrow">
        <h1 className="logo-title">GLOW<em>UP</em></h1>
        <span className={`sync-badge ${syncStatus}`}>
          <i className="sync-dot"></i>
          <span>{syncText}</span>
        </span>
      </div>

      <div className="date-nav">
        <button onClick={() => shiftDate(-1)} title="Previous Day">‹</button>
        <div className="curr-date">
          {formattedDate}
          <small>{isToday ? '● Viewing Today' : '● Past / Future Date'}</small>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button onClick={() => shiftDate(1)} title="Next Day">›</button>
          {!isToday && (
            <button className="today-badge" onClick={() => setSelectedDate(realToday)}>
              TODAY
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
