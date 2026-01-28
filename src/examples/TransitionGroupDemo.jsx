import React, { useState } from 'react';
import ModalTransition from '../components/animation/transition-group/ModalTransition';
import ListTransition from '../components/animation/transition-group/ListTransition';

// react-transition-group 过渡动画演示
export default function TransitionGroupDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 列表数据
  const [listItems, setListItems] = useState([
    { id: 1, text: '列表项 1' },
    { id: 2, text: '列表项 2' },
    { id: 3, text: '列表项 3' },
  ]);
  const [nextId, setNextId] = useState(4);

  // 添加列表项
  const addItem = () => {
    const newItem = { id: nextId, text: `列表项 ${nextId}` };
    setListItems([...listItems, newItem]);
    setNextId(nextId + 1);
  };

  // 删除列表项
  const removeItem = (id) => {
    setListItems(listItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div style={{ width: '80%', margin: '20px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40, fontSize: '24px', fontWeight: 'bold' }}>
          react-transition-group 过渡动画演示
        </h2>
      </div>

      {/* 弹窗过渡动画 */}
      <div style={{ width: '80%', margin: '20px auto' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 20 }}>CSSTransition 弹窗淡入/缩放动画</h3>
        <ModalTransition
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          trigger={
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 4,
                backgroundColor: '#4285f4',
                color: 'white',
                cursor: 'pointer',
                marginBottom: 20,
              }}
            >
              打开弹窗
            </button>
          }
          config={{
            timeout: 300,
            classNames: 'modal-overlay',
            closeOnOverlayClick: true,
          }}
        >
          <h4>react-transition-group 弹窗</h4>
          <p>这是基于 CSSTransition 实现的淡入/缩放动画</p>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              marginTop: 16,
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            关闭弹窗
          </button>
        </ModalTransition>
      </div>

      {/* 列表过渡动画 */}
      <div style={{ width: 400, margin: '40px auto' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 20 }}>TransitionGroup 列表过渡动画</h3>

        {/* 操作按钮 */}
        <button
          onClick={addItem}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            backgroundColor: '#28a745',
            color: 'white',
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          添加列表项
        </button>

        <ListTransition
          items={listItems}
          onChange={setListItems}
          renderItem={(item, index, ref) => (
            <li
              ref={ref}
              className="list-item"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                marginBottom: 8,
                backgroundColor: '#f5f5f5',
                borderRadius: 4,
              }}
            >
              <span>{item.text}</span>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  borderRadius: 4,
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                删除
              </button>
            </li>
          )}
          config={{
            timeout: 300,
            classNames: 'list-item',
            unmountOnExit: true,
          }}
        />
      </div>
    </div>
  );
}