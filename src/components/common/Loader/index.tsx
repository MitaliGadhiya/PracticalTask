import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../../theme';

interface LoaderProps {
  visible?: boolean;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const Loader: React.FC<LoaderProps> = ({
  visible = true,
  overlay = false,
  size = 'large',
  color = Colors.primary,
  style,
}) => {
  if (!visible) return null;

  if (overlay) {
    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.box}>
            <ActivityIndicator size={size} color={color} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={[styles.inline, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 24,
  },
  inline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});

export default memo(Loader);
