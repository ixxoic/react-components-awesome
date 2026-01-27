import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 默认样式
const defaultStyles = {
  board: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    overflowX: 'auto',
    minHeight: '600px',
    backgroundColor: '#f5f5f5',
  },
  column: {
    width: '300px',
    minWidth: '300px',
    backgroundColor: '#ebecf0',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
    padding: '0 4px',
  },
  cardList: {
    flex: 1,
    minHeight: '100px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '8px',
    boxShadow: '0 1px 0 rgba(9,30,66,.25)',
    cursor: 'grab',
    border: '1px solid transparent',
  },
  cardDragging: {
    opacity: 0.5,
    border: '1px solid #2563eb',
    backgroundColor: '#eff6ff',
  },
  dragOverlay: {
    cursor: 'grabbing',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

// 可排序卡片组件
const SortableCard = ({ card, columnId, cardStyle, cardClassName, renderCard }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
      columnId,
    },
  });

  const baseStyle = {
    ...defaultStyles.card,
    ...cardStyle,
    ...(isDragging ? { ...defaultStyles.cardDragging, ...cardStyle?.dragging } : {}),
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const content = renderCard ? renderCard(card, { isDragging }) : card.content;

  return (
    <div
      ref={setNodeRef}
      style={baseStyle}
      className={cardClassName}
      {...attributes}
      {...listeners}
    >
      {content}
    </div>
  );
};

// 列组件（作为放置容器）
const Column = ({ column, children, columnStyle, columnClassName, columnTitleStyle, columnTitleClassName, showCardCount = true }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const columnBaseStyle = {
    ...defaultStyles.column,
    ...columnStyle,
    backgroundColor: isOver
      ? (columnStyle?.overBackgroundColor || '#dbeafe')
      : (columnStyle?.backgroundColor || '#ebecf0'),
    border: isOver
      ? (columnStyle?.overBorder || '2px dashed #3b82f6')
      : (columnStyle?.border || '2px solid transparent'),
  };

  return (
    <div ref={setNodeRef} style={columnBaseStyle} className={columnClassName}>
      <div style={{ ...defaultStyles.columnTitle, ...columnTitleStyle }} className={columnTitleClassName}>
        {column.title}
        {showCardCount && ` (${column.cards.length})`}
      </div>
      <div style={defaultStyles.cardList}>
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
      </div>
    </div>
  );
};

// 主看板组件
const KanbanBoard = React.forwardRef(({
  columns: initialColumns,
  onChange,
  boardStyle,
  boardClassName,
  columnStyle,
  columnClassName,
  columnTitleStyle,
  columnTitleClassName,
  cardStyle,
  cardClassName,
  renderCard,
  showCardCount = true,
  activationDistance = 5,
  ...props
}, ref) => {
  const [columns, setColumns] = useState(initialColumns || {});
  const [activeCard, setActiveCard] = useState(null);

  // 配置传感器（支持鼠标和键盘）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: activationDistance, // 移动指定px后才触发拖拽，防止误触
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 同步外部 columns 变化
  React.useEffect(() => {
    if (initialColumns) {
      setColumns(initialColumns);
    }
  }, [initialColumns]);

  // 查找卡片所在的列
  const findContainer = (cardId) => {
    if (columns[cardId]) return cardId; // 如果传的是列ID，直接返回

    return Object.keys(columns).find((key) =>
      columns[key].cards.find((c) => c.id === cardId)
    );
  };

  // 拖拽开始
  const handleDragStart = (event) => {
    const { active } = event;
    const activeId = active.id;

    // 找到当前拖拽的卡片数据
    const containerId = findContainer(activeId);
    if (containerId) {
      const card = columns[containerId].cards.find((c) => c.id === activeId);
      setActiveCard(card);
    }
  };

  // 拖拽结束（核心逻辑）
  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeId = active.id;

    if (!over) {
      setActiveCard(null);
      return;
    }

    const overId = over.id;

    // 找到源列和目标列
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId; // 如果over是列，直接用overId

    if (!activeContainer || !overContainer) {
      setActiveCard(null);
      return;
    }

    // 情况1：在同一列内拖拽排序
    if (activeContainer === overContainer) {
      const column = columns[activeContainer];
      const oldIndex = column.cards.findIndex((c) => c.id === activeId);
      const newIndex = column.cards.findIndex((c) => c.id === overId);

      if (oldIndex !== newIndex && newIndex !== -1) {
        const newCards = arrayMove(column.cards, oldIndex, newIndex);
        const updatedColumns = {
          ...columns,
          [activeContainer]: {
            ...column,
            cards: newCards,
          },
        };
        setColumns(updatedColumns);
        onChange?.(updatedColumns);
      }
    } else {
      // 情况2：跨列移动
      const sourceColumn = columns[activeContainer];
      const targetColumn = columns[overContainer];

      // 从源列移除
      const sourceCards = [...sourceColumn.cards];
      const cardIndex = sourceCards.findIndex((c) => c.id === activeId);
      if (cardIndex === -1) return;

      const [movedCard] = sourceCards.splice(cardIndex, 1);

      // 添加到目标列
      const targetCards = [...targetColumn.cards];
      const overIndex = targetCards.findIndex((c) => c.id === overId);

      if (overIndex !== -1) {
        // 插入到指定位置
        targetCards.splice(overIndex, 0, movedCard);
      } else {
        // 添加到末尾
        targetCards.push(movedCard);
      }

      const updatedColumns = {
        ...columns,
        [activeContainer]: {
          ...sourceColumn,
          cards: sourceCards,
        },
        [overContainer]: {
          ...targetColumn,
          cards: targetCards,
        },
      };
      setColumns(updatedColumns);
      onChange?.(updatedColumns);
    }

    setActiveCard(null);
  };

  // 拖拽时的动画配置
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const boardBaseStyle = {
    ...defaultStyles.board,
    ...boardStyle,
  };

  return (
    <div ref={ref} style={boardBaseStyle} className={boardClassName} {...props}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {Object.values(columns).map((column) => (
          <Column
            key={column.id}
            column={column}
            columnStyle={columnStyle}
            columnClassName={columnClassName}
            columnTitleStyle={columnTitleStyle}
            columnTitleClassName={columnTitleClassName}
            showCardCount={showCardCount}
          >
            {column.cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                columnId={column.id}
                cardStyle={cardStyle}
                cardClassName={cardClassName}
                renderCard={renderCard}
              />
            ))}
          </Column>
        ))}

        {/* 拖拽时的视觉反馈 */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeCard ? (
            <div style={{ ...defaultStyles.card, ...defaultStyles.dragOverlay, ...cardStyle }}>
              {renderCard ? renderCard(activeCard, { isDragging: true }) : activeCard.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
});

KanbanBoard.displayName = 'KanbanBoard';

export default KanbanBoard;