import React, { useState } from 'react';
import GridSnapDrag from '../components/interactive/dnd-kit/GridSnapDrag';

// 磁吸网格拖拽演示
export default function GridSnapDemo() {
  const [items, setItems] = useState([
    { id: 'item-1', position: { x: 0, y: 0 } },
    { id: 'item-2', position: { x: 100, y: 100 } },
    { id: 'item-3', position: { x: 200, y: 200 } },
  ]);

  // 位置改变时的回调
  const handleChange = (newItems) => {
    setItems(newItems);
    console.log('Items updated:', newItems);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 8 }}>
          磁吸网格拖拽演示
        </h2>
        <p style={{ color: '#666' }}>
          拖拽元素自动吸附到 100x100px 网格交点
        </p>
      </div>

      <GridSnapDrag
        items={items}
        onChange={handleChange}
        config={{
          gridSize: 100,
          containerWidth: 800,
          containerHeight: 600,
          showGrid: true,
          itemStyle: {
            width: 90,
            height: 90,
            borderRadius: 8,
            backgroundColor: '#4285f4',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
          renderItem: (item, isDragging) => (
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isDragging ? 0.8 : 1
            }}>
              {item.id}
            </div>
          ),
        }}
      />
    </div>
  );
}