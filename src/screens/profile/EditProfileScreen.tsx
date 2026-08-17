// Edit Profile Screen

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
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { Gender } from '../../types';

export const EditProfileScreen = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState<Gender>(user?.gender || 'male');
  const [emergencyName, setEmergencyName] = useState(user?.emergency_contact_name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergency_contact_phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await updateUser({
        full_name: fullName.trim(),
        bio: bio.trim(),
        gender,
        emergency_contact_name: emergencyName.trim(),
        emergency_contact_phone: emergencyPhone.trim(),
      });

      Alert.alert('Profile Updated', 'Your profile details have been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Update Failed', e.message || 'Unable to update profile.');
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
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar url={user?.avatar_url} name={fullName || 'User'} size={80} />
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Change Photo',
                'Photo upload supported via Supabase storage. For MVP, high-resolution default avatars are assigned.'
              )
            }
            style={styles.changePhotoBtn}
          >
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
          />

          <Input
            label="Bio & Commuting Style"
            value={bio}
            onChangeText={setBio}
            placeholder="e.g. Daily commuter, quiet rides, fond of classical music"
            multiline
            numberOfLines={3}
          />

          {/* Gender Selector */}
          <Text style={styles.fieldLabel}>GENDER</Text>
          <View style={styles.genderRow}>
            {[
              { key: 'male', label: 'Male' },
              { key: 'female', label: 'Female' },
              { key: 'other', label: 'Other' },
            ].map((g) => (
              <TouchableOpacity
                key={g.key}
                onPress={() => setGender(g.key as any)}
                style={[
                  styles.genderOption,
                  gender === g.key ? styles.genderOptionActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === g.key ? styles.genderTextActive : null,
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionDivider} />
          <Text style={styles.subHeading}>Emergency Contact Setup</Text>

          <Input
            label="Emergency Contact Name"
            value={emergencyName}
            onChangeText={setEmergencyName}
            placeholder="e.g. Amit Kumar (Brother)"
          />

          <Input
            label="Emergency Contact Phone"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            placeholder="+91 98XXXXXXXX"
            keyboardType="phone-pad"
          />

          <Button
            title="Save Profile"
            onPress={handleSave}
            loading={loading}
            size="lg"
            style={styles.saveBtn}
          />
        </Card>
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
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  changePhotoBtn: {
    marginTop: Spacing.xs,
    padding: Spacing.xs,
  },
  changePhotoText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  fieldLabel: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  genderOptionActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  genderText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  genderTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  subHeading: {
    ...Typography.header3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  saveBtn: {
    marginTop: Spacing.lg,
  },
});
