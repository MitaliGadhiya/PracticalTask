import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme';

interface CustomHeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onBack,
  rightComponent,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.sm },
        transparent && styles.transparent,
        style,
      ]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.content}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.rightContainer}>
          {rightComponent ?? <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  transparent: {
    backgroundColor: Colors.transparent,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  backIcon: {
    color: Colors.text,
    fontSize: FontSize.xxl,
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
});

export default memo(CustomHeader);
