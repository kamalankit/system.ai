import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  X 
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttons?: AlertButton[];
  onClose: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = 'info',
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}: CustomAlertProps) {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.8));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIcon = () => {
    const iconProps = { size: 24, strokeWidth: 1.5 };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} color="#51CF66" />;
      case 'error':
        return <XCircle {...iconProps} color="#FF6B6B" />;
      case 'warning':
        return <AlertCircle {...iconProps} color="#FFB366" />;
      default:
        return <Info {...iconProps} color="#4DABF7" />;
    }
  };

  const getIconBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#51CF66' + '20';
      case 'error':
        return '#FF6B6B' + '20';
      case 'warning':
        return '#FFB366' + '20';
      default:
        return '#4DABF7' + '20';
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const getButtonStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return {
          backgroundColor: '#FF6B6B',
          color: '#FFFFFF',
        };
      case 'cancel':
        return {
          backgroundColor: 'transparent',
          color: '#A6A6A6',
          borderWidth: 1,
          borderColor: '#333333',
        };
      default:
        return {
          backgroundColor: '#4DABF7',
          color: '#FFFFFF',
        };
    }
  };

  const getButtonTextStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return { color: '#A6A6A6' };
      default:
        return { color: '#FFFFFF' };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <TouchableOpacity 
            style={styles.backdrop} 
            activeOpacity={1}
            onPress={onClose}
          />
          
          <Animated.View
            style={[
              styles.alertContainer,
              {
                transform: [
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color="#666666" strokeWidth={1.5} />
            </TouchableOpacity>

            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
              {getIcon()}
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              {message && (
                <Text style={styles.message}>{message}</Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              {buttons.map((button, index) => {
                const buttonStyle = getButtonStyle(button.style || 'default');
                const textStyle = getButtonTextStyle(button.style || 'default');
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      buttonStyle,
                      buttons.length === 1 && styles.singleButton,
                    ]}
                    onPress={() => handleButtonPress(button)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.buttonText, textStyle]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 32,
    maxWidth: width - 64,
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  message: {
    fontSize: 16,
    color: '#A6A6A6',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
  },
  singleButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});