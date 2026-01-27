import React, { useState } from 'react';
import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// 磁吸对齐函数（核心算法）
const snapToGrid = (position, gridSize, containerWidth, containerHeight) => {
  // 计算最近的网格坐标（向下取整到网格倍数）
  const x = Math.round(position.x / gridSize) * gridSize;
  const y = Math.round(position.y / gridSize) * gridSize;

  // 限制在容器内
  const clampedX = Math.max(0, Math.min(x, containerWidth - gridSize));
  const clampedY = Math.max(0, Math.min(y, containerHeight - gridSize));

  return { x: clampedX, y: clampedY };
};

// 可磁吸拖拽的元素组件
const SnapDraggableItem = ({
  id,
  item,
  position,
  isDragging,
  itemStyle,
  itemDraggingStyle,
  renderItem
}) => {
  // 拖拽钩子
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id,
  });

  // 合并样式
  const baseStyle = {
    width: '90px', // 默认大小，会被 itemStyle 覆盖
    height: '90px',
    borderRadius: 8,
    backgroundColor: '#4285f4',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'absolute',
    ...itemStyle,
    ...(isDragging ? itemDraggingStyle : {}),
    left: position.x,
    top: position.y,
    // 拖拽时叠加 transform
    ...(isDragging && transform
      ? { transform: CSS.Transform.toString(transform) }
      : {}
    ),
  };

  return (
    <div
      ref={setNodeRef}
      style={baseStyle}
      {...attributes}
      {...listeners}
    >
      {renderItem ? renderItem(item, isDragging) : item.id}
    </div>
  );
};

/**
 * 磁吸网格拖拽组件
 * @param {Array} items - 拖拽元素数组，每个元素需包含 id 和 position {x, y}
 * @param {Function} onChange - 位置改变时的回调函数 (newItems) => void
 * @param {Object} config - 配置选项
 * @param {number} config.gridSize - 网格大小，默认 100
 * @param {number} config.containerWidth - 容器宽度，默认 800
 * @param {number} config.containerHeight - 容器高度，默认 600
 * @param {Object} config.containerStyle - 容器自定义样式
 * @param {boolean} config.showGrid - 是否显示网格背景，默认 true
 * @param {Object} config.itemStyle - 卡片默认样式
 * @param {Object} config.itemDraggingStyle - 拖拽时卡片样式，默认 { opacity: 0 }
 * @param {Object} config.dragOverlayStyle - 拖拽悬浮层样式
 * @param {Function} config.renderItem - 自定义渲染函数 (item, isDragging) => ReactNode
 */
const GridSnapDrag = ({
  items: initialItems,
  onChange,
  config = {},
}) => {
  const {
    gridSize = 100,
    containerWidth = 800,
    containerHeight = 600,
    containerStyle = {},
    showGrid = true,
    itemStyle = {},
    itemDraggingStyle = { opacity: 0 },
    dragOverlayStyle = {},
    renderItem,
  } = config;

  // 内部状态管理 items
  const [items, setItems] = useState(initialItems || []);
  const [activeId, setActiveId] = useState(null);
  const [dragStartPosition, setDragStartPosition] = useState(null);

  // 同步外部 items 变化
  React.useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  // 磁吸对齐函数（使用配置的网格大小）
  const snapToGridWithConfig = (position) => {
    return snapToGrid(position, gridSize, containerWidth, containerHeight);
  };

  // 拖拽开始：记录初始位置
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // 找到当前拖拽的 item，记录其初始位置
    const currentItem = items.find(item => item.id === active.id);
    if (currentItem) {
      setDragStartPosition(currentItem.position);
    }
  };

  // 拖拽结束：计算磁吸位置并更新
  const handleDragEnd = (event) => {
    const { active, delta } = event;

    if (!active || !delta || !dragStartPosition) {
      setActiveId(null);
      setDragStartPosition(null);
      return;
    }

    // 使用拖拽开始时的位置 + delta 来计算最终位置
    const finalX = dragStartPosition.x + delta.x;
    const finalY = dragStartPosition.y + delta.y;

    // 磁吸对齐
    const snappedPosition = snapToGridWithConfig({ x: finalX, y: finalY });

    // 更新元素位置
    const newItems = items.map((prevItem) =>
      prevItem.id === active.id
        ? { ...prevItem, position: snappedPosition }
        : prevItem
    );

    setItems(newItems);

    // 调用 onChange 回调
    if (onChange) {
      onChange(newItems);
    }

    setActiveId(null);
    setDragStartPosition(null);
  };

  // 拖拽取消
  const handleDragCancel = () => {
    setActiveId(null);
    setDragStartPosition(null);
  };

  // 获取当前拖拽的 item
  const activeItem = items.find(item => item.id === activeId);

  // 容器样式
  const containerBaseStyle = {
    width: containerWidth,
    height: containerHeight,
    border: '1px solid #e0e0e0',
    margin: '20px auto',
    position: 'relative',
    backgroundColor: '#f9f9f9',
    ...containerStyle,
  };

  // 网格背景样式
  const gridStyle = {
    width: '100%',
    height: '100%',
    backgroundSize: `${gridSize}px ${gridSize}px`,
    backgroundImage: 'linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)',
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  };

  // 拖拽悬浮层样式
  const overlayStyle = {
    zIndex: 1000,
    opacity: 0.95,
    ...dragOverlayStyle,
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* 网格容器 */}
      <div style={containerBaseStyle}>
        {/* 网格背景 */}
        {showGrid && <div style={gridStyle} />}

        {/* 渲染可磁吸拖拽的元素 */}
        {items.map(item => (
          <SnapDraggableItem
            key={item.id}
            id={item.id}
            item={item}
            position={item.position}
            isDragging={activeId === item.id}
            itemStyle={itemStyle}
            itemDraggingStyle={itemDraggingStyle}
            renderItem={renderItem}
          />
        ))}
      </div>

      {/* 拖拽悬浮层（拖拽时显示，避免重叠） */}
      {activeId && activeItem && (
        <DragOverlay style={overlayStyle}>
          <div style={{
            ...itemStyle,
            backgroundColor: '#3367d6',
            opacity: 0.95,
            cursor: 'grabbing',
            position: 'relative',
          }}>
            {renderItem ? renderItem(activeItem, true) : activeItem.id}
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default GridSnapDrag;