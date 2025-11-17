# Mobile Optimization Checklist

## Overview

This document provides a comprehensive checklist for testing mobile responsiveness across the lunch reservation system.

## Testing Viewports

- **Mobile Small**: 320px - 374px
- **Mobile Medium**: 375px - 424px
- **Mobile Large**: 425px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## Completed Optimizations

### 1. ✅ Dialog/Modal Components

- **Location**: `src/_components/ui/dialog.tsx`
- **Changes**:
  - Mobile: Fullscreen bottom sheet with rounded top corners
  - Tablet+: Centered modal with max-width
  - Max height constraints to prevent overflow
  - Proper scrolling for long content

### 2. ✅ Data Tables

- **Location**: `src/_components/ui/data-table.tsx`
- **Changes**:
  - Horizontal scroll wrapper for mobile
  - Whitespace-nowrap on cells to prevent text wrapping
  - Responsive pagination controls
  - Page counter display
  - Translated button text to Portuguese

### 3. ✅ Page Layout

- **Location**: `src/_components/ui/page-container.tsx`
- **Changes**:
  - Responsive padding (4 on mobile, 6 on desktop)
  - Responsive spacing (4 on mobile, 6 on desktop)
  - Flexible header layout (column on mobile, row on desktop)
  - Responsive title sizes (xl on mobile, 2xl on desktop)
  - Responsive description sizes (xs on mobile, sm on desktop)
  - Full-width action buttons on mobile

### 4. ✅ Create Buttons

- **Locations**:
  - `src/app/(dashboard)/usuarios/_components/create-user-button.tsx`
  - `src/app/(dashboard)/categorias/_components/create-category-button.tsx`
  - `src/app/(dashboard)/itens-menu/_components/create-menu-item-button.tsx`
  - `src/app/(dashboard)/cardapios/_components/create-menu-button.tsx`
- **Changes**:
  - Full width on mobile, auto width on desktop
  - Shortened text on mobile ("Novo" instead of "Novo Usuário")
  - Full text on desktop

### 5. ✅ Sidebar Navigation

- **Location**: `src/_components/common/sidebar.tsx`
- **Changes**:
  - Hidden on mobile by default
  - Hamburger menu trigger in header
  - Overlay backdrop on mobile
  - Slide-in animation
  - Close button visible on mobile
  - Fixed positioning on mobile

### 6. ✅ Header Component

- **Location**: `src/_components/common/header.tsx`
- **Changes**:
  - Hamburger menu button visible on mobile
  - Logo hidden on mobile (shown in sidebar)
  - Responsive user menu
  - User details hidden on mobile (shown in dropdown)

### 7. ✅ Global CSS Optimizations

- **Location**: `src/app/globals.css`
- **Changes**:
  - Prevent zoom on input focus (iOS)
  - Minimum touch target sizes (44px)
  - Prevent horizontal scroll
  - Smooth scrolling
  - Better focus visibility for keyboard navigation

### 8. ✅ Dashboard Layout

- **Location**: `src/app/(dashboard)/layout.tsx`
- **Changes**:
  - Responsive sidebar (hidden on mobile, visible on desktop)
  - Mobile overlay with backdrop
  - Proper z-index layering

## Testing Checklist

### Authentication Pages

- [ ] Login page displays correctly on 320px viewport
- [ ] CPF input mask works on mobile keyboards
- [ ] Password input shows/hides correctly
- [ ] Form validation messages are readable
- [ ] Submit button is easily tappable (44px min)
- [ ] No zoom on input focus (iOS)

### Dashboard Layout

- [ ] Hamburger menu appears on mobile
- [ ] Sidebar slides in from left on mobile
- [ ] Backdrop closes sidebar when tapped
- [ ] Close button works in sidebar
- [ ] Header is responsive and doesn't overflow
- [ ] User menu dropdown works on mobile

### Dashboard (User)

- [ ] Stats cards are responsive (3 columns on desktop, 1 on mobile)
- [ ] Próximos Cardápios section displays correctly
- [ ] Menu cards stack vertically on mobile
- [ ] "Ver Detalhes" button is full width on mobile
- [ ] Badge "Reservado" wraps properly with date/day
- [ ] All content stays within card boundaries
- [ ] No horizontal overflow on any card

