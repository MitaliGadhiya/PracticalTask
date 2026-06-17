import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../types';
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme';
import SocialButton from '../../../components/common/SocialButton';
import CustomButton from '../../../components/common/CustomButton';
import { useAppDispatch } from '../../../redux/hooks';
import { setCredentials } from '../../../redux/slices/authSlice';
import { loginWithSocial } from '../../../services/api/authService';
import { showErrorToast } from '../../../utils/errorHandler';
import { signInWithGoogle } from '../../../services/social/googleAuth';
import { signInWithFacebook } from '../../../services/social/facebookAuth';
import { signInWithApple, isAppleAuthAvailable } from '../../../services/social/appleAuth';

type SocialLoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SocialLogin'>;
};

const SocialLoginScreen: React.FC<SocialLoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState<'google' | 'facebook' | 'apple' | null>(null);

  const handleSocialLogin = useCallback(
    async (provider: 'google' | 'facebook' | 'apple') => {
      setLoading(provider);
      try {
        let token = '';
        let email = '';
        let name = '';

        if (provider === 'google') {
          const result = await signInWithGoogle();
          token = result.token;
          email = result.email;
          name = result.name;
        } else if (provider === 'facebook') {
          const result = await signInWithFacebook();
          token = result.token;
          email = result.email;
          name = result.name;
        } else if (provider === 'apple') {
          const result = await signInWithApple();
          token = result.token;
          email = result.email ?? '';
          name = result.name ?? '';
        }

        const auth = await loginWithSocial({ token, provider, email, name });
        dispatch(setCredentials(auth));
      } catch (error) {
        showErrorToast(error);
      } finally {
        setLoading(null);
      }
    },
    [dispatch],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + Spacing.xl },
      ]}>
      <View style={styles.header}>
        <Text style={styles.title}>Join Plie</Text>
        <Text style={styles.subtitle}>Choose how you'd like to continue</Text>
      </View>
      <View style={styles.buttons}>
        <SocialButton
          provider="google"
          onPress={() => handleSocialLogin('google')}
          isLoading={loading === 'google'}
        />
        <SocialButton
          provider="facebook"
          onPress={() => handleSocialLogin('facebook')}
          isLoading={loading === 'facebook'}
        />
        {isAppleAuthAvailable() && (
          <SocialButton
            provider="apple"
            onPress={() => handleSocialLogin('apple')}
            isLoading={loading === 'apple'}
          />
        )}
      </View>
      <CustomButton
        title="Sign in with Email"
        onPress={() => navigation.navigate('Login')}
        variant="outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    textAlign: 'center',
  },
  buttons: {
    marginBottom: Spacing.xl,
  },
});

export default SocialLoginScreen;
