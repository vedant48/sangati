// Interactive Location Search and Coordinate Picker Modal

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { searchPlaces, GeocodingResult } from '../../lib/geocoding';
import { LocationCoordinate } from '../../types';

interface LocationPickerModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSelectLocation: (location: LocationCoordinate) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  title,
  onClose,
  onSelectLocation,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!visible) {
      setQuery('');
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const items = await searchPlaces(query);
          setResults(items);
        } catch (e) {
          // ignore
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: GeocodingResult) => {
    onSelectLocation({
      latitude: item.lat,
      longitude: item.lng,
      name: item.name,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Modal Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.inputContainer}>
          <Input
            placeholder="Search address, landmark, metro station..."
            value={query}
            onChangeText={setQuery}
            autoFocus
            leftIcon={<Text style={{ fontSize: 16 }}>🔍</Text>}
            rightIcon={
              query ? <Text style={{ color: Colors.textMuted, fontSize: 14 }}>✕</Text> : undefined
            }
            onRightIconPress={() => setQuery('')}
          />
        </View>

        {isSearching && (
          <View style={styles.searchingBox}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.searchingText}>Searching places...</Text>
          </View>
        )}

        {/* Results List */}
        <FlatList
          data={results}
          keyExtractor={(item) => item.placeId || `${item.lat}-${item.lng}`}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelect(item)}
              style={styles.resultItem}
            >
              <Text style={styles.resultPin}>📍</Text>
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultAddress} numberOfLines={2}>
                  {item.displayName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !isSearching && query.length >= 2 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No matching locations found.</Text>
                <Text style={styles.emptySubText}>
                  Try entering a nearby major street, landmark or city area.
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.header3,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  closeBtnText: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  inputContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  searchingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  searchingText: {
    ...Typography.caption,
    marginLeft: Spacing.sm,
    color: Colors.textSecondary,
  },
  listContainer: {
    padding: Spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultPin: {
    fontSize: 18,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resultAddress: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyBox: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  emptySubText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