### Dashboard (Admin)

- [ ] Stats cards grid is responsive (4 columns on desktop, 1-2 on mobile)
- [ ] Cardápios da Semana cards stack properly on mobile
- [ ] Reservas Recentes cards stack properly on mobile
- [ ] "Ver" buttons are full width on mobile
- [ ] Status badges display correctly without overflow
- [ ] Two-column layout on desktop, single column on mobile

### User Management (Admin)

- [ ] Page header stacks vertically on mobile
- [ ] "Novo" button is full width on mobile
- [ ] Table scrolls horizontally on mobile
- [ ] All columns are visible with scroll
- [ ] Action dropdown menus work on mobile
- [ ] Edit dialog is fullscreen on mobile
- [ ] Form inputs are properly sized
- [ ] CPF mask works on mobile keyboard
- [ ] Select dropdowns are accessible

### Category Management (Admin)

- [ ] Page layout is responsive
- [ ] Create button works on mobile
- [ ] Table scrolls horizontally
- [ ] Edit/delete actions are accessible
- [ ] Form dialog is fullscreen on mobile
- [ ] Textarea is properly sized

### Menu Items Management (Admin)

- [ ] Responsive layout
- [ ] Filters work on mobile
- [ ] Table is scrollable
- [ ] Category select is accessible
- [ ] Form validation works

### Menus/Cardápios (Admin + User)

- [ ] Calendar view is responsive
- [ ] Week navigation works on mobile
- [ ] Menu cards stack properly
- [ ] Details dialog is fullscreen on mobile
- [ ] Date picker works on mobile
- [ ] Item selection is accessible

### Reservations (User)

- [ ] Reservation list is responsive
- [ ] Table scrolls horizontally
- [ ] Status badges are visible
- [ ] Action buttons are accessible
- [ ] Variation selection works
- [ ] Cancel confirmation is clear

### All Reservations (Admin)

- [ ] Filters are accessible on mobile
- [ ] Table scrolls properly
- [ ] User search works
- [ ] Date range picker works

## Common Issues to Check

### Input Fields

- [ ] No zoom on focus (iOS Safari)
- [ ] Proper keyboard types (numeric for CPF, etc.)
- [ ] Autocomplete attributes set correctly
- [ ] Labels are associated with inputs

### Buttons

- [ ] Minimum 44px touch targets
- [ ] Proper spacing between buttons
- [ ] Loading states are visible
- [ ] Disabled states are clear

### Tables

- [ ] Horizontal scroll works smoothly
- [ ] Scroll indicators are visible
- [ ] Headers stay aligned with content
- [ ] Action buttons are accessible

### Modals/Dialogs

- [ ] Fullscreen on mobile
- [ ] Scrollable content
- [ ] Close button is accessible
- [ ] Backdrop dismisses modal
- [ ] Form submission works

### Navigation

- [ ] Sidebar opens/closes smoothly
- [ ] Active route is highlighted
- [ ] All menu items are accessible
- [ ] Logout works correctly

## Browser Testing

### iOS Safari

- [ ] No zoom on input focus
- [ ] Touch gestures work
- [ ] Scrolling is smooth
- [ ] Modals display correctly

### Chrome Mobile

- [ ] All features work
- [ ] Performance is good
- [ ] No layout shifts

### Firefox Mobile

- [ ] Compatibility verified
- [ ] No rendering issues

### Samsung Internet

- [ ] Basic functionality works
- [ ] No major issues

## Performance Checks

- [ ] Page load time < 3s on 3G
- [ ] No layout shifts (CLS)
- [ ] Smooth scrolling (60fps)
- [ ] Images are optimized
- [ ] Code splitting is effective

## Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets are adequate

## Notes

- Test on real devices when possible
- Use Chrome DevTools device emulation for initial testing
- Test with slow network conditions
- Test with different font sizes
- Test in both portrait and landscape orientations
