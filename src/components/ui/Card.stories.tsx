// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 카드
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300">
          This is the card content. You can put any content here.
        </p>
      </CardContent>
    </Card>
  ),
};

// 푸터가 있는 카드
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Fill out the form below to get started.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">Cancel</Button>
        <Button className="flex-1">Create</Button>
      </CardFooter>
    </Card>
  ),
};

// 블로그 포스트 카드
export const BlogPostCard: Story = {
  render: () => (
    <Card className="w-[350px] hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <Badge variant="default">Android</Badge>
          <Badge variant="secondary">Kotlin</Badge>
        </div>
        <CardTitle className="text-xl">Android Clean Architecture 적용하기</CardTitle>
        <CardDescription>2025년 1월 5일 · 10분 읽기</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          Clean Architecture를 Android 프로젝트에 적용하는 방법과 실제 사례를 소개합니다.
          Domain Layer, Data Layer, Presentation Layer의 역할과 구조에 대해 알아봅니다.
        </p>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 dark:text-gray-400">
        <span>이진욱</span>
      </CardFooter>
    </Card>
  ),
};

// 심플한 정보 카드
export const InfoCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">프로젝트 통계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">총 포스트</span>
          <span className="font-semibold text-gray-900 dark:text-white">42</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">카테고리</span>
          <span className="font-semibold text-gray-900 dark:text-white">8</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">조회수</span>
          <span className="font-semibold text-gray-900 dark:text-white">1,234</span>
        </div>
      </CardContent>
    </Card>
  ),
};

// 이미지가 있는 카드
export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-[200px] bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">Image Placeholder</span>
      </div>
      <CardHeader>
        <CardTitle>Featured Post</CardTitle>
        <CardDescription>January 8, 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This is a featured blog post with an image header.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Read More</Button>
      </CardFooter>
    </Card>
  ),
};

// 여러 카드 그리드
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle className="text-lg">Card 1</CardTitle>
          <CardDescription>Simple card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300">Content for card 1</p>
        </CardContent>
      </Card>

      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle className="text-lg">Card 2</CardTitle>
          <CardDescription>Another card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300">Content for card 2</p>
        </CardContent>
      </Card>

      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle className="text-lg">Card 3</CardTitle>
          <CardDescription>Third card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300">Content for card 3</p>
        </CardContent>
      </Card>

      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle className="text-lg">Card 4</CardTitle>
          <CardDescription>Fourth card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300">Content for card 4</p>
        </CardContent>
      </Card>
    </div>
  ),
};
