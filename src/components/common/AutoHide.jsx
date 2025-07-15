import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const AutoHide = ({ children, duration = 600000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return <>{children}</>;
};

export default AutoHide;
