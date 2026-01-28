import React, { useState, useRef, useEffect } from 'react';
import { Transition } from 'react-transition-group';

// 数字滚动动画组件（纯 JS 控制）
const NumberScrollTransition = () => {
  // 控制动画的触发状态
  const [isActive, setIsActive] = useState(false);
  // 目标数值
  const [targetValue, setTargetValue] = useState(1000);
  // 当前显示的数值（用于动画过渡）
  const [currentValue, setCurrentValue] = useState(0);
  // 保存动画帧 ID，用于取消动画
  const animationFrameRef = useRef(null);

  // 动画时长（毫秒）
  const duration = 1500;

  // 动画开始时的回调
  const handleEnter = () => {
    setCurrentValue(0);
  };

  // 动画执行中的回调（核心：JS 控制每一帧的数值）
  const handleEntering = () => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = targetValue;

    // 用 requestAnimationFrame 实现平滑动画
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 缓动函数：让动画开始慢，中间快，结束慢
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // 计算当前数值
      const value = startValue + (endValue - startValue) * easedProgress;
      setCurrentValue(Math.floor(value));

      // 如果动画未完成，继续下一帧
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // 启动动画
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // 动画结束时的回调
  const handleExiting = () => {
    // 取消动画帧，防止内存泄漏
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // 组件卸载时清理动画
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: 400, margin: '40px auto', textAlign: 'center' }}>
      <h3 style={{ marginBottom: 20 }}>Transition 纯 JS 数字滚动动画</h3>

      {/* 输入目标值 */}
      <input
        type="number"
        value={targetValue}
        onChange={(e) => setTargetValue(Number(e.target.value))}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: 4,
          marginRight: 16,
          width: 100,
        }}
        placeholder="目标数值"
      />

      {/* 触发按钮 */}
      <button
        onClick={() => setIsActive(!isActive)}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: 4,
          backgroundColor: '#4285f4',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        {isActive ? '重置' : '开始动画'}
      </button>

      {/* 核心：Transition 组件（纯 JS 控制） */}
      <Transition
        in={isActive}
        timeout={duration}
        onEnter={handleEnter}
        onEntering={handleEntering}
        onExiting={handleExiting}
        unmountOnExit={false}
      >
        {(state) => (
          <div
            style={{
              marginTop: 32,
              fontSize: 48,
              fontWeight: 'bold',
              color: '#4285f4',
              // 用 JS 控制颜色变化
              opacity: state === 'entering' || state === 'entered' ? 1 : 0,
              transition: 'opacity 300ms ease',
            }}
          >
            {currentValue.toLocaleString()}
          </div>
        )}
      </Transition>
    </div>
  );
};

export default NumberScrollTransition;