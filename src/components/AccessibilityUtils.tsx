// ============================================================================
// AccessibilityUtils.tsx - ARIA helpers and keyboard navigation utilities
// Location: src/components/AccessibilityUtils.tsx
// ============================================================================

import React, { useEffect, useRef, useCallback, KeyboardEvent } from 'react';

// ============================================================================
// SKIP LINK - Allows keyboard users to skip navigation
// ============================================================================

interface SkipLinkProps {
    targetId: string;
    children?: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
    targetId, 
    children = 'Skip to main content' 
}) => {
    return (
        <a
            href={`#${targetId}`}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
            {children}
        </a>
    );
};

// ============================================================================
// VISUALLY HIDDEN - Screen reader only text
// ============================================================================

interface VisuallyHiddenProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ 
    children, 
    as: Component = 'span' 
}) => {
    return (
        <Component className="sr-only">
            {children}
        </Component>
    );
};

// ============================================================================
// LIVE REGION - Announces dynamic content changes
// ============================================================================

interface LiveRegionProps {
    children: React.ReactNode;
    assertive?: boolean;
    atomic?: boolean;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ 
    children, 
    assertive = false,
    atomic = true 
}) => {
    return (
        <div
            role="status"
            aria-live={assertive ? 'assertive' : 'polite'}
            aria-atomic={atomic}
            className="sr-only"
        >
            {children}
        </div>
    );
};

// ============================================================================
// FOCUS TRAP - Keeps focus within a container (for modals)
// ============================================================================

interface FocusTrapProps {
    children: React.ReactNode;
    active?: boolean;
    onEscape?: () => void;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ 
    children, 
    active = true,
    onEscape 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!active) return;
        
        const container = containerRef.current;
        if (!container) return;
        
        // Get all focusable elements
        const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element on mount
        firstElement?.focus();
        
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape' && onEscape) {
                onEscape();
                return;
            }
            
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [active, onEscape]);
    
    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
};

// ============================================================================
// KEYBOARD NAV - Arrow key navigation for lists/grids
// ============================================================================

interface KeyboardNavProps {
    children: React.ReactNode;
    orientation?: 'horizontal' | 'vertical' | 'grid';
    columns?: number; // For grid orientation
    onSelect?: (index: number) => void;
    loop?: boolean;
}

export const KeyboardNav: React.FC<KeyboardNavProps> = ({
    children,
    orientation = 'vertical',
    columns = 1,
    onSelect,
    loop = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [focusIndex, setFocusIndex] = React.useState(0);
    
    const items = React.Children.toArray(children);
    const itemCount = items.length;
    
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        let newIndex = focusIndex;
        
        switch (e.key) {
            case 'ArrowDown':
                if (orientation === 'vertical' || orientation === 'grid') {
                    e.preventDefault();
                    newIndex = orientation === 'grid' 
                        ? focusIndex + columns 
                        : focusIndex + 1;
                }
                break;
            case 'ArrowUp':
                if (orientation === 'vertical' || orientation === 'grid') {
                    e.preventDefault();
                    newIndex = orientation === 'grid' 
                        ? focusIndex - columns 
                        : focusIndex - 1;
                }
                break;
            case 'ArrowRight':
                if (orientation === 'horizontal' || orientation === 'grid') {
                    e.preventDefault();
                    newIndex = focusIndex + 1;
                }
                break;
            case 'ArrowLeft':
                if (orientation === 'horizontal' || orientation === 'grid') {
                    e.preventDefault();
                    newIndex = focusIndex - 1;
                }
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = itemCount - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                onSelect?.(focusIndex);
                return;
            default:
                return;
        }
        
        // Handle wrapping
        if (loop) {
            if (newIndex < 0) newIndex = itemCount - 1;
            if (newIndex >= itemCount) newIndex = 0;
        } else {
            newIndex = Math.max(0, Math.min(itemCount - 1, newIndex));
        }
        
        setFocusIndex(newIndex);
        
        // Focus the new item
        const container = containerRef.current;
        if (container) {
            const focusableElements = container.querySelectorAll<HTMLElement>('[data-keyboard-nav-item]');
            focusableElements[newIndex]?.focus();
        }
    }, [focusIndex, orientation, columns, itemCount, loop, onSelect]);
    
    return (
        <div
            ref={containerRef}
            role="listbox"
            aria-orientation={orientation === 'grid' ? undefined : orientation}
            onKeyDown={handleKeyDown}
        >
            {React.Children.map(children, (child, index) => (
                <div
                    data-keyboard-nav-item
                    role="option"
                    aria-selected={index === focusIndex}
                    tabIndex={index === focusIndex ? 0 : -1}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

// ============================================================================
// ACCESSIBLE BUTTON - Button with proper ARIA attributes
// ============================================================================

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
    children,
    loading = false,
    loadingText = 'Loading...',
    icon,
    iconPosition = 'left',
    disabled,
    className = '',
    ...props
}) => {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            aria-busy={loading}
            aria-disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 ${className}`}
        >
            {loading ? (
                <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    <VisuallyHidden>{loadingText}</VisuallyHidden>
                    <span aria-hidden="true">{loadingText}</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
                    {children}
                    {icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
                </>
            )}
        </button>
    );
};

// ============================================================================
// ACCESSIBLE ICON - Icon with proper accessibility
// ============================================================================

interface AccessibleIconProps {
    icon: React.ReactNode;
    label: string;
    decorative?: boolean;
}

export const AccessibleIcon: React.FC<AccessibleIconProps> = ({
    icon,
    label,
    decorative = false
}) => {
    if (decorative) {
        return <span aria-hidden="true">{icon}</span>;
    }
    
    return (
        <span role="img" aria-label={label}>
            {icon}
        </span>
    );
};

// ============================================================================
// USE ANNOUNCE - Hook for screen reader announcements
// ============================================================================

export const useAnnounce = () => {
    const announceRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        // Create announce element if it doesn't exist
        let element = document.getElementById('sr-announcer') as HTMLDivElement;
        if (!element) {
            element = document.createElement('div');
            element.id = 'sr-announcer';
            element.setAttribute('role', 'status');
            element.setAttribute('aria-live', 'polite');
            element.setAttribute('aria-atomic', 'true');
            element.className = 'sr-only';
            document.body.appendChild(element);
        }
        announceRef.current = element;
        
        return () => {
            // Cleanup on unmount
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        };
    }, []);
    
    const announce = useCallback((message: string, assertive = false) => {
        if (announceRef.current) {
            // Update aria-live based on urgency
            announceRef.current.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
            // Clear and set message (triggers announcement)
            announceRef.current.textContent = '';
            setTimeout(() => {
                if (announceRef.current) {
                    announceRef.current.textContent = message;
                }
            }, 50);
        }
    }, []);
    
    return announce;
};

// ============================================================================
// ARIA ATTRIBUTES HELPER
// ============================================================================

export const ariaHelpers = {
    // For expandable sections
    expandable: (expanded: boolean, controlsId?: string) => ({
        'aria-expanded': expanded,
        ...(controlsId && { 'aria-controls': controlsId })
    }),
    
    // For tabs
    tab: (selected: boolean, panelId: string) => ({
        role: 'tab',
        'aria-selected': selected,
        'aria-controls': panelId,
        tabIndex: selected ? 0 : -1
    }),
    
    // For tab panels
    tabPanel: (tabId: string, hidden: boolean) => ({
        role: 'tabpanel',
        'aria-labelledby': tabId,
        hidden,
        tabIndex: 0
    }),
    
    // For progress indicators
    progress: (current: number, max: number, label?: string) => ({
        role: 'progressbar',
        'aria-valuenow': current,
        'aria-valuemin': 0,
        'aria-valuemax': max,
        ...(label && { 'aria-label': label })
    }),
    
    // For error messages
    error: (errorId: string, hasError: boolean) => ({
        'aria-invalid': hasError,
        ...(hasError && { 'aria-describedby': errorId })
    }),
    
    // For required fields
    required: {
        'aria-required': true
    },
    
    // For current page in navigation
    currentPage: {
        'aria-current': 'page' as const
    }
};

export default {
    SkipLink,
    VisuallyHidden,
    LiveRegion,
    FocusTrap,
    KeyboardNav,
    AccessibleButton,
    AccessibleIcon,
    useAnnounce,
    ariaHelpers
};