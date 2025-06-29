import React, { useState, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

// Extracted LoginForm component
const LoginForm = memo(({
  navigateToMode,
  handleAuth,
  formData,
  handleEmailChange,
  handlePasswordChange,
  showPassword,
  togglePasswordVisibility,
  emailRef,
  passwordRef
}) => (
  <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={0}
  >
    <ScrollView 
      style={styles.formContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View style={styles.formHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateToMode('hub')}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.formTitle}>Welcome Back</Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#666666" style={styles.inputIcon} />
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666666"
              value={formData.email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#666666" style={styles.inputIcon} />
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666666"
              value={formData.password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleAuth}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={20} color="#666666" />
              ) : (
                <Eye size={20} color="#666666" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigateToMode('forgot')}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleAuth}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigateToMode('signup')}
          activeOpacity={0.7}
        >
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
));

// Extracted SignupForm component
const SignupForm = memo(({
  navigateToMode,
  handleAuth,
  formData,
  handleEmailChange,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handleNameChange,
  showPassword,
  togglePasswordVisibility,
  emailRef,
  passwordRef,
  confirmPasswordRef,
  nameRef
}) => (
  <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={0}
  >
    <ScrollView 
      style={styles.formContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View style={styles.formHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateToMode('hub')}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.formTitle}>Create Your Hunter Profile</Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={nameRef}
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666666"
              value={formData.name}
              onChangeText={handleNameChange}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color="#666666" style={styles.inputIcon} />
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666666"
              value={formData.email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#666666" style={styles.inputIcon} />
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666666"
              value={formData.password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={20} color="#666666" />
              ) : (
                <Eye size={20} color="#666666" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#666666" style={styles.inputIcon} />
            <TextInput
              ref={confirmPasswordRef}
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666666"
              value={formData.confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleAuth}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleAuth}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigateToMode('login')}
          activeOpacity={0.7}
        >
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
));

// Extracted ForgotForm component
const ForgotForm = memo(({
  navigateToMode,
  formData,
  handleEmailChange,
  emailRef
}) => (
  <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={0}
  >
    <ScrollView 
      style={styles.formContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View style={styles.formHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateToMode('login')}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.formTitle}>Reset Password</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.forgotDescription}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#666666" style={styles.inputIcon} />
          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666666"
            value={formData.email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => {
            // Handle send reset link
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => navigateToMode('login')}
          activeOpacity={0.7}
        >
          <Text style={styles.switchText}>Remember your password? Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
));

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'hub' | 'login' | 'signup' | 'forgot'>('hub');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  // Refs for input focus management
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

  // Memoized callbacks to prevent re-renders
  const handleEmailChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, email: text }));
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, password: text }));
  }, []);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, confirmPassword: text }));
  }, []);

  const handleNameChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, name: text }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleAuth = useCallback(() => {
    // Simulate authentication
    router.replace('/assessment');
  }, [router]);

  const handleGuestMode = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  const navigateToMode = useCallback((newMode: 'hub' | 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
  }, []);

  const AuthHub = () => (
    <View style={styles.hubContainer}>
      <View style={styles.logoSection}>
        <View style={styles.logoRing}>
          <Text style={styles.logoText}>H</Text>
        </View>
        <Text style={styles.tagline}>Begin Your Evolution</Text>
      </View>

      <View style={styles.authActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigateToMode('signup')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigateToMode('login')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestMode}
          activeOpacity={0.7}
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {mode === 'hub' && <AuthHub />}
      {mode === 'login' && (
        <LoginForm
          navigateToMode={navigateToMode}
          handleAuth={handleAuth}
          formData={formData}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          emailRef={emailRef}
          passwordRef={passwordRef}
        />
      )}
      {mode === 'signup' && (
        <SignupForm
          navigateToMode={navigateToMode}
          handleAuth={handleAuth}
          formData={formData}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          handleConfirmPasswordChange={handleConfirmPasswordChange}
          handleNameChange={handleNameChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          emailRef={emailRef}
          passwordRef={passwordRef}
          confirmPasswordRef={confirmPasswordRef}
          nameRef={nameRef}
        />
      )}
      {mode === 'forgot' && (
        <ForgotForm
          navigateToMode={navigateToMode}
          formData={formData}
          handleEmailChange={handleEmailChange}
          emailRef={emailRef}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardContainer: {
    flex: 1,
  },
  hubContainer: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 18,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  authActions: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A6A6A6',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  formHeader: {
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: Platform.OS === 'android' ? 16 : 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 24,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotText: {
    fontSize: 14,
    color: '#4DABF7',
    fontWeight: '500',
  },
  forgotDescription: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 56,
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  switchText: {
    fontSize: 14,
    color: '#A6A6A6',
    textAlign: 'center',
  },
  switchLink: {
    color: '#4DABF7',
    fontWeight: '600',
  },
});