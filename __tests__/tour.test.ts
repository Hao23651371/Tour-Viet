import { groupByCity, formatDate, getSeatLabel } from '../utils/tour';
import type { Tour } from '../Components/TourItem';

// Hàm tạo tour giả, chỉ cần truyền các trường muốn khác mặc định
const makeTour = (overrides: Partial<Tour>): Tour => ({
  id: '1',
  name: 'Tour mẫu',
  city: 'Hà Nội',
  days: 3,
  price: 3590000,
  seats: 10,
  departure: '2026-11-05',
  image: 'https://example.com/a.jpg',
  isFavorite: false,
  ...overrides,
});

// Dữ liệu giả cố tình xếp LỘN XỘN để kiểm tra việc sắp xếp
const tours: Tour[] = [
  makeTour({ id: '1', city: 'Nha Trang', departure: '2026-12-01' }),
  makeTour({ id: '2', city: 'Hà Nội', departure: '2026-11-20' }),
  makeTour({ id: '3', city: 'Phú Quốc', departure: '2026-10-15' }),
  makeTour({ id: '4', city: 'Hà Nội', departure: '2026-11-05' }),
  makeTour({ id: '5', city: 'Huế', departure: '2026-09-30' }),
  makeTour({ id: '6', city: 'Hà Nội', departure: '2026-12-25' }),
];

describe('groupByCity', () => {
  const result = groupByCity(tours);

  // 7a: đúng số nhóm (4 thành phố khác nhau)
  test('đúng số nhóm', () => {
    expect(result).toHaveLength(4);
  });

  // 7a: tên thành phố sắp A → Z
  test('nhóm sắp theo tên thành phố A → Z', () => {
    expect(result.map((s) => s.title)).toEqual([
      'Hà Nội',
      'Huế',
      'Nha Trang',
      'Phú Quốc',
    ]);
  });

  // 7a: trong 1 nhóm, tour sắp theo departure tăng dần
  test('tour trong nhóm sắp theo ngày khởi hành tăng dần', () => {
    const hanoi = result.find((s) => s.title === 'Hà Nội')!;
    expect(hanoi.data.map((t) => t.departure)).toEqual([
      '2026-11-05',
      '2026-11-20',
      '2026-12-25',
    ]);
  });
});

describe('formatDate', () => {
  // 7b
  test('đổi YYYY-MM-DD sang DD/MM/YYYY', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });
});

describe('getSeatLabel', () => {
  // 7b: kiểm tra các giá trị biên 0, 3, 4
  test('seats = 0 → Hết chỗ', () => {
    expect(getSeatLabel(0)).toBe('Hết chỗ');
  });

  test('seats = 3 → Chỉ còn 3 chỗ', () => {
    expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
  });

  test('seats = 4 → Còn 4 chỗ', () => {
    expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
  });
});