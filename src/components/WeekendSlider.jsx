import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import WeekendCard from './WeekendCard';
import './WeekendSlider.css';

// Virtual slides: only 5 swiper-slide DOM nodes exist at any time regardless
// of how many weekends there are (156). Swiper renders addSlidesBefore +
// active + addSlidesAfter into the DOM and discards the rest.
const ADD_BEFORE = 2;
const ADD_AFTER  = 2;

const WeekendSlider = forwardRef(function WeekendSlider({ weekends, initialIndex }, ref) {
  const containerRef     = useRef(null);
  const swiperRef        = useRef(null);   // Swiper instance
  const [activeIndex, setActiveIndex]   = useState(initialIndex);
  const [portalTargets, setPortalTargets] = useState([]); // [{el, weekendId}]

  useImperativeHandle(ref, () => ({
    goToSlide(index) {
      swiperRef.current?.slideTo(index);
    },
  }));

  // Scan the DOM for virtual-slot divs and expose them to React portals.
  const syncPortals = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const slots = [...container.querySelectorAll('[data-wknd-id]')];
    setPortalTargets(slots.map(s => ({ el: s, weekendId: s.dataset.wkndId })));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const swiper = new Swiper(container, {
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
      virtual: {
        slides: weekends,
        addSlidesAfter: ADD_AFTER,
        addSlidesBefore: ADD_BEFORE,
        // renderSlide must return the full slide HTML including wrapper
        renderSlide(weekend, index) {
          return (
            `<div class="swiper-slide wknd-slide" data-swiper-slide-index="${index}">` +
              `<div data-wknd-id="${weekend.id}" style="height:100%;width:100%"></div>` +
            `</div>`
          );
        },
      },
      on: {
        init()         { setTimeout(syncPortals, 50); },
        slideChange()  { setActiveIndex(this.activeIndex); setTimeout(syncPortals, 20); },
        virtualUpdate(){ setTimeout(syncPortals, 20); },
      },
    });

    swiperRef.current = swiper;
    return () => { swiper.destroy(true, true); swiperRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scrollbar ──────────────────────────────────────────────────────────────
  const trackRef    = useRef(null);
  const draggingRef = useRef(false);

  const slideToPosition = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return;
    const rect  = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const target = Math.round(ratio * (weekends.length - 1));
    swiperRef.current?.slideTo(target, 0);
  }, [weekends.length]);

  const handlePointerDown = useCallback((e) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    slideToPosition(e.clientY);
  }, [slideToPosition]);

  const handlePointerMove = useCallback((e) => {
    if (draggingRef.current) slideToPosition(e.clientY);
  }, [slideToPosition]);

  const handlePointerUp = useCallback(() => { draggingRef.current = false; }, []);

  const scrollProgress = weekends.length > 1 ? activeIndex / (weekends.length - 1) : 0;

  return (
    <div className="slider-container">
      {/* Swiper mounts into this div; virtual renderSlide fills swiper-wrapper */}
      <div className="swiper wknd-swiper" ref={containerRef}>
        <div className="swiper-wrapper" />
      </div>

      {/* React portals inject WeekendCard into each virtual slot */}
      {portalTargets.map(({ el, weekendId }) => {
        if (!el.isConnected) return null;
        const weekend = weekends.find(w => w.id === weekendId);
        if (!weekend) return null;
        return createPortal(<WeekendCard weekend={weekend} />, el, weekendId);
      })}

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
