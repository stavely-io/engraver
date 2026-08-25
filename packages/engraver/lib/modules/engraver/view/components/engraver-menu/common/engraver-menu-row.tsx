import { FC, HTMLAttributes, ReactNode, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils/style';
import { Separator } from '@/shadcn/components/ui/separator';

interface EngraverMenuRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const EngraverMenuRow: FC<EngraverMenuRowProps> = ({ children, className, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [childWidths, setChildWidths] = useState<number[]>([]);
  const [rows, setRows] = useState<ReactNode[][]>([]);
  const childrenArray = useMemo(() => (Array.isArray(children) ? children : [children]), [children]);

  const computeRows = useCallback(
    (containerWidth: number) => {
      if (!containerWidth || childWidths.length === 0) return;

      const newRows: ReactNode[][] = [];
      let currentRow: ReactNode[] = [];
      let currentWidth = 0;

      childrenArray.forEach((child, i) => {
        const w = childWidths[i];
        if (currentWidth + w > containerWidth && currentRow.length) {
          newRows.push(currentRow);
          currentRow = [];
          currentWidth = 0;
        }
        currentRow.push(child);
        currentWidth += w;
      });

      if (currentRow.length) newRows.push(currentRow);
      setRows(newRows);
    },
    [childWidths, childrenArray],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      computeRows(container.clientWidth);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [computeRows]);

  return (
    <div {...props} className={cn('flex w-full flex-col', className)}>
      {childWidths.length < childrenArray.length ? (
        <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
          {childrenArray.map((child, i) => (
            <MeasuredChild
              key={i}
              onRender={(w) =>
                setChildWidths((prev) => {
                  const next = [...prev];
                  next[i] = w;
                  return next;
                })
              }
            >
              {child}
            </MeasuredChild>
          ))}
        </div>
      ) : (
        <div ref={containerRef} className='flex w-full flex-col'>
          {rows.map((row, i) => (
            <div key={i} className={cn('flex flex-row flex-wrap', className)}>
              {row.map((child, idx) => (
                <div key={idx} style={{ display: 'inline-block' }}>
                  {child}
                </div>
              ))}
              {i < rows.length - 1 && <Separator className='bg-muted-foreground' spacing='none' />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MeasuredChild: FC<{ onRender: (width: number) => void; children: ReactNode }> = ({ onRender, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const width = el.offsetWidth;
      onRender(width);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [onRender]);

  return (
    <div
      ref={ref}
      style={{
        display: 'inline-block',
        width: 'auto',
      }}
    >
      {children}
    </div>
  );
};
