import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../../theme';

type SocialProvider = 'google' | 'facebook' | 'apple';

interface SocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const PROVIDER_CONFIG: Record<SocialProvider, { label: string; icon: string; color: string; textColor: string }> = {
  google: {
    label: 'Continue with Google',
    icon: '🔍',
    color: Colors.white,
    textColor: Colors.textDark,
  },
  facebook: {
    label: 'Continue with Facebook',
    icon: 'f',
    color: Colors.facebook,
    textColor: Colors.white,
  },
  apple: {
    label: 'Continue with Apple',
    icon: '',
    color: Colors.apple,
    textColor: Colors.white,
  },
};

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress, isLoading, style }) => {
  const config = PROVIDER_CONFIG[provider];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.85}
      style={[styles.button, { backgroundColor: config.color }, style]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: FontSize.lg,
    marginRight: Spacing.sm,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
  },
});

export default memo(SocialButton);
