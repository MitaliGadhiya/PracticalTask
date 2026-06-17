import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeStackParamList } from '../../../types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../../theme';
import CustomButton from '../../../components/common/CustomButton';
import { useFavorites } from '../../../hooks/useFavorites';
import { formatDate, formatPrice } from '../../../utils';

type EventDetailsScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'EventDetails'>;
  route: RouteProp<HomeStackParamList, 'EventDetails'>;
};

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ navigation, route }) => {
  const { event } = route.params;
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleEventFavorite } = useFavorites();
  const favorited = isFavorite(event.id);

  const handleToggleFavorite = useCallback(() => {
    toggleEventFavorite(event);
  }, [toggleEventFavorite, event]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        title: event.title,
        message: `Check out: ${event.title} on ${formatDate(event.date)} at ${event.location}`,
      });
    } catch {
      // cancelled
    }
  }, [event]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
          <View style={[styles.imageOverlay, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
            <View style={styles.imageActions}>
              <TouchableOpacity onPress={handleToggleFavorite} style={styles.iconBtn}>
                <Text style={[styles.heartIcon, favorited && styles.heartActive]}>
                  {favorited ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
                <Text style={styles.shareIconText}>⬆</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={3}>
              {event.title}
            </Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{formatPrice(event.price, event.isFree)}</Text>
            </View>
          </View>

          {/* Organizer */}
          <View style={styles.organizerRow}>
            <Image
              source={{ uri: event.organizer.imageUrl }}
              style={styles.organizerAvatar}
            />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizedBy}>Organized by</Text>
              <Text style={styles.organizerName}>{event.organizer.name}</Text>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardIcon}>📅</Text>
              <Text style={styles.infoCardLabel}>Date</Text>
              <Text style={styles.infoCardValue}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardIcon}>⏰</Text>
              <Text style={styles.infoCardLabel}>Time</Text>
              <Text style={styles.infoCardValue}>{event.startTime} - {event.endTime}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardIcon}>📍</Text>
              <Text style={styles.infoCardLabel}>Location</Text>
              <Text style={styles.infoCardValue} numberOfLines={2}>{event.location}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardIcon}>👥</Text>
              <Text style={styles.infoCardLabel}>Attendees</Text>
              <Text style={styles.infoCardValue}>{event.attendees}</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.addressIcon}>📌</Text>
              <Text style={styles.addressText}>{event.address}</Text>
            </View>
          </View>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {event.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.base }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{formatPrice(event.price, event.isFree)}</Text>
        </View>
        <CustomButton
          title="Get Tickets"
          onPress={() => {}}
          fullWidth={false}
          style={styles.ticketButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: Colors.white,
    fontSize: FontSize.xl,
  },
  imageActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    color: Colors.white,
    fontSize: FontSize.lg,
  },
  heartActive: {
    color: Colors.heartActive,
  },
  shareIconText: {
    color: Colors.white,
    fontSize: FontSize.base,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
  },
  categoryText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
  },
  content: {
    padding: Spacing.base,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: 32,
  },
  priceBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  priceText: {
    color: Colors.textDark,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    padding: Spacing.base,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  organizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    marginRight: Spacing.sm,
  },
  organizerInfo: {},
  organizedBy: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  organizerName: {
    color: Colors.text,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  infoCardIcon: {
    fontSize: FontSize.xl,
    marginBottom: Spacing.xs,
  },
  infoCardLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginBottom: Spacing.xxs,
  },
  infoCardValue: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    lineHeight: 24,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    fontSize: FontSize.base,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.backgroundInput,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceContainer: {},
  priceLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  priceValue: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  ticketButton: {
    paddingHorizontal: Spacing.xxl,
  },
});

export default EventDetailsScreen;
