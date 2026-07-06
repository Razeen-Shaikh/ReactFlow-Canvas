import { Separator } from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

function UiSeparator({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  )
}

export { UiSeparator as Separator }
