import React, { useState, useRef, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
// 引入列表动画样式
import './list-transition.css';

/**
 * 列表过渡组件（动态增删列表项，带进入/离开动画）
 * @param {Array} items - 列表数据数组，每个元素需包含唯一 id
 * @param {Function} onChange - 列表改变时的回调函数 (newItems) => void
 * @param {Function} renderItem - 自定义渲染函数 (item, index, ref) => ReactNode，ref 需要传递给根元素
 * @param {Object} config - 配置选项
 * @param {number} config.timeout - 动画时长，默认 300
 * @param {string} config.classNames - 动画类名前缀，默认 'list-item'
 * @param {boolean} config.unmountOnExit - 动画结束后是否卸载组件，默认 true
 * @param {string} config.component - TransitionGroup 的组件类型，默认 'ul'
 * @param {Object} config.containerStyle - 容器自定义样式
 * @param {Object} config.listStyle - 列表自定义样式
 * @param {Object} config.itemStyle - 列表项自定义样式
 */
const ListTransition = ({
  items: initialItems = [],
  onChange,
  renderItem,
  config = {},
}) => {
  const {
    timeout = 300,
    classNames = 'list-item',
    unmountOnExit = true,
    component = 'ul',
    containerStyle = {},
    listStyle = {},
    itemStyle = {},
  } = config;

  // 内部状态管理 items
  const [items, setItems] = useState(initialItems);

  // 同步外部 items 变化
  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  // 为每个列表项创建 ref（使用 Map 存储）
  const itemRefs = useRef(new Map());

  // 默认渲染函数
  const defaultRenderItem = (item, index, ref) => (
    <li
      ref={ref}
      className={classNames}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        ...itemStyle,
      }}
    >
      <span>{item.text || item.label || JSON.stringify(item)}</span>
    </li>
  );

  // 默认容器样式
  const defaultContainerStyle = {
    width: 400,
    margin: '40px auto',
    ...containerStyle,
  };

  // 默认列表样式
  const defaultListStyle = {
    listStyle: 'none',
    padding: 0,
    ...listStyle,
  };

  return (
    <div style={defaultContainerStyle}>
      {/* 核心：TransitionGroup 包裹列表，批量管理过渡动画 */}
      <TransitionGroup component={component} style={defaultListStyle}>
        {items.map((item, index) => {
          // 为每个 item 创建或获取 ref
          let nodeRef = itemRefs.current.get(item.id);
          if (!nodeRef) {
            nodeRef = React.createRef();
            itemRefs.current.set(item.id, nodeRef);
          }

          // 渲染列表项内容（传递 ref）
          const itemContent = renderItem
            ? renderItem(item, index, nodeRef)
            : defaultRenderItem(item, index, nodeRef);

          return (
            <CSSTransition
              key={item.id}
              nodeRef={nodeRef}
              timeout={timeout}
              classNames={classNames}
              unmountOnExit={unmountOnExit}
            >
              {itemContent}
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};

export default ListTransition;