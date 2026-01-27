import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 默认样式
const defaultStyles = {
  container: {
    width: 400,
    margin: '20px auto',
  },
  list: {
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: 8,
    backgroundColor: 'white',
  },
  item: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    cursor: 'grab',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  },
  itemDragging: {
    backgroundColor: '#e3f2fd',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'grabbing',
  },
  dragOverlay: {
    zIndex: 100,
    opacity: 0.9,
  },
};

// 排序列表项组件
const SortableItem = ({ item, itemStyle, itemClassName, renderItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const baseStyle = {
    ...defaultStyles.item,
    ...itemStyle,
    ...(isDragging ? { ...defaultStyles.itemDragging, ...itemStyle?.dragging } : {}),
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const content = renderItem ? renderItem(item, { isDragging }) : item.content;

  return (
    <div
      ref={setNodeRef}
      style={baseStyle}
      className={itemClassName}
      {...attributes}
      {...listeners}
    >
      {content}
    </div>
  );
};

// 纵向可排序列表组件
const VerticalSortableList = React.forwardRef(({
  items: initialItems = [],
  onChange,
  containerStyle,
  containerClassName,
  listStyle,
  listClassName,
  itemStyle,
  itemClassName,
  renderItem,
  activationDistance = 5,
  ...props
}, ref) => {
  const [items, setItems] = React.useState(initialItems);
  const [activeId, setActiveId] = React.useState(null);

  // 同步外部 items 变化
  React.useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  // 配置传感器（支持鼠标和键盘）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: activationDistance,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 拖拽开始
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // 拖拽结束
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if (activeIndex !== overIndex) {
      const newItems = arrayMove(items, activeIndex, overIndex);
      setItems(newItems);
      onChange?.(newItems);
    }

    setActiveId(null);
  };

  // 找到当前拖拽的项
  const activeItem = items.find((item) => item.id === activeId);

  const containerBaseStyle = {
    ...defaultStyles.container,
    ...containerStyle,
  };

  const listBaseStyle = {
    ...defaultStyles.list,
    ...listStyle,
  };

  return (
    <div ref={ref} style={containerBaseStyle} className={containerClassName} {...props}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div style={listBaseStyle} className={listClassName}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                itemStyle={itemStyle}
                itemClassName={itemClassName}
                renderItem={renderItem}
              />
            ))}
          </div>
        </SortableContext>

        {activeItem && (
          <DragOverlay style={defaultStyles.dragOverlay}>
            <div style={{ ...defaultStyles.item, ...defaultStyles.itemDragging, ...itemStyle }}>
              {renderItem ? renderItem(activeItem, { isDragging: true }) : activeItem.content}
            </div>
          </DragOverlay>
        )}
      </DndContext>
    </div>
  );
});

VerticalSortableList.displayName = 'VerticalSortableList';

export default VerticalSortableList;