import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TourItem, { Tour } from './Components/TourItem';
import { groupByCity, formatDate, formatPrice } from './utils/tour';

const API_URL = 'https://6abb5968b2118ed7abb84e88.mockapi.io/tours';

// Câu 4c: khoảng cách giữa các thẻ trong danh sách ngang
const Separator = () => <View style={{ width: 10 }} />;

function HomeScreen() {
  const [search, setSearch] = useState(''); // câu 1c: lưu từ khoá tìm kiếm
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true); // loading lần đầu
  const [refreshing, setRefreshing] = useState(false); // kéo xuống làm mới

  // Gọi API GET lấy danh sách tour
  const fetchTours = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTours(data);
    } catch (e) {
      setTours([]);
    }
  };

  // Tải dữ liệu lần đầu
  useEffect(() => {
    fetchTours().finally(() => setLoading(false));
  }, []);

  // Câu 6b: kéo xuống làm mới -> gọi lại GET.
  // Không đụng tới state `search` nên từ khoá được giữ nguyên.
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTours();
    setRefreshing(false);
  };

  // Câu 6a: lọc theo tên (không phân biệt hoa thường, bỏ khoảng trắng đầu/cuối)
  // rồi nhóm theo thành phố. groupByCity chỉ tạo nhóm cho thành phố còn tour
  // => nhóm rỗng tự biến mất.
  const sections = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = tours.filter((t) => t.name.toLowerCase().includes(keyword));
    return groupByCity(filtered);
  }, [tours, search]);

  // Câu 4c: tour yêu thích lấy từ `tours` (toàn bộ), KHÔNG lọc theo ô tìm kiếm
  const favorites = useMemo(() => tours.filter((t) => t.isFavorite), [tours]);

  // Câu 3d: nhấn thẻ -> Alert gồm tên, ngày khởi hành, số ngày, giá
  const handlePress = useCallback((tour: Tour) => {
    Alert.alert(
      tour.name,
      `Khởi hành: ${formatDate(tour.departure)}\nSố ngày: ${tour.days}\nGiá: ${formatPrice(tour.price)}`
    );
  }, []);

  // Câu 5: cập nhật yêu thích (PUT) kiểu lạc quan
  const handleToggleFavorite = useCallback(async (id: string, next: boolean) => {
    // 5b: đổi state NGAY (danh sách chính + mục yêu thích cùng đổi vì cùng dùng `tours`)
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, isFavorite: next } : t)));

    try {
      // 5a: gọi PUT tới API_URL/{id}
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: next }),
      });
      if (!res.ok) throw new Error('PUT lỗi'); // server trả lỗi
    } catch (e) {
      // 5c: lỗi (!res.ok hoặc mất mạng) -> hoàn tác về trạng thái cũ (= !next) + báo lỗi
      setTours((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isFavorite: !next } : t))
      );
      Alert.alert('Lỗi', 'Không thể cập nhật yêu thích, vui lòng thử lại.');
    }
  }, []);

  // Câu 4c: ListHeaderComponent = mục "Tour yêu thích (n)"
  const favoriteHeader = (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 8 }}>
        Tour yêu thích ({favorites.length})
      </Text>
      {favorites.length === 0 ? (
        <Text style={{ paddingHorizontal: 8 }}>Chưa có tour yêu thích</Text>
      ) : (
        // FlatList NGANG gồm các TourItem compact
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={favorites}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              compact
              onPress={handlePress}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        />
      )}
    </View>
  );

  return (
    // Câu 1b: SafeAreaView + View bố trí layout
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Câu 1c: tiêu đề, MSSV – Họ tên, ô tìm kiếm */}
        <Text>Tour Việt</Text>
        <Text>MSSV – Nguyễn Trọng Tiến</Text>
        <TextInput
          placeholder="Tìm tour theo tên..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Câu 2c: đang tải thì hiện ActivityIndicator */}
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true} // header nhóm dính khi cuộn
            ListHeaderComponent={favoriteHeader}
            // Câu 6b: không có kết quả
            ListEmptyComponent={<Text>Không tìm thấy tour phù hợp</Text>}
            // Câu 6b: kéo xuống để làm mới
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // Câu 2b: tiêu đề nhóm "Đà Lạt · 3 tour"
            renderSectionHeader={({ section }) => (
              <Text style={{ backgroundColor: '#eee', fontWeight: 'bold', padding: 6 }}>
                {section.title} · {section.data.length} tour
              </Text>
            )}
            // Câu 3: dùng TourItem trong renderItem (compact mặc định false)
            renderItem={({ item }) => (
              <TourItem
                tour={item}
                onPress={handlePress}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// Câu 1a: bọc toàn app trong SafeAreaProvider
export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}