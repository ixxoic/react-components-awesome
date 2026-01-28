import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
// 引入动画样式（核心：过渡动画的 CSS 类）
import './modal-transition.css';

/**
 * 弹窗过渡组件（基于 CSSTransition 实现淡入/缩放动画）
 * @param {boolean} isOpen - 控制弹窗显示/隐藏（受控模式）
 * @param {Function} onOpenChange - 弹窗状态改变回调 (isOpen) => void
 * @param {ReactNode} children - 弹窗内容
 * @param {ReactNode} trigger - 自定义触发按钮
 * @param {Object} config - 配置选项
 * @param {number} config.timeout - 动画时长，默认 300
 * @param {string} config.classNames - 动画类名前缀，默认 'modal-overlay'
 * @param {boolean} config.closeOnOverlayClick - 点击蒙层是否关闭，默认 true
 * @param {boolean} config.unmountOnExit - 动画结束后是否卸载组件，默认 true
 * @param {boolean} config.appear - 首次渲染是否执行动画，默认 true
 * @param {Object} config.overlayStyle - 蒙层自定义样式
 * @param {Object} config.contentStyle - 内容区域自定义样式
 */
const ModalTransition = ({
  isOpen: controlledIsOpen,
  onOpenChange,
  children,
  trigger,
  config = {},
}) => {
  const {
    timeout = 300,
    classNames = 'modal-overlay',
    closeOnOverlayClick = true,
    unmountOnExit = true,
    appear = true,
    overlayStyle = {},
    contentStyle = {},
  } = config;

  // 非受控模式：内部管理状态
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // 判断是否为受控模式
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpenChange = (newIsOpen) => {
    if (!isControlled) {
      setInternalIsOpen(newIsOpen);
    }
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  };

  // 创建 ref 用于 CSSTransition（React 18+ 需要）
  const modalRef = useRef(null);

  // 默认蒙层样式
  const defaultOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    ...overlayStyle,
  };

  // 默认内容样式
  const defaultContentStyle = {
    width: 400,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    ...contentStyle,
  };

  // 默认触发按钮
  const defaultTrigger = (
    <button
      onClick={() => handleOpenChange(true)}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: 4,
        backgroundColor: '#4285f4',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      打开弹窗
    </button>
  );

  return (
    <>
      {/* 触发按钮 */}
      {trigger !== null && (trigger || defaultTrigger)}

      {/* 弹窗（使用单个 CSSTransition 包裹整个弹窗） */}
      <CSSTransition
        in={isOpen}
        timeout={timeout}
        nodeRef={modalRef}
        classNames={classNames}
        unmountOnExit={unmountOnExit}
        appear={appear}
      >
        <div
          ref={modalRef}
          className={classNames}
          onClick={closeOnOverlayClick ? () => handleOpenChange(false) : undefined}
          style={defaultOverlayStyle}
        >
          {/* 弹窗内容 */}
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // 阻止冒泡关闭
            style={defaultContentStyle}
          >
            {children}
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default ModalTransition;