/**
 * Modal Component
 *
 * A full-screen overlay modal with backdrop and centered content.
 * Supports slide-up animation and backdrop press to close.
 *
 * @example
 * <Modal visible={isOpen} onClose={handleClose}>
 *   <Text>Modal content</Text>
 * </Modal>
 *
 * <Modal visible={isOpen} onClose={handleClose} animationType="fade">
 *   <Text>Fade animation</Text>
 * </Modal>
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  ModalProps as RNModalProps,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, getShadow } from '@/src/constants/theme';

export interface ModalProps {
  /** Modal visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Modal content */
  children: React.ReactNode;

  /** Animation type */
  animationType?: RNModalProps['animationType'];

  /** Additional content styles */
  contentStyle?: ViewStyle;

  /** Prevent backdrop press to close */
  disableBackdropPress?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  contentStyle,
  disableBackdropPress = false,
}) => {
  const handleBackdropPress = () => {
    if (!disableBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable
        style={styles.overlay}
        onPress={handleBackdropPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Close modal"
      >
        {/* Content - Prevent backdrop press from propagating */}
        <Pressable
          style={[styles.content, contentStyle]}
          onPress={(e) => e.stopPropagation()}
          accessible={true}
          accessibilityRole="none"
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.background.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },

  content: {
    backgroundColor: COLORS.background.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxWidth: '90%',
    minWidth: 280,
    ...getShadow('xl'),
  },
});

export default Modal;
