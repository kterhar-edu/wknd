import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { register } from 'swiper/element/bundle';
import WeekendCard from './WeekendCard';
import './WeekendSlider.css';

register();

const WeekendSlider = forwardRef(function WeekendSlider({ weekends, initialIndex }, ref) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useImperativeHandle(ref, () => ({
    goToSlide(index) {
      const el = swiperRef.current;
      if (el?.swiper) el.swiper.slideTo(index);
    },
  }));

  useEffect(() => {
    const el = swiperRef.current;
    if (!el) return;

    const params = {
      effect: 'cards',
      direction: 'vertical',
      grabCursor: true,
      initialSlide: initialIndex,
      cardsEffect: {
        perSlideOffset: 8,
        perSlideRotate: 1,
        rotate: true,
        slideShadows: false,
      },
    };

    Object.assign(el, params);
    el.initialize();

    const handleSlideChange = () => {
      if (el.swiper) setActiveIndex(el.swiper.activeIndex);
    };
    el.addEventListener('swiperslidechange', handleSlideChange);
    return () => el.removeEventListener('swiperslidechange', handleSlideChange);
  }, [initialIndex]);

  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const slideToPosition = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const targetIndex = Math.round(ratio * (weekends.length - 1));
    const el = swiperRef.current;
    if (el?.swiper) el.swiper.slideTo(targetIndex, 0);
  }, [weekends.length]);

  const handlePointerDown = useCallback((e) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    slideToPosition(e.clientY);
  }, [slideToPosition]);

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    slideToPosition(e.clientY);
  }, [slideToPosition]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const scrollProgress = weekends.length > 1 ? activeIndex / (weekends.length - 1) : 0;

  return (
    <div className="slider-container">
      <swiper-container ref={swiperRef} init="false">
        {weekends.map((weekend) => (
          <swiper-slide key={weekend.id}>
            <WeekendCard weekend={weekend} />
          </swiper-slide>
        ))}
      </swiper-container>

      <div
        className="slider-scrollbar"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="slider-scrollbar__track">
          <div
            className="slider-scrollbar__thumb"
            style={{ top: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="slider-scrollbar__labels">
          <span>Past</span>
          <span>Future</span>
        </div>
      </div>
    </div>
  );
});

export default WeekendSlider;
