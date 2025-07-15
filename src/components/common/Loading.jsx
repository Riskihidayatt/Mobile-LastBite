import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const Loading = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const backgroundColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const indicatorColor = isDarkMode ? '#34D399' : '#28A745';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size="large" color={indicatorColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
