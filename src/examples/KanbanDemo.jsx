import React, { useState } from 'react';
import KanbanBoard from '../components/interactive/dnd-kit/KanbanBoard';

export default function KanbanDemo() {
  const [columns, setColumns] = useState({
    'column-1': {
      id: 'column-1',
      title: '待办',
      cards: [
        { id: 'card-1', content: '完成组件仓库整理' },
        { id: 'card-2', content: '学习 @dnd-kit 高级用法' },
      ],
    },
    'column-2': {
      id: 'column-2',
      title: '进行中',
      cards: [{ id: 'card-3', content: '实现多列看板拖拽' }],
    },
    'column-3': {
      id: 'column-3',
      title: '已完成',
      cards: [
        { id: 'card-4', content: '整理 shadcn/ui 组件' },
        { id: 'card-5', content: '实现纵向列表拖拽' },
      ],
    },
  });

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>@dnd-kit 多列看板拖拽演示</h2>
      <KanbanBoard
        columns={columns}
        onChange={setColumns}
      />
    </div>
  );
}