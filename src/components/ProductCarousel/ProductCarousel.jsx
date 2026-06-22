"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useThrottledCallback } from '@/hooks/useThrottledCallback';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { parseBulletPoints } from '@/utils/textUtils';

const CAROUSEL_GAP_PX = 24;

const ProductCarousel = ({ items = [] }) => {
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const rafRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const isMobilePagination = useMediaQuery('(max-width: 639px)');
  const dataLengthRef = useRef(0);

  const data = useMemo(
    () =>
      items.map((item) => ({
        id: item.slug,
        name: item.name,
        description_short: item.shortDescription,
      })),
    [items],
  );
  const error = data.length === 0 ? 'Нет доступных категорий шин' : null;

  useEffect(() => {
    dataLengthRef.current = data.length;
  }, [data.length]);

  const updateArrowState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    const tolerance = 1;
    const isAtStart = scrollLeft <= tolerance;
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - tolerance;

    setCanScrollPrev(!isAtStart);
    setCanScrollNext(!isAtEnd);

    const step = clientWidth + CAROUSEL_GAP_PX;
    const rawPageIndex = Math.round(scrollLeft / step);
    const maxPageIndex = Math.max(0, dataLengthRef.current - 1);
    setCurrentPageIndex(Math.min(Math.max(0, rawPageIndex), maxPageIndex));
  }, []);

  const scrollPrev = useCallback(() => {
    const track = trackRef.current;
    if (!track || !canScrollPrev) return;
    
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    
    // Обновляем состояние после завершения smooth scroll
    // Используем несколько проверок для надежности
    const checkAfterScroll = () => {
      updateArrowState();
      // Дополнительная проверка через небольшую задержку
      setTimeout(updateArrowState, 350);
    };
    
    setTimeout(checkAfterScroll, 100);
  }, [canScrollPrev, updateArrowState]);

  const scrollNext = useCallback(() => {
    const track = trackRef.current;
    if (!track || !canScrollNext) return;
    
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    
    // Обновляем состояние после завершения smooth scroll
    const checkAfterScroll = () => {
      updateArrowState();
      setTimeout(updateArrowState, 350);
    };
    
    setTimeout(checkAfterScroll, 100);
  }, [canScrollNext, updateArrowState]);

  const scrollToPage = useCallback((pageIndex) => {
    const track = trackRef.current;
    if (!track) return;

    const step = track.clientWidth + CAROUSEL_GAP_PX;
    const maxIndex = Math.max(0, Math.ceil(track.scrollWidth / step) - 1);
    const clampedIndex = Math.min(Math.max(0, pageIndex), maxIndex);

    track.scrollTo({ left: clampedIndex * step, behavior: 'smooth' });
    setCurrentPageIndex(clampedIndex);
    setTimeout(updateArrowState, 350);
  }, [updateArrowState]);

  const handleMouseDown = (event) => {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = track.scrollLeft;
  };

  const handleMouseMove = useCallback((event) => {
    if (!isDraggingRef.current) return;
    
    // Отменяем предыдущий requestAnimationFrame если есть
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    // Используем requestAnimationFrame для синхронизации с рендерингом
    rafRef.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track || !isDraggingRef.current) return;
      
      const deltaX = event.clientX - dragStartXRef.current;
      track.scrollLeft = dragStartScrollLeftRef.current - deltaX;
    });
  }, []);

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    // Обновляем состояние стрелок после завершения drag
    updateArrowState();
  };

  const handleKeyDown = useCallback((event) => {
    const track = trackRef.current;
    if (!track) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        scrollPrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        scrollNext();
        break;
      case 'Home':
        event.preventDefault();
        track.scrollTo({ left: 0, behavior: 'smooth' });
        break;
      case 'End':
        event.preventDefault();
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
        break;
      default:
        // Игнорируем другие клавиши
        break;
    }
  }, [scrollPrev, scrollNext]);

  // Throttled версия для scroll (16ms = ~60fps)
  const throttledUpdateArrowState = useThrottledCallback(updateArrowState, 16);
  
  // Debounced версия для resize (300ms)
  const debouncedUpdateArrowState = useDebouncedCallback(updateArrowState, 300);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || data.length === 0) return;

    // Небольшая задержка для того, чтобы DOM успел отрендериться
    const timeoutId = setTimeout(() => {
      updateArrowState();
    }, 100);
    
    // Используем оптимизированные версии
    track.addEventListener('scroll', throttledUpdateArrowState);
    window.addEventListener('resize', debouncedUpdateArrowState);

    return () => {
      clearTimeout(timeoutId);
      track.removeEventListener('scroll', throttledUpdateArrowState);
      window.removeEventListener('resize', debouncedUpdateArrowState);
      
      // Очищаем requestAnimationFrame при размонтировании
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [data.length, updateArrowState, throttledUpdateArrowState, debouncedUpdateArrowState]);

  // Split description_short by bullet points
  const renderCard = (tire) => {
    const bulletPoints = parseBulletPoints(tire.description_short);
    const summary = bulletPoints.slice(0, 3).join(" · ");

    return (
      <article key={tire.id} className="category-card">
        <div className="category-card-media" aria-hidden="true" />
        <div className="category-card-overlay" aria-hidden="true" />
        <div className="category-card-content">
          <h3 className="category-card-title">{tire.name}</h3>
          {summary && <p className="category-card-desc">{summary}</p>}
        </div>
        <span className="category-card-arrow" aria-hidden="true">
          →
        </span>
      </article>
    );
  };

  // Обработка ошибок и пустых данных
  if (error) {
    return (
      <div className="product-carousel" role="alert" aria-live="assertive">
        <div className="section">
          <p className="section-description">
            Ошибка загрузки данных: {error}
          </p>
        </div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="product-carousel" role="status" aria-live="polite">
        <div className="section">
          <p className="section-description">
            Нет доступных продуктов
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-carousel">
      <div
        className="product-carousel-track"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        onKeyDown={handleKeyDown}
        role="region"
        aria-label="Карусель продуктов"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={0}
      >
        {data.map(renderCard)}
      </div>

      <button
        className="carousel-nav carousel-nav-prev"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Предыдущий слайд"
      >
        ←
      </button>

      <button
        className="carousel-nav carousel-nav-next"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Следующий слайд"
      >
        →
      </button>

      {isMobilePagination && data.length > 0 && (
        <nav
          className="carousel-pagination"
          aria-label="Переключение слайдов карусели"
        >
          {data.map((_, index) => {
            const isActive = index === currentPageIndex;
            return (
              <button
                key={index}
                type="button"
                className={`carousel-pagination-dot ${isActive ? 'carousel-pagination-dot-active' : ''}`}
                onClick={() => scrollToPage(index)}
                aria-label={`Слайд ${index + 1} из ${data.length}`}
                aria-current={isActive ? 'true' : undefined}
              />
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default ProductCarousel;
