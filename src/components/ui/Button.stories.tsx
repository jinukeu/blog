import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'link'],
      description: '버튼의 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼의 크기',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 상태',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: '버튼',
    variant: 'default',
    size: 'md',
  },
};

// Outline 버튼
export const Outline: Story = {
  args: {
    children: 'Outline 버튼',
    variant: 'outline',
    size: 'md',
  },
};

// Ghost 버튼
export const Ghost: Story = {
  args: {
    children: 'Ghost 버튼',
    variant: 'ghost',
    size: 'md',
  },
};

// Link 버튼
export const Link: Story = {
  args: {
    children: 'Link 버튼',
    variant: 'link',
    size: 'md',
  },
};

// Small 크기
export const Small: Story = {
  args: {
    children: 'Small 버튼',
    variant: 'default',
    size: 'sm',
  },
};

// Large 크기
export const Large: Story = {
  args: {
    children: 'Large 버튼',
    variant: 'default',
    size: 'lg',
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    children: '비활성화 버튼',
    variant: 'default',
    size: 'md',
    disabled: true,
  },
};

// 모든 변형 한눈에 보기
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled Outline</Button>
      </div>
    </div>
  ),
};
