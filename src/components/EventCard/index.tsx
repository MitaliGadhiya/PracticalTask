import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { Event } from '../../types';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
  horizontal?: boolean;
}

const formatEventDate = (dateStr: string, startTime?: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const base = `${day}.${month}.${year}`;
  if (startTime && startTime !== '00:00') {
    const [h, m] = startTime.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const h12 = hour % 12 || 12;
    return `${base} @${h12}${m !== '00' ? ':' + m : ''}${ampm}`;
  }
  return base;
};

const formatEventPrice = (price: number | null, isFree: boolean): string => {
  if (isFree || price === null || price === 0) return 'Free';
  return `€${price}`;
};

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
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
        message: `Check out this event: ${event.title} on ${formatEventDate(event.date)} at ${event.location}`,
      });
    } catch {
      // cancelled or failed
    }
  }, [event]);

  const handlePress = useCallback(() => {
    onPress(event);
  }, [onPress, event]);

  const displayDate = formatEventDate(event.date, event.startTime);
  const displayPrice = formatEventPrice(event.price, event.isFree);
  const visibleTags = event.tags?.slice(0, 4) ?? [];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.card}>

      {/* Left: event image */}
      <Image
        source={{ uri: event.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Right: content */}
      <View style={styles.content}>

        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
          <Text style={styles.arrow}>{'→'}</Text>
        </View>

        {/* Date + Location row */}
        <View style={styles.metaRow}>
          <Text style={styles.date} numberOfLines={1}>{displayDate}</Text>
          <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>{displayPrice}</Text>

        {/* Tags + Actions */}
        <View style={styles.bottomRow}>
          <View style={styles.tagsContainer}>
            {visibleTags.map(tag => (
              <View style={styles.tag} key={tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleShare}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.shareIcon}>⬆</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.heartBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[styles.heartIcon, isFavorite && styles.heartActive]}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'flex-start',
  },

  // Left image
  image: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    backgroundColor: '#E5E7EB',
  },

  // Content
  content: {
    flex: 1,
    minHeight: 76,
    justifyContent: 'space-between',
  },

  // Title row
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  title: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: '#111827',
    lineHeight: 18,
    paddingRight: Spacing.xs,
  },
  arrow: {
    fontSize: FontSize.sm,
    color: '#9CA3AF',
    marginTop: 1,
  },

  // Date + location
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  date: {
    fontSize: FontSize.xs,
    color: '#4B5563',
    flex: 1,
  },
  location: {
    fontSize: FontSize.xs,
    color: '#9CA3AF',
    textAlign: 'right',
    maxWidth: 110,
  },

  // Price
  price: {
    fontSize: FontSize.xs,
    color: '#6B7280',
    marginBottom: 5,
  },

  // Tags + actions row
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
  },
  tagText: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: FontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: FontSize.md,
    color: '#9CA3AF',
  },
  heartBtn: {
    marginLeft: Spacing.sm,
  },
  heartIcon: {
    fontSize: FontSize.lg,
    color: '#D1D5DB',
  },
  heartActive: {
    color: '#4CAF50',
  },
});

export default memo(EventCard);
