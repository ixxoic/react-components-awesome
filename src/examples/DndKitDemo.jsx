import React, { useState } from 'react';
import VerticalSortableList from '../components/interactive/dnd-kit/VerticalSortableList';

// @dnd-kit/core 拖拽组件演示
export default function DndKitDemo() {
  const [items, setItems] = useState([
    { id: '1', content: '拖拽项 1' },
    { id: '2', content: '拖拽项 2' },
    { id: '3', content: '拖拽项 3' },
    { id: '4', content: '拖拽项 4' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <VerticalSortableList
        items={items}
        onChange={setItems}
      />
      <div style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
      </div>
    </div>
  );
}