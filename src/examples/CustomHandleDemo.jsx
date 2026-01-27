import React from 'react';
import CustomDragHandle from '../components/interactive/dnd-kit/CustomDragHandle';

// 自定义拖拽手柄演示
export default function CustomHandleDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <CustomDragHandle />
    </div>
  );
}