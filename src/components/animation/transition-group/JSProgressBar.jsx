import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Transition } from 'react-transition-group';

// JS 控制的进度条组件（支持自定义目标值、时长、缓动效果）
const JSProgressBar = () => {
  // 核心状态
  const [isActive, setIsActive] = useState(false); // 控制动画触发
  const [progress, setProgress] = useState(0); // 当前进度（0-100）
  const [targetProgress, setTargetProgress] = useState(85); // 目标进度（可自定义）
  const [isPaused, setIsPaused] = useState(false); // 暂停/继续状态
  const [animationStatus, setAnimationStatus] = useState('未开始'); // 动画状态文本

  // 保存动画帧ID（用于取消/暂停动画）
  const animationFrameRef = useRef(null);
  // 创建 ref 用于 Transition（React 18+ 需要）
  const nodeRef = useRef(null);
  // 保存动画开始时间、已执行时长（用于暂停后继续）
  const animationStateRef = useRef({
    startTime: 0,
    elapsedTime: 0,
    duration: 5000, // 默认动画时长 5 秒，更贴近现实
  });

  // 缓动函数：ease-in-out（开始/结束慢，中间快），让进度条更自然
  const easeInOut = useCallback((progress) => {
    return progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  }, []);

  // 动画开始前：初始化状态
  const handleEnter = () => {
    setProgress(0);
    setAnimationStatus('动画开始');
    animationStateRef.current = {
      ...animationStateRef.current,
      startTime: Date.now(),
      elapsedTime: 0,
    };
  };

  // 动画执行中：核心 JS 控制进度
  const handleEntering = () => {
    if (isPaused) return; // 暂停时停止计算

    const { startTime, duration, elapsedTime } = animationStateRef.current;
    const currentTime = Date.now();
    // 计算已执行时长（包含暂停前的时长）
    const totalElapsed = elapsedTime + (currentTime - startTime);
    // 计算进度比例（0-1）
    const progressRatio = Math.min(totalElapsed / duration, 1);
    // 应用缓动效果，转换为 0-100 的进度值
    const easedProgress = easeInOut(progressRatio) * targetProgress;

    setProgress(Math.floor(easedProgress));

    // 更新已执行时长（用于暂停后恢复）
    animationStateRef.current.elapsedTime = totalElapsed;

    // 进度未完成：继续下一帧
    if (progressRatio < 1) {
      animationFrameRef.current = requestAnimationFrame(handleEntering);
    } else {
      // 进度完成：更新状态
      setAnimationStatus('动画完成');
      setIsActive(false); // 结束动画
      // 可在这里添加完成回调（比如触发提示、跳转等）
      console.log('进度条动画完成！');
    }
  };

  // 动画退出/卸载：清理动画帧（防止内存泄漏）
  const handleExiting = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAnimationStatus('动画取消');
  };

  // 组件卸载时清理动画
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 暂停/继续动画
  const togglePause = () => {
    if (!isActive) return; // 未开始动画时不生效
    setIsPaused(!isPaused);
    if (!isPaused) {
      // 暂停：取消动画帧，记录状态
      cancelAnimationFrame(animationFrameRef.current);
      setAnimationStatus('动画暂停');
    } else {
      // 继续：重新启动动画，重置开始时间
      animationStateRef.current.startTime = Date.now();
      animationFrameRef.current = requestAnimationFrame(handleEntering);
      setAnimationStatus('动画继续');
    }
  };

  // 重置进度条
  const resetProgress = () => {
    setIsActive(false);
    setProgress(0);
    setIsPaused(false);
    setAnimationStatus('已重置');
    cancelAnimationFrame(animationFrameRef.current);
    animationStateRef.current.elapsedTime = 0;
  };

  // 手动修改目标进度
  const handleTargetChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 100) {
      setTargetProgress(value);
    }
  };

  return (
    <div style={{ width: 600, margin: '40px auto', padding: 20 }}>
      <h3 style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>
        JS 控制进度条动画（纯 React Transition 实现）
      </h3>

      {/* 控制区：目标进度设置 + 操作按钮 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div>
          <label style={{ marginRight: 8, color: '#666' }}>目标进度：</label>
          <input
            type="number"
            value={targetProgress}
            onChange={handleTargetChange}
            min={0}
            max={100}
            style={{
              width: 80,
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: 4,
            }}
          />
          <span style={{ marginLeft: 8, color: '#666' }}>%</span>
        </div>

        <button
          onClick={() => setIsActive(true)}
          disabled={isActive && !isPaused}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            backgroundColor: 'hsl(201, 100.00%, 80.20%)', // Baby蓝
            color: 'white',
            cursor: 'pointer',
            opacity: isActive && !isPaused ? 0.6 : 1,
            minWidth: '90px', // 固定最小宽度，确保按钮不会变长
            whiteSpace: 'nowrap', // 防止文本换行
            textAlign: 'center', // 文本居中
            flexShrink: 0, // 防止按钮被压缩
          }}
        >
          开始动画
        </button>

        <button
          onClick={togglePause}
          disabled={!isActive}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            backgroundColor: isPaused ? 'hsl(50, 100.00%, 72.20%)' : 'hsl(49, 100.00%, 77.10%)', // 鹅黄色
            color: 'white',
            cursor: 'pointer',
            opacity: !isActive ? 0.6 : 1,
            minWidth: '90px', // 固定最小宽度，确保按钮不会变长
            whiteSpace: 'nowrap', // 防止文本换行
            textAlign: 'center', // 文本居中
            flexShrink: 0, // 防止按钮被压缩
          }}
        >
          {isPaused ? '继续' : '暂停'}
        </button>

        <button
          onClick={resetProgress}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            backgroundColor: 'hsl(346, 100.00%, 85.30%)', // 樱花粉
            color: 'white',
            cursor: 'pointer',
            minWidth: '90px', // 固定最小宽度，确保按钮不会变长
            whiteSpace: 'nowrap', // 防止文本换行
            textAlign: 'center', // 文本居中
            flexShrink: 0, // 防止按钮被压缩
          }}
        >
          重置
        </button>

        <span style={{ marginLeft: 'auto', color: '#666', minWidth: '120px', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'left' }}>状态：{animationStatus}</span>
      </div>

      {/* 核心：进度条容器（始终渲染，避免抖动） */}
      <div
        style={{
          width: '100%',
          height: 24,
          backgroundColor: '#f5f5f5',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          position: 'relative', // 确保布局稳定
        }}
      >
        {/* 核心：Transition 组件（纯 JS 控制动画） */}
        <Transition
          in={isActive}
          timeout={animationStateRef.current.duration}
          nodeRef={nodeRef}
          onEnter={handleEnter}
          onEntering={handleEntering}
          onExiting={handleExiting}
          unmountOnExit={false}
          mountOnEnter={false}
        >
          {(state) => (
            // 进度条主体（JS 控制宽度 + 低饱和度蓝色）
            <div
              ref={nodeRef}
              style={{
                width: `${progress}%`,
                height: '100%',
                minWidth: progress > 0 ? '1px' : '0', // 确保有最小宽度，避免抖动
                // 低饱和度蓝色：从浅蓝到深蓝
                backgroundColor: `hsl(210, ${60 + progress * 0.2}%, ${70 - progress * 0.15}%)`,
                borderRadius: 12,
                transition: 'none', // 禁用 CSS 过渡，完全由 JS 控制
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 12,
                boxSizing: 'border-box', // 确保宽度计算正确
                position: 'absolute', // 绝对定位，避免影响容器布局
                top: 0,
                left: 0,
              }}
            >
              {/* 进度文本 */}
              {progress > 0 && (
                <span
                  style={{
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)', // 添加文字阴影提高可读性
                  }}
                >
                  {progress}%
                </span>
              )}
            </div>
          )}
        </Transition>
      </div>
    </div>
  );
};

export default JSProgressBar;