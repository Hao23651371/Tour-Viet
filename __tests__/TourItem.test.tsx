import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TourItem, { Tour } from '../Components/TourItem';

// Dữ liệu giả
const tour: Tour = {
  id: 't1',
  name: 'Đà Lạt mộng mơ',
  city: 'Đà Lạt',
  days: 3,
  price: 3590000,
  seats: 2,
  departure: '2026-11-05',
  image: 'https://example.com/a.jpg',
  isFavorite: false,
};

describe('TourItem - bố cục', () => {
  // 7c: compact = true thì KHÔNG hiển thị thành phố
  test('compact không hiển thị thành phố', async () => {
    const { queryByText } = await render(
      <TourItem tour={tour} compact onPress={jest.fn()} onToggleFavorite={jest.fn()} />
    );
    expect(queryByText('Đà Lạt')).toBeNull();
  });

  // 7c: compact = false (mặc định) thì CÓ hiển thị thành phố
  test('không compact thì hiển thị thành phố', async () => {
    const { getByText } = await render(
      <TourItem tour={tour} onPress={jest.fn()} onToggleFavorite={jest.fn()} />
    );
    expect(getByText('Đà Lạt')).toBeTruthy();
  });
});

describe('TourItem - sự kiện', () => {
  // 7d: nhấn nút tim → onToggleFavorite(id, true), onPress KHÔNG được gọi
  test('nhấn tim gọi onToggleFavorite và không gọi onPress', async () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();

    const { getByTestId } = await render(
      <TourItem tour={tour} onPress={onPress} onToggleFavorite={onToggleFavorite} />
    );

    await fireEvent.press(getByTestId('fav-btn'));

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledWith('t1', true); // isFavorite đang false → next = true
    expect(onPress).not.toHaveBeenCalled();
  });

  // 7d: nhấn tên tour → onPress(tour) với cả object tour
  test('nhấn tên tour gọi onPress với object tour', async () => {
    const onPress = jest.fn();

    const { getByText } = await render(
      <TourItem tour={tour} onPress={onPress} onToggleFavorite={jest.fn()} />
    );

    await fireEvent.press(getByText('Đà Lạt mộng mơ'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(tour);
  });
});