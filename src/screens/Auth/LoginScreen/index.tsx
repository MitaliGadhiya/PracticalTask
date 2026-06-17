import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../../theme';
import { loginWithEmail, loginWithSocial } from '../../../services/api/authService';
import { useAppDispatch } from '../../../redux/hooks';
import { setCredentials } from '../../../redux/slices/authSlice';
import { showErrorToast } from '../../../utils/errorHandler';
import { Strings } from '../../../constants';
import { signInWithGoogle } from '../../../services/social/googleAuth';
import { signInWithFacebook } from '../../../services/social/facebookAuth';
import { signInWithApple } from '../../../services/social/appleAuth';

const schema = yup.object({
  email: yup.string().required(Strings.emailRequired).email(Strings.emailInvalid),
  password: yup.string().required(Strings.passwordRequired).min(8, Strings.passwordMinLength),
});

type FormData = yup.InferType<typeof schema>;

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | 'apple' | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Banner */}
        <View style={[styles.banner, { paddingTop: insets.top + Spacing.xl }]}>
          <Text style={styles.logoText}>Pli&#233;</Text>
          <View style={styles.imagePlaceholder}>
            <View style={styles.brokenImgFrame}>
              <View style={styles.brokenImgDot} />
              <View style={styles.brokenImgMountain} />
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formSection}>

          {/* Email */}
          <Text style={styles.fieldLabel}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputWrapper, !!errors.email && styles.inputWrapperError]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="email@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          {/* Password */}
          <Text style={styles.fieldLabel}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputWrapper, !!errors.password && styles.inputWrapperError]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!passwordVisible}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(v => !v)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.eyeIcon}>{passwordVisible ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={styles.forgotText}>{Strings.forgotPassword}</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInBtn, isSubmitting && styles.signInBtnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={0.85}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.signInBtnText}>{Strings.signIn}</Text>
            )}
          </TouchableOpacity>

          {/* Not a member */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Not a member? </Text>
            <TouchableOpacity>
              <Text style={styles.signUpLink}>Sign Up Here</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Sign in with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Icons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialCircle, styles.googleCircle]}
              onPress={() => handleSocialLogin('google')}
              disabled={socialLoading !== null}
              activeOpacity={0.8}>
              {socialLoading === 'google' ? (
                <ActivityIndicator color="#EA4335" size="small" />
              ) : (
                <Text style={styles.googleText}>G</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialCircle, styles.appleCircle]}
              onPress={() => handleSocialLogin('apple')}
              disabled={socialLoading !== null}
              activeOpacity={0.8}>
              {socialLoading === 'apple' ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.appleText}></Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialCircle, styles.facebookCircle]}
              onPress={() => handleSocialLogin('facebook')}
              disabled={socialLoading !== null}
              activeOpacity={0.8}>
              {socialLoading === 'facebook' ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.facebookText}>f</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Enter as Guest */}
          <TouchableOpacity style={styles.guestRow}>
            <Text style={styles.guestText}>Enter as Guest</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Banner
  banner: {
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
    minHeight: 220,
  },
  logoText: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    color: '#111111',
    letterSpacing: 2,
    marginBottom: Spacing.xl,
  },
  imagePlaceholder: {
    width: 88,
    height: 70,
    backgroundColor: '#BDBDBD',
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brokenImgFrame: {
    width: 36,
    height: 30,
    borderWidth: 2,
    borderColor: '#757575',
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  brokenImgDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#757575',
    position: 'absolute',
    top: 4,
    left: 4,
  },
  brokenImgMountain: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#757575',
    marginBottom: -2,
  },

  // Form
  formSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    backgroundColor: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: BorderRadius.md,
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: '#111827',
    height: '100%',
  },
  eyeBtn: {
    paddingLeft: Spacing.sm,
  },
  eyeIcon: {
    fontSize: FontSize.base,
  },
  errorText: {
    color: '#EF4444',
    fontSize: FontSize.xs,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },

  // Forgot
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotText: {
    color: '#3B82F6',
    fontSize: FontSize.sm,
  },

  // Sign In
  signInBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: BorderRadius.full,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  signInBtnDisabled: {
    opacity: 0.6,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
  },

  // Sign Up
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  signUpText: {
    fontSize: FontSize.sm,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: FontSize.sm,
    color: '#111827',
    fontWeight: FontWeight.semiBold,
    textDecorationLine: 'underline',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: FontSize.sm,
    paddingHorizontal: Spacing.sm,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  socialCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: Spacing.sm,
  },
  googleCircle: {
    backgroundColor: '#FFFFFF',
  },
  appleCircle: {
    backgroundColor: '#FFFFFF',
  },
  facebookCircle: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  googleText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: '#EA4335',
  },
  appleText: {
    fontSize: FontSize.xl,
    color: '#000000',
  },
  facebookText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },

  // Guest
  guestRow: {
    alignSelf: 'flex-end',
    paddingBottom: Spacing.xl,
  },
  guestText: {
    fontSize: FontSize.sm,
    color: '#9CA3AF',
  },
});

export default LoginScreen;
