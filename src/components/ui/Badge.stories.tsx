import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline'],
      description: '배지의 스타일 변형',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 배지
export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

// Secondary 배지
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

// Outline 배지
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

// 카테고리 배지 예시
export const CategoryBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Android</Badge>
      <Badge variant="default">Kotlin</Badge>
      <Badge variant="secondary">Architecture</Badge>
      <Badge variant="secondary">Clean Code</Badge>
      <Badge variant="outline">Tutorial</Badge>
      <Badge variant="outline">Tips</Badge>
    </div>
  ),
};

// 블로그 포스트 태그 예시
export const BlogTags: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>주요 카테고리</Badge>
        <Badge>Android</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">서브 카테고리</Badge>
        <Badge variant="secondary">Jetpack Compose</Badge>
        <Badge variant="secondary">ViewModel</Badge>
      </div>
    </div>
  ),
};
