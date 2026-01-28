import React, { useState, useRef, useEffect } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './tab-switch-transition.css';

/**
 * 标签页切换动画组件（基于 SwitchTransition 实现切换动画）
 * @param {Array} tabs - 标签数据数组，每个元素需包含 id 和 label
 * @param {string} activeTab - 当前激活的标签 ID（受控模式）
 * @param {Function} onTabChange - 标签切换回调函数 (tabId) => void
 * @param {Function} renderContent - 自定义内容渲染函数 (activeTab) => ReactNode
 * @param {Function} renderTab - 自定义标签渲染函数 (tab, isActive, onClick) => ReactNode
 * @param {Object} config - 配置选项
 * @param {number} config.timeout - 动画时长，默认 300
 * @param {string} config.classNames - 动画类名前缀，默认 'tab-switch'
 * @param {boolean} config.unmountOnExit - 动画结束后是否卸载组件，默认 true
 * @param {string} config.mode - SwitchTransition 模式，'out-in' 或 'in-out'，默认 'out-in'
 * @param {Object} config.containerStyle - 容器自定义样式
 * @param {Object} config.tabsContainerStyle - 标签容器自定义样式
 * @param {Object} config.tabStyle - 标签默认样式
 * @param {Object} config.activeTabStyle - 激活标签样式
 * @param {Object} config.contentStyle - 内容区域自定义样式
 */
const TabSwitchTransition = ({
  tabs = [],
  activeTab: controlledActiveTab,
  onTabChange,
  renderContent,
  renderTab,
  config = {},
}) => {
  const {
    timeout = 300,
    classNames = 'tab-switch',
    unmountOnExit = true,
    mode = 'out-in',
    containerStyle = {},
    tabsContainerStyle = {},
    tabStyle = {},
    activeTabStyle = {},
    contentStyle = {},
  } = config;

  // 非受控模式：内部管理状态
  const [internalActiveTab, setInternalActiveTab] = useState(tabs.length > 0 ? tabs[0].id : null);

  // 判断是否为受控模式
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  // 同步外部 tabs 变化，设置默认激活标签
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      const defaultTab = isControlled ? controlledActiveTab : tabs[0].id;
      if (!isControlled) {
        setInternalActiveTab(defaultTab);
      }
    }
  }, [tabs, activeTab, isControlled, controlledActiveTab]);

  const handleTabChange = (tabId) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // 创建 ref 用于 CSSTransition（React 18+ 需要）
  const nodeRef = useRef(null);

  // 动画配置
  const transitionConfig = {
    timeout,
    classNames,
    unmountOnExit,
    nodeRef, // 添加 nodeRef 避免使用 findDOMNode
  };

  // 默认容器样式
  const defaultContainerStyle = {
    width: 600,
    margin: '40px auto',
    ...containerStyle,
  };

  // 默认标签容器样式
  const defaultTabsContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    justifyContent: 'center',
    ...tabsContainerStyle,
  };

  // 默认标签样式
  const getDefaultTabStyle = (isActive) => ({
    padding: '8px 16px',
    border: isActive ? '1px solid #4285f4' : '1px solid #ddd',
    borderRadius: 4,
    backgroundColor: isActive ? '#4285f4' : 'white',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...tabStyle,
    ...(isActive ? activeTabStyle : {}),
  });

  // 默认内容样式
  const defaultContentStyle = {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minHeight: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...contentStyle,
  };

  // 默认标签渲染函数
  const defaultRenderTab = (tab, isActive, onClick) => (
    <button
      key={tab.id}
      onClick={onClick}
      style={getDefaultTabStyle(isActive)}
    >
      {tab.label || tab.id}
    </button>
  );

  // 默认内容渲染函数
  const defaultRenderContent = (activeTabId) => {
    const activeTabData = tabs.find(tab => tab.id === activeTabId);
    return (
      <h4 style={{ fontSize: 24, color: '#4285f4' }}>
        {activeTabData?.content || activeTabData?.label || `内容区域 ${activeTabId}`}
      </h4>
    );
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div style={defaultContainerStyle}>
      {/* 标签导航 */}
      <div style={defaultTabsContainerStyle}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const onClick = () => handleTabChange(tab.id);

          return renderTab
            ? renderTab(tab, isActive, onClick)
            : defaultRenderTab(tab, isActive, onClick);
        })}
      </div>

      {/* 核心：SwitchTransition 管理切换动画 */}
      <SwitchTransition mode={mode}>
        <CSSTransition key={activeTab} {...transitionConfig}>
          <div
            ref={nodeRef}
            className="tab-content"
            style={defaultContentStyle}
          >
            {renderContent
              ? renderContent(activeTab)
              : defaultRenderContent(activeTab)}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default TabSwitchTransition;