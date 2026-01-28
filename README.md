# React 组件库

&gt; 整理自开源社区的高质量 React 组件（含 UI、动画、交互）

## 🎯 已收录组件

### UI 组件
- [shadcn/ui](https://ui.shadcn.com) - 可复制的组件库，Tailwind 风格 ⭐50k+
- ...

### 动画交互
- [framer-motion](https://www.framer.com/motion/) - 生产级动画库 ⭐20k+
- ...

## 📦 快速开始
```bash
git clone https://github.com/ixxoic/react-components-awesome.git
cd react-components-awesome
npm install
npm run dev


| 分类 | 组件/库 |  Stars  | 一句话卖点 |
|------|---------|--------|-----------|
| **UI 组件库** | [shadcn/ui](https://ui.shadcn.com) | 57k | 可复制源码，完全可控，Tailwind 风格 |
| | [Mantine](https://mantine.dev) | 25k | 功能全、Hook 丰富，黑暗模式一流 |
| | [Chakra UI](https://chakra-ui.com) | 35k | 语义化、无障碍、主题定制强 |
| **动画** | [framer-motion](https://www.framer.com/motion/) | 21k | 声明式动画，支持弹簧、拖拽 |
| | [react-spring](https://www.react-spring.dev) | 27k | 物理动画，性能极致 |
| | [AutoAnimate](https://autoanimate.formkit.com) | 9k | 零配置，一行代码加动画 |
| **交互** | [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) | 29k | 拖拽排序，体验顺滑 |
| | [react-hook-form](https://react-hook-form.com) | 39k | 表单校验，性能怪兽 |
| | [SWR](https://swr.vercel.app) | 29k | 数据请求，自动缓存/重试 |
| **可视化** | [recharts](https://recharts.org) | 22k | React 图表，API 友好 |
| | [reactflow](https://reactflow.dev) | 28k | 节点流程图，可视化编排 |
| **音/视频** | [react-player](https://github.com/cookpete/react-player) | 23k | 万能播放器，支持多平台 |
| **特效** | [react-three-fiber](https://github.com/pmndrs/react-three-fiber) | 25k | 3D 渲染，把 three.js 变成 React 组件 |
| **通知/反馈** | [react-hot-toast](https://react-hot-toast.com) | 8k | 吐司提示，丝滑动画 |
| | [notistack](https://iamhosseindhv.com/notistack) | 9k | 通知队列，堆叠管理 |


# React 优质组件仓库
整理 React 生态中样式/交互优秀的开源组件，含完整的样式和动画逻辑。

## 已整理组件
### 1. shadcn/ui 组件（UI类）
| 组件名 | 核心交互/动画 | 依赖 | 使用示例 |
|--------|---------------|------|----------|
| Button | hover 背景渐变、点击反馈 | @radix-ui/react-slot、class-variance-authority | src/examples/ShadcnDemo.jsx |
| Dialog | 弹窗淡入/淡出、缩放动画 | @radix-ui/react-dialog、lucide-react | src/examples/ShadcnDemo.jsx |

### 2. @dnd-kit/core 组件（拖拽交互类）
| 组件/API 名称                  | 核心交互/动画                     | 依赖 | 使用示例 |
|-------------------------------|----------------------------------|------|----------|
| DndContext                    | 拖拽上下文，碰撞检测             | @dnd-kit/core | src/examples/DndKitDemo.jsx |
| SortableContext               | 排序上下文，纵向/横向排序策略     | @dnd-kit/sortable | src/examples/DndKitDemo.jsx |
| useSortable                   | 排序钩子，封装拖拽/排序逻辑       | @dnd-kit/sortable | src/examples/DndKitDemo.jsx |
| DragOverlay                   | 拖拽悬浮层，跟随动画             | @dnd-kit/core | src/examples/DndKitDemo.jsx |

## 快速开始
1. 克隆仓库：`git clone https://github.com/ixxoic/react-awesome-components.git`
2. 安装依赖：`npm install`
3. 运行演示：`npm run dev`
4. 访问：http://localhost:5173/

## 官方源码地址
- shadcn/ui：https://github.com/shadcn/ui
- @dnd-kit：https://github.com/clauderic/dnd-kit

### 2. @dnd-kit/core 组件（拖拽交互类）
| 组件/API 名称                  | 核心交互/动画                     | 依赖 | 使用示例 |
|-------------------------------|----------------------------------|------|----------|
| KanbanBoard                   | 多列卡片拖拽、跨列移动、排序     | @dnd-kit/core、@dnd-kit/utilities | src/examples/KanbanDemo.jsx |


### 2. @dnd-kit/core 组件（拖拽交互类）
| 组件/API 名称                  | 核心交互/动画                     | 依赖 | 使用示例 |
|-------------------------------|----------------------------------|------|----------|
| KanbanBoard                   | 多列卡片拖拽、跨列移动、排序     | @dnd-kit/core、@dnd-kit/utilities | src/examples/KanbanDemo.jsx |
| GridSnapDrag                  | 网格磁吸吸附、边界限制、回弹动画 | @dnd-kit/core、@dnd-kit/utilities | src/examples/GridSnapDemo.jsx |


### 2. @dnd-kit/core 组件（拖拽交互类）
| 组件/API 名称                  | 核心交互/动画                     | 依赖 | 使用示例 |
|-------------------------------|----------------------------------|------|----------|
| KanbanBoard                   | 多列卡片拖拽、跨列移动、排序     | @dnd-kit/core、@dnd-kit/utilities | src/examples/KanbanDemo.jsx |
| GridSnapDrag                  | 网格磁吸吸附、边界限制、回弹动画 | @dnd-kit/core、@dnd-kit/utilities | src/examples/GridSnapDemo.jsx |
| CustomDragHandle              | 自定义拖拽手柄、内容区防误触     | @dnd-kit/core、@dnd-kit/utilities | src/examples/CustomHandleDemo.jsx |


# React 优质组件仓库
整理 React 生态中样式/交互优秀的开源组件，含完整的样式和动画逻辑。

## 已整理组件
### 1. shadcn/ui 组件（UI类）
| 组件名 | 核心交互/动画 | 依赖 | 使用示例 |
|--------|---------------|------|----------|
| Button | hover 背景渐变、点击反馈 | @radix-ui/react-slot、class-variance-authority | src/examples/ShadcnDemo.jsx |
| Dialog | 弹窗淡入/淡出、缩放动画 | @radix-ui/react-dialog、lucide-react | src/examples/ShadcnDemo.jsx |

### 2. @dnd-kit/core 组件（拖拽交互类）
| 组件/API 名称                  | 核心交互/动画                     | 依赖 | 使用示例 |
|-------------------------------|----------------------------------|------|----------|
| KanbanBoard                   | 多列卡片拖拽、跨列移动、排序     | @dnd-kit/core、@dnd-kit/utilities | src/examples/KanbanDemo.jsx |
| GridSnapDrag                  | 网格磁吸吸附、边界限制、回弹动画 | @dnd-kit/core、@dnd-kit/utilities | src/examples/GridSnapDemo.jsx |
| CustomDragHandle              | 自定义拖拽手柄、内容区防误触     | @dnd-kit/core、@dnd-kit/utilities | src/examples/CustomHandleDemo.jsx |

### 3. react-transition-group 组件（过渡动画类）
| 组件名                | 核心交互/动画                     | 依赖 | 使用示例 |
|-----------------------|----------------------------------|------|----------|
| CSSTransition         | 弹窗淡入/缩放、列表项滑入/滑出   | react-transition-group | src/examples/TransitionGroupDemo.jsx |
| TransitionGroup       | 批量管理列表项进入/离开动画       | react-transition-group | src/examples/TransitionGroupDemo.jsx |

### 3. react-transition-group 组件（过渡动画类）
| 组件名                | 核心交互/动画                     | 依赖 | 使用示例 |
|-----------------------|----------------------------------|------|----------|
| CSSTransition         | 弹窗淡入/缩放、列表项滑入/滑出   | react-transition-group | src/examples/TransitionGroupDemo.jsx |
| TransitionGroup       | 批量管理列表项进入/离开动画       | react-transition-group | src/examples/TransitionGroupDemo.jsx |
| TabSwitchTransition   | 标签页左右滑动切换、淡入淡出     | react-transition-group | src/examples/TabSwitchDemo.jsx |

可扩展优化（可选）
多种动画效果：可以把 tab-switch-transition.css 改成淡入淡出、缩放等其他动画
自定义动画时长：把 timeout 改成 props 传入，支持不同场景的动画速度
动画顺序切换：修改 SwitchTransition 的 mode 属性（in-out / out-in）
路由切换适配：结合 React Router 实现路由页面的切换动画

### 3. react-transition-group 组件（过渡动画类）
| 组件名                | 核心交互/动画                     | 依赖 | 使用示例 |
|-----------------------|----------------------------------|------|----------|
| NumberScrollTransition | 纯 JS 数字滚动动画（缓动效果） | react-transition-group | src/examples/NumberScrollDemo.jsx |
| JSProgressBar         | 纯 JS 进度条动画（暂停/继续/动态配色） | react-transition-group | src/examples/JSProgressBarDemo.jsx |