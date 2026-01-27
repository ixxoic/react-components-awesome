import React from 'react';
import { DndContext, DragOverlay, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
// 可选：引入图标库（也可以用文字/自定义样式替代）
import { Move } from 'lucide-react';

// 安装图标库（可选，不想装就把 <Move /> 换成文字如「拖拽」）
// npm install lucide-react

// 基础样式
const styles = {
  container: {
    width: 600,
    margin: '20px auto',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
  },
  draggableCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  // 拖拽手柄样式
  dragHandle: {
    width: 40,
    height: '100%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    color: '#666',
    float: 'left',
    // 手柄固定宽度，不随内容拉伸
    flexShrink: 0,
  },
  dragHandleActive: {
    backgroundColor: '#e3f2fd',
    cursor: 'grabbing',
    color: '#4285f4',
  },
  // 卡片内容区
  cardContent: {
    padding: 16,
    marginLeft: 40, // 给手柄留出空间
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
    color: '#333',
  },
  cardText: {
    color: '#666',
    lineHeight: 1.5,
  },
  // 拖拽悬浮层
  dragOverlay: {
    zIndex: 1000,
    opacity: 0.95,
    width: 600,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  hint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 16,
  },
};

// 带自定义手柄的可拖拽卡片组件
const DraggableCardWithHandle = ({ id, title, content }) => {
  // 核心：配置拖拽激活器（仅手柄触发拖拽）
  const {
    attributes, // 绑定到手柄的属性
    listeners,  // 绑定到手柄的事件
    setNodeRef, // 卡片的Ref（整个卡片跟随拖拽）
    setActivatorNodeRef, // 手柄的Ref（仅手柄触发）
    transform,
    isDragging,
  } = useDraggable({
    id,
    // 关键配置：指定激活器（手柄）触发拖拽
    activator: {
      // 仅鼠标/触摸在激活器上时触发拖拽
      clickOnly: true,
    },
  });

  // 卡片样式：拖拽时隐藏原卡片（由 DragOverlay 显示），避免抖动
  const cardStyle = {
    ...styles.draggableCard,
    // 拖拽时隐藏原卡片，避免与 DragOverlay 重叠
    opacity: isDragging ? 0 : 1,
    // 只在非拖拽时应用 transform（如果有的话）
    ...(transform && !isDragging ? { transform: CSS.Transform.toString(transform) } : {}),
    // 拖拽时禁用过渡，避免抖动
    transition: isDragging ? 'none' : undefined,
  };

  // 手柄样式：拖拽时高亮
  const handleStyle = {
    ...styles.dragHandle,
    ...(isDragging ? styles.dragHandleActive : {}),
  };

  return (
    <div ref={setNodeRef} style={cardStyle}>
      {/* 自定义拖拽手柄：仅这个区域能触发拖拽 */}
      <div
        ref={setActivatorNodeRef}
        style={handleStyle}
        {...attributes}
        {...listeners}
      >
        <Move size={18} /> {/* 拖拽图标，也可以换成文字「拖拽」 */}
      </div>

      {/* 卡片内容区：可点击/输入，不会触发拖拽 */}
      <div style={styles.cardContent}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardText}>{content}</div>
        {/* 测试：内容区按钮可正常点击，不会触发拖拽 */}
        <button
          style={{ marginTop: 8, padding: 4.8, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
          onClick={() => alert(`点击了${title}的按钮`)}
        >
          内容区按钮（不触发拖拽）
        </button>
      </div>
    </div >
  );
};

// 自定义拖拽手柄主组件
const CustomDragHandle = () => {
  const [activeId, setActiveId] = React.useState(null);

  // 拖拽开始：记录当前拖拽的卡片ID
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // 拖拽结束逻辑（可选：多卡片排序）
  const handleDragEnd = (event) => {
    console.log('拖拽结束：', event.active.id);
    setActiveId(null);
  };

  // 拖拽取消
  const handleDragCancel = () => {
    setActiveId(null);
  };

  // 测试数据
  const cards = [
    {
      id: 'card-1',
      title: '卡片1（仅手柄可拖拽）',
      content: '这个卡片只有左侧的拖拽手柄能触发拖拽，内容区点击/输入都不会触发，适合表单、详情卡片等场景。'
    },
    {
      id: 'card-2',
      title: '卡片2（仅手柄可拖拽）',
      content: '自定义拖拽手柄能精准控制拖拽触发区域，避免误操作，是实际开发中非常实用的交互设计。'
    },
    {
      id: 'card-3',
      title: '卡片3（仅手柄可拖拽）',
      content: '配合@dnd-kit的动画，拖拽体验丝滑，同时保证内容区的正常交互。'
    },
  ];

  return (
    <div>
      <h3 style={styles.title}>@dnd-kit/core 自定义拖拽手柄演示</h3>

      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div style={styles.container}>
          {cards.map(card => (
            <DraggableCardWithHandle
              key={card.id}
              id={card.id}
              title={card.title}
              content={card.content}
            />
          ))}
        </div>

        {/* 拖拽悬浮层（增强视觉反馈） */}
        {activeId && (
          <DragOverlay style={styles.dragOverlay}>
            {(() => {
              const card = cards.find(item => item.id === activeId);
              if (!card) return null;
              return (
                <div style={{
                  ...styles.draggableCard,
                  marginBottom: 0, // DragOverlay 中不需要 margin
                  cursor: 'grabbing',
                }}>
                  <div style={styles.dragHandleActive}>
                    <Move size={18} />
                  </div>
                  <div style={styles.cardContent}>
                    <div style={styles.cardTitle}>{card.title}</div>
                    <div style={styles.cardText}>{card.content}</div>
                  </div>
                </div>
              );
            })()}
          </DragOverlay>
        )}
      </DndContext>

      <div style={styles.hint}>
        提示：只有左侧的拖拽手柄能触发拖拽，内容区的按钮/文字可正常交互
      </div>
    </div>
  );
};

export default CustomDragHandle;