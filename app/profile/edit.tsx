import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Save, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone,
  CreditCard as Edit3,
  Camera
} from 'lucide-react-native';
import { userData } from '@/data/mockData';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import CustomAlert from '@/components/CustomAlert';

interface ProfileData {
  name: string;
  email: string;
  age: string;
  location: string;
  phone: string;
  bio: string;
  goals: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: userData.profile.name,
    email: 'hunter@evolution.com',
    age: '28',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    bio: 'Dedicated hunter on a journey of self-improvement and evolution across all life domains.',
    goals: 'Reach S-Class rank, master all domains, and help others on their evolution journey.',
  });

  // Refs for input focus management
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const ageRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);
  const goalsRef = useRef<TextInput>(null);

  const handleSave = () => {
    Keyboard.dismiss();
    
    // Validate required fields
    if (!profileData.name.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Name is required',
        type: 'error',
      });
      return;
    }
    
    if (!profileData.email.trim()) {
      showAlert({
        title: 'Validation Error',
        message: 'Email is required',
        type: 'error',
      });
      return;
    }

    // Simulate saving profile
    showAlert({
      title: 'Profile Updated! 🎉',
      message: 'Your profile has been updated successfully!',
      type: 'success',
      buttons: [
        {
          text: 'Continue',
          onPress: () => router.back(),
        },
      ],
    });
  };

  const handleChangeAvatar = () => {
    showAlert({
      title: 'Change Avatar',
      message: 'Choose how you want to update your avatar',
      type: 'info',
      buttons: [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Photo Library', onPress: () => console.log('Open photo library') },
        { text: 'Cancel', style: 'cancel' },
      ],
    });
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Keyboard.dismiss();
              router.back();
            }}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Save size={20} color="#4DABF7" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="none"
          bounces={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color="#FFFFFF" strokeWidth={1.5} />
              </View>
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handleChangeAvatar}
                activeOpacity={0.7}
              >
                <Camera size={16} color="#FFFFFF" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarText}>Tap to change avatar</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    ref={nameRef}
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#666666"
                    value={profileData.name}
                    onChangeText={(text) => updateField('name', text)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    textContentType="name"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    enablesReturnKeyAutomatically={false}
                    clearButtonMode="while-editing"
                    keyboardDismissMode="none"
                    includeFontPadding={false}
                    textAlignVertical="center"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#666666"
                    value={profileData.email}
                    onChangeText={(text) => updateField('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    textContentType="emailAddress"
                    onSubmitEditing={() => ageRef.current?.focus()}
                    enablesReturnKeyAutomatically={false}
                    clearButtonMode="while-editing"
                    keyboardDismissMode="none"
                    includeFontPadding={false}
                    textAlignVertical="center"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    ref={ageRef}
                    style={styles.input}
                    placeholder="Enter your age"
                    placeholderTextColor="#666666"
                    value={profileData.age}
                    onChangeText={(text) => updateField('age', text)}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    onSubmitEditing={() => locationRef.current?.focus()}
                    enablesReturnKeyAutomatically={false}
                    clearButtonMode="while-editing"
                    keyboardDismissMode="none"
                    includeFontPadding={false}
                    textAlignVertical="center"
                  />
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    ref={locationRef}
                    style={styles.input}
                    placeholder="Enter your location"
                    placeholderTextColor="#666666"
                    value={profileData.location}
                    onChangeText={(text) => updateField('location', text)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    textContentType="addressCity"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                    enablesReturnKeyAutomatically={false}
                    clearButtonMode="while-editing"
                    keyboardDismissMode="none"
                    includeFontPadding={false}
                    textAlignVertical="center"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <View style={styles.inputContainer}>
                  <Phone size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    ref={phoneRef}
                    style={styles.input}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#666666"
                    value={profileData.phone}
                    onChangeText={(text) => updateField('phone', text)}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    textContentType="telephoneNumber"
                    onSubmitEditing={() => bioRef.current?.focus()}
                    enablesReturnKeyAutomatically={false}
                    clearButtonMode="while-editing"
                    keyboardDismissMode="none"
                    includeFontPadding={false}
                    textAlignVertical="center"
                  />
                </View>
              </View>
            </View>

            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <View style={styles.textAreaContainer}>
                  <Edit3 size={20} color="#666666" style={styles.textAreaIcon} />
                  <TextInput
                    ref={bioRef}
                    style={styles.textArea}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor="#666666"
                    value={profileData.bio}
                    onChangeText={(text) => updateField('bio', text)}
                    multiline
                    numberOfLines={4}
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="next"
                    onSubmitEditing={() => goalsRef.current?.focus()}
                    enablesReturnKeyAutomatically={false}
                    keyboardDismissMode="none"
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Goals</Text>
                <View style={styles.textAreaContainer}>
                  <Edit3 size={20} color="#666666" style={styles.textAreaIcon} />
                  <TextInput
                    ref={goalsRef}
                    style={styles.textArea}
                    placeholder="What are your evolution goals?"
                    placeholderTextColor="#666666"
                    value={profileData.goals}
                    onChangeText={(text) => updateField('goals', text)}
                    multiline
                    numberOfLines={4}
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    autoFocus={false}
                    blurOnSubmit={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                    enablesReturnKeyAutomatically={false}
                    keyboardDismissMode="none"
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveButtonLarge} 
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4DABF7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  avatarText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontWeight: '500',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A6A6A6',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
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
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  textAreaContainer: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 120,
    alignItems: 'flex-start',
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 88,
    textAlignVertical: 'top',
    includeFontPadding: false,
  },
  saveButtonLarge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});