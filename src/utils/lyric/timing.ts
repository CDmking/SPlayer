/**
 * 歌词时间常量
 * 桌面歌词与主播放页共用，保证两边的切句与过渡节奏一致
 */

/** 歌词视觉提前量（毫秒） */
export const LYRIC_LEAD_MS = 300;

/** 歌词过渡时长（毫秒） */
export const LYRIC_TRANSITION_MS = 600;

/** 歌词过渡缓动控制点 */
const EASING_POINTS = [0.55, 0, 0.1, 1] as const;

/** 歌词过渡缓动曲线（CSS 使用） */
export const LYRIC_EASING = `cubic-bezier(${EASING_POINTS.join(", ")})`;

/**
 * 计算三次贝塞尔在某个时间点的值
 * @param t 时间进度
 * @param a1 控制点 1
 * @param a2 控制点 2
 */
const calcBezier = (t: number, a1: number, a2: number) =>
  ((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t * t + 3 * a1 * t;

/**
 * 计算三次贝塞尔在某个时间点的斜率
 * @param t 时间进度
 * @param a1 控制点 1
 * @param a2 控制点 2
 */
const calcSlope = (t: number, a1: number, a2: number) =>
  3 * (1 - 3 * a2 + 3 * a1) * t * t + 2 * (3 * a2 - 6 * a1) * t + 3 * a1;

/**
 * 根据缓动控制点生成缓动函数
 * @param points 缓动控制点
 */
export const createLyricEasing = (
  points: readonly [number, number, number, number] = EASING_POINTS,
) => {
  const [x1, y1, x2, y2] = points;
  return (progress: number): number => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    // 牛顿迭代求解 x(t) = progress
    let guess = progress;
    for (let i = 0; i < 8; i++) {
      const slope = calcSlope(guess, x1, x2);
      if (slope === 0) break;
      guess -= (calcBezier(guess, x1, x2) - progress) / slope;
    }
    return calcBezier(guess, y1, y2);
  };
};

/** 歌词过渡缓动函数（JS 使用） */
export const lyricEasing = createLyricEasing();
