import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ListRenderItem,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeStackParamList, Event } from '../../../types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../../theme';
import EventCard from '../../../components/EventCard';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import { useEvents } from '../../../hooks/useEvents';
import { debounce } from '../../../utils';
import { APP_CONFIG, Strings } from '../../../constants';

type EventListScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'EventList'>;
};

const CATEGORIES = ['All', 'Music', 'Art', 'Sports', 'Tech', 'Food', 'Film'];

const EventListScreen: React.FC<EventListScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { events, isLoading, isRefreshing, isLoadingMore, error, fetchEvents, refresh, loadMore } =
    useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = useMemo(
    () =>
      debounce((text: string) => {
        fetchEvents({ search: text });
      }, APP_CONFIG.debounceDelay),
    [fetchEvents],
  );

  const handleEventPress = useCallback(
    (event: Event) => {
      navigation.navigate('EventDetails', { event });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<Event> = useCallback(
    ({ item }) => <EventCard event={item} onPress={handleEventPress} />,
    [handleEventPress],
  );

  const keyExtractor = useCallback((item: Event) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  }, [isLoadingMore]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={Strings.searchEvents}
            placeholderTextColor={Colors.textMuted}
            onChangeText={handleSearch}
          />
        </View>
        <View style={styles.categoriesWrapper}>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <View style={[styles.categoryChip, item === 'All' && styles.categoryChipActive]}>
                <Text style={[styles.categoryChipText, item === 'All' && styles.categoryChipTextActive]}>
                  {item}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.categoriesContent}
          />
        </View>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
      </View>
    ),
    [handleSearch],
  );

  if (isLoading) {
    return <Loader visible />;
  }

  if (error && events.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Failed to load events"
          description={error}
          icon="⚠️"
          actionLabel={Strings.retry}
          onAction={() => fetchEvents()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.greeting}>Discover</Text>
          <Text style={styles.title}>{Strings.events}</Text>
        </View>
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </View>
      </View>

      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            title={Strings.noEvents}
            description={Strings.noEventsDescription}
            icon="🎭"
            actionLabel={Strings.refresh}
            onAction={refresh}
          />
        }
        onRefresh={refresh}
        refreshing={isRefreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  notificationBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationIcon: {
    fontSize: FontSize.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  listHeader: {
    marginBottom: Spacing.base,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: FontSize.base,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: Colors.text,
    fontSize: FontSize.base,
  },
  categoriesWrapper: {
    marginBottom: Spacing.base,
  },
  categoriesContent: {
    paddingRight: Spacing.base,
  },
  categoryChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundCard,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
});

export default EventListScreen;
