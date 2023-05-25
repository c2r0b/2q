import type { Meta, StoryObj } from '@storybook/web-components';
import type { QuiToggleProps } from './QuiToggle';
import { QuiToggle } from './QuiToggle';

const meta = {
  title: 'Components/QuiToggle',
  tags: ['autodocs'],
  render: (args) => QuiToggle(args),
  args: {
    label: 'Toggle',
    onClick: () => {},
  },
  argTypes: {
    label: { control: 'text' },
    onClick: { action: 'clicked' },
  }
} satisfies Meta<QuiToggleProps>;

export default meta;
type Story = StoryObj<QuiToggleProps>;

export const Default: Story = {
  args: {
    label: 'Label',
  },
};