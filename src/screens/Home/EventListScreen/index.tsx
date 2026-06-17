import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeStackParamList, Event } from '../../../types';
import { FontSize, FontWeight, Spacing } from '../../../theme';
import EventCard from '../../../components/EventCard';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import { useEvents } from '../../../hooks/useEvents';
import { useAppSelector } from '../../../redux/hooks';
import { Strings } from '../../../constants';

type EventListScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'EventList'>;
};

const EventListScreen: React.FC<EventListScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useAppSelector(state => state.auth.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Guest';

  const { events, isLoading, isRefreshing, isLoadingMore, error, fetchEvents, refresh, loadMore } =
    useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }, [isLoadingMore]);

  const renderHeader = useCallback(
    () => (
      <View style={[styles.pageHeader, { paddingTop: insets.top + Spacing.base }]}>
        <Text style={styles.greeting}>Hello {firstName}!</Text>
        <Text style={styles.subtitle}>Are you ready to dance?</Text>
      </View>
    ),
    [firstName, insets.top],
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
    backgroundColor: '#FFFFFF',
  },
  pageHeader: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  greeting: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: '#9CA3AF',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
});

export default EventListScreen;
