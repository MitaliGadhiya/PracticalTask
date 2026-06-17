import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../../theme';
import CustomButton from '../../../components/common/CustomButton';
import CustomInput from '../../../components/common/CustomInput';
import SocialButton from '../../../components/common/SocialButton';
import { loginWithEmail, loginWithSocial } from '../../../services/api/authService';
import { useAppDispatch } from '../../../redux/hooks';
import { setCredentials } from '../../../redux/slices/authSlice';
import { showErrorToast } from '../../../utils/errorHandler';
import { Strings } from '../../../constants';
import { signInWithGoogle } from '../../../services/social/googleAuth';
import { signInWithFacebook } from '../../../services/social/facebookAuth';
import { signInWithApple, isAppleAuthAvailable } from '../../../services/social/appleAuth';

const schema = yup.object({
  email: yup.string().required(Strings.emailRequired).email(Strings.emailInvalid),
  password: yup.string().required(Strings.passwordRequired).min(8, Strings.passwordMinLength),
});

type FormData = yup.InferType<typeof schema>;

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | 'apple' | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const auth = await loginWithEmail({ email: data.email, password: data.password });
        dispatch(setCredentials(auth));
      } catch (error) {
        showErrorToast(error);
      }
    },
    [dispatch],
  );

  const handleSocialLogin = useCallback(
    async (provider: 'google' | 'facebook' | 'apple') => {
      setSocialLoading(provider);
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
        // Silently ignore "Not configured" / "Not available" — user already saw the alert
        const msg = error instanceof Error ? error.message : '';
        if (msg !== 'Not configured' && msg !== 'Not available' && msg !== 'Google sign-in cancelled') {
          showErrorToast(error);
        }
      } finally {
        setSocialLoading(null);
      }
    },
    [dispatch],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.appName}>Plie</Text>
          <Text style={styles.tagline}>Discover Amazing Events</Text>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back 👋</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue exploring events</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                isPassword
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>{Strings.forgotPassword}</Text>
          </TouchableOpacity>
        </View>

        {/* Login CTA */}
        <CustomButton
          title={Strings.signIn}
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          style={styles.loginButton}
        />

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{Strings.orContinueWith}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social */}
        <View style={styles.socialContainer}>
          <SocialButton
            provider="google"
            onPress={() => handleSocialLogin('google')}
            isLoading={socialLoading === 'google'}
          />
          <SocialButton
            provider="facebook"
            onPress={() => handleSocialLogin('facebook')}
            isLoading={socialLoading === 'facebook'}
          />
          {isAppleAuthAvailable() && (
            <SocialButton
              provider="apple"
              onPress={() => handleSocialLogin('apple')}
              isLoading={socialLoading === 'apple'}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: FontWeight.bold,
  },
  appName: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xxs,
  },
  welcomeContainer: {
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  form: {
    marginBottom: Spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.xs,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  loginButton: {
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    paddingHorizontal: Spacing.base,
  },
  socialContainer: {},
});

export default LoginScreen;
