// Forgot Password Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { resetPasswordForEmail } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await resetPasswordForEmail(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the email associated with your account and we will send you password reset instructions.
          </Text>

          {submitted ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✉️</Text>
              <Text style={styles.successTitle}>Instructions Sent</Text>
              <Text style={styles.successText}>
                If an account exists for {email}, you will receive a reset email shortly.
              </Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={{ marginTop: Spacing.md }}
              />
            </View>
          ) : (
            <>
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Input
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Text>✉️</Text>}
              />

              <Button
                title="Send Reset Link"
                onPress={handleReset}
                loading={loading}
                size="lg"
                style={styles.resetBtn}
              />
            </>
          )}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    ...Typography.header2,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  resetBtn: {
    marginTop: Spacing.md,
  },
  backBtn: {
    alignSelf: 'center',
    marginTop: Spacing.lg,
  },
  backText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
  errorBox: {
    backgroundColor: Colors.dangerLight,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    textAlign: 'center',
  },
  successBox: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  successIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  successTitle: {
    ...Typography.header3,
    color: Colors.textPrimary,
  },
  successText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
