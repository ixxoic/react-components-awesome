import React from 'react';
import NumberScrollTransition from '../components/animation/transition-group/js-transition/NumberScrollTransition';

// 纯 JS 数字滚动动画演示
export default function NumberScrollDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NumberScrollTransition />
    </div>
  );
}