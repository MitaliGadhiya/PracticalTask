import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
  Dimensions,
} from 'react-native';
import { Event } from '../../types';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import { formatDate, formatPrice } from '../../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.base * 2;

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
  horizontal?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, horizontal = false }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);
  const isFavorite = favorites.some(fav => fav.id === event.id);

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(event));
  }, [dispatch, event]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        title: event.title,
        message: `Check out this event: ${event.title} on ${formatDate(event.date)} at ${event.location}`,
      });
    } catch {
      // Share cancelled or failed
    }
  }, [event]);

  const handlePress = useCallback(() => {
    onPress(event);
  }, [onPress, event]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.card, horizontal ? styles.horizontalCard : styles.verticalCard]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.actionButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.heartIcon, isFavorite && styles.heartActive]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.actionButton, styles.shareButton]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.shareIcon}>⬆</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{formatPrice(event.price, event.isFree)}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText} numberOfLines={1}>
            {formatDate(event.date)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.attendeesContainer}>
            <Text style={styles.attendeesText}>👥 {event.attendees} going</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  verticalCard: {
    width: CARD_WIDTH,
  },
  horizontalCard: {
    width: 280,
    marginRight: Spacing.base,
    marginBottom: 0,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  categoryText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
  },
  actions: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    marginLeft: Spacing.xs,
  },
  heartIcon: {
    color: Colors.white,
    fontSize: FontSize.lg,
  },
  heartActive: {
    color: Colors.heartActive,
  },
  shareIcon: {
    color: Colors.white,
    fontSize: FontSize.md,
  },
  priceBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
  },
  priceText: {
    color: Colors.textDark,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  content: {
    padding: Spacing.base,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  infoIcon: {
    fontSize: FontSize.sm,
    marginRight: Spacing.xs,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  attendeesContainer: {},
  attendeesText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
});

export default memo(EventCard);
