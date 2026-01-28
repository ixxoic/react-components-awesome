import React, { useState } from 'react';
import TabSwitchTransition from '../components/animation/transition-group/TabSwitchTransition';

// 标签页切换动画演示
export default function TabSwitchDemo() {
  const [activeTab, setActiveTab] = useState('tab1');

  // 标签数据
  const tabs = [
    { id: 'tab1', label: '标签 1', content: '内容区域 1' },
    { id: 'tab2', label: '标签 2', content: '内容区域 2' },
    { id: 'tab3', label: '标签 3', content: '内容区域 3' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <TabSwitchTransition
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        renderContent={(activeTabId) => {
          const activeTabData = tabs.find(tab => tab.id === activeTabId);
          return (
            <h4 style={{ fontSize: 24, color: '#4285f4' }}>
              {activeTabData?.content}
            </h4>
          );
        }}
        config={{
          timeout: 300,
          classNames: 'tab-switch',
          mode: 'out-in',
          containerStyle: { width: 600, margin: '40px auto' },
        }}
      />
    </div>
  );
}