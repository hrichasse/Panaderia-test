import { useEffect, useState } from 'react';

function Toast({ message, type }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className={`toast ${type} ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
}

export default Toast;
