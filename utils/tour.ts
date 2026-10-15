import type { Tour } from '../Components/TourItem';

export type TourSection = {
  title: string;
  data: Tour[];
};

// Câu 2: nhóm tour theo thành phố
export function groupByCity(tours: Tour[]): TourSection[] {
  const map: Record<string, Tour[]> = {};

  tours.forEach((t) => {
    if (!map[t.city]) map[t.city] = [];
    map[t.city].push(t);
  });

  return Object.keys(map)
    .sort((a, b) => a.localeCompare(b, 'vi')) // thành phố A → Z
    .map((city) => ({
      title: city,
      // ngày khởi hành tăng dần (chuỗi YYYY-MM-DD so sánh trực tiếp được)
      data: map[city].sort((a, b) => a.departure.localeCompare(b.departure)),
    }));
}

// Câu 3b: "2026-11-05" -> "05/11/2026"
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

// Câu 3b: 0 -> "Hết chỗ", 1-3 -> "Chỉ còn N chỗ", >3 -> "Còn N chỗ"
export function getSeatLabel(seats: number): string {
  if (seats === 0) return 'Hết chỗ';
  if (seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
}

// Định dạng giá: 3590000 -> "3.590.000 ₫"
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
}