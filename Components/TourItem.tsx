import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate, getSeatLabel, formatPrice } from '../utils/tour';

// Câu 3a: khai báo kiểu Tour
export type Tour = {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
};

// Câu 3a: khai báo kiểu props
export type TourItemProps = {
  tour: Tour;
  compact?: boolean; // mặc định false
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
};

function TourItem({ tour, compact = false, onPress, onToggleFavorite }: TourItemProps) {
  // Chữ đỏ khi còn <= 3 chỗ (gồm cả hết chỗ = 0)
  const lowSeats = tour.seats <= 3;

  return (
    // Câu 4: chỉ 1 component, style kết hợp theo mảng, đổi theo compact
    <View style={[styles.card, compact && styles.cardCompact]}>
      {/* Phần thẻ: nhấn vào gọi onPress(tour) -> cha hiện Alert */}
      <TouchableOpacity
        style={[styles.main, compact && styles.mainCompact]}
        onPress={() => onPress(tour)}
      >
        <Image
          source={{ uri: tour.image }}
          style={[styles.image, compact && styles.imageCompact]}
        />

        <View style={[styles.info, compact && styles.infoCompact]}>
          {/* compact: tên chỉ 1 dòng */}
          <Text style={styles.name} numberOfLines={compact ? 1 : undefined}>
            {tour.name}
          </Text>

          {/* Không compact mới hiện thành phố + ngày */}
          {!compact && (
            <>
              <Text>{tour.city}</Text>
              <Text>
                📅 {formatDate(tour.departure)} · {tour.days} ngày
              </Text>
            </>
          )}

          {/* Giá: cả 2 kiểu đều hiện */}
          <Text>{formatPrice(tour.price)}</Text>

          {/* Nhãn số chỗ: chỉ hiện khi không compact, đỏ khi lowSeats */}
          {!compact && (
            <Text style={lowSeats && styles.red}>{getSeatLabel(tour.seats)}</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Câu 3d: nút tim RIÊNG (nằm ngoài TouchableOpacity ở trên)
          => nhấn tim không kích hoạt onPress, không mở Alert.
          compact: tim đè lên góc phải trên của ảnh (position absolute) */}
      <TouchableOpacity
        testID="fav-btn"
        style={[styles.heartBtn, compact && styles.heartBtnCompact]}
        onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
      >
        <Text style={styles.heart}>{tour.isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Câu 3a: export default qua React.memo
export default React.memo(TourItem);

const styles = StyleSheet.create({
  // ----- Kiểu mặc định (compact = false): bố cục ngang -----
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  main: { flex: 1, flexDirection: 'row' },
  image: { width: 90, height: 90 }, // câu 4a: ảnh 90x90 bên trái
  info: { flex: 1, marginLeft: 8 },
  name: { fontWeight: 'bold' },
  red: { color: 'red' },
  heartBtn: { padding: 8 }, // tim ở mép phải
  heart: { fontSize: 24 },

  // ----- Kiểu compact = true: thẻ dọc rộng 160 -----
  cardCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: 160,
    padding: 0,
  },
  mainCompact: { flex: 0, flexDirection: 'column' },
  imageCompact: {
    width: '100%',
    height: undefined,
    aspectRatio: 4 / 3, // câu 4b: ảnh chiếm hết bề ngang thẻ
  },
  infoCompact: { flex: 0, marginLeft: 0, padding: 6 },
  heartBtnCompact: {
    position: 'absolute', // đè lên ảnh
    top: 4,
    right: 4, // góc phải trên
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
  },
});