import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { Event } from '../../../types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../../theme';
import EventCard from '../../../components/EventCard';
import EmptyState from '../../../components/common/EmptyState';
import { useFavorites } from '../../../hooks/useFavorites';
import { Strings } from '../../../constants';

type FavoritesNavigation = NativeStackNavigationProp<{ EventDetails: { event: Event } }>;

const FavoritesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<FavoritesNavigation>();
  const { favorites, removeFromFavorites, clearAllFavorites, favoritesCount } = useFavorites();

  const handleEventPress = useCallback(
    (event: Event) => {
      navigation.navigate('EventDetails', { event });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<Event> = useCallback(
    ({ item }) => (
      <View style={styles.cardWrapper}>
        <EventCard event={item} onPress={handleEventPress} />
        <TouchableOpacity
          onPress={() => removeFromFavorites(item.id)}
          style={styles.removeButton}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
          <Text style={styles.removeText}>✕ Remove</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleEventPress, removeFromFavorites],
  );

  const keyExtractor = useCallback((item: Event) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Your</Text>
          <Text style={styles.headerTitle}>{Strings.favorites}</Text>
        </View>
        {favoritesCount > 0 && (
          <View style={styles.headerRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{favoritesCount}</Text>
            </View>
            <TouchableOpacity onPress={clearAllFavorites} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title={Strings.noFavorites}
            description={Strings.noFavoritesDescription}
            icon="💝"
          />
        }
        removeClippedSubviews
        maxToRenderPerBatch={8}
        windowSize={8}
      />
    </View>
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
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  headerLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  countText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  clearButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  clearText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  emptyContent: {
    flex: 1,
  },
  cardWrapper: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    bottom: Spacing.base + 8,
    right: Spacing.base,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  removeText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});

export default FavoritesScreen;
