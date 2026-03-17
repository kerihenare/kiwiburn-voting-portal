# Glidepath

Type-safe styled-component primitive for React + Tailwind CSS.

`glide` wraps a React element or component with typed Tailwind properties, producing a new component with those classes baked in. There is no CSS-in-JS runtime -- this is purely a class-name composition layer.

**What you get:**

- **Type-safe Tailwind** -- each CSS category (`display`, `padding`, `textColor`, etc.) autocompletes only valid Tailwind class strings.
- **Responsive support** -- every property accepts `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixed values or arrays of them.
- **Class merging** -- consumer `className` props are merged via `tailwind-merge`, so callers can override defaults.

## Usage

### Static styles (object form)

```tsx
import { glide } from '@/lib/glidepath'

const Card = glide('div', {
  backgroundColor: 'bg-white',
  borderRadius: 'rounded-lg',
  display: 'flex',
  flexDirection: 'flex-col',
  padding: ['p-4', 'sm:p-8'],
})
```

### Dynamic styles (function form)

The function receives the component's props and returns a `GlidepathObject`:

```tsx
const Panel = glide('div', (props) => ({
  display: props['aria-expanded'] ? 'flex' : 'hidden',
  padding: 'p-4',
}))
```

### Overriding at the call site

Consumer `className` is merged via tailwind-merge. Conflicting classes are resolved in favour of the consumer:

```tsx
<Card className="mt-8" />        {/* mt-8 is added */}
<Card className="block" />       {/* block overrides the styled display: 'flex' */}
```

## API

### `glide(Component, styles)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `Component` | `keyof JSX.IntrinsicElements \| JSXElementConstructor<any>` | Any HTML tag (`'div'`, `'span'`, etc.) or React component. |
| `styles` | `GlidepathObject \| GlidePathFunction<T>` | A static object of typed Tailwind properties, or a function `(props) => GlidepathObject` for dynamic styles. |

Returns a component with the same prop types as `Component`.

## The `GlidepathObject` interface

Keys are camelCase CSS property names organised by Tailwind documentation category: Layout, Flexbox & Grid, Spacing, Sizing, Typography, Backgrounds, Borders, Effects, Filters, Tables, Transitions & Animation, Transforms, Interactivity, SVG, and Accessibility.

Values are the corresponding Tailwind class string or an array of strings (for responsive variants).

### Special keys

| Key | Behaviour |
|-----|-----------|
| `other` | Escape hatch for arbitrary class names not covered by a typed property. Applied **after** all typed properties. |
| `lineHeight` | Always applied **last** to ensure it overrides any `fontSize` that bundles a default line-height. |

## Key behaviours

- **Class ordering**: component-level typed properties, then `other`, then `lineHeight`.
- **tailwind-merge semantics**: consumer `className` wins when there is a Tailwind conflict (e.g. `className="block"` overrides `display: 'flex'`).
- **Prop forwarding**: all props (including `id`, `data-*`, `aria-*`, event handlers) are forwarded to the underlying element.

## File structure

| File | Purpose |
|------|---------|
| `index.ts` | `glide` function and internal `flattenGlidepathObject` |
| `utils.ts` | `flattenClassNames` helper |
| `types/glidepath-types.ts` | `GlidepathObject`, `GlidePathFunction`, `ExpandedValue` |
| `types/tailwind-types.ts` | `TailwindValues` -- maps every CSS property to its valid Tailwind class literals |
| `types/utility-types.ts` | Shared type primitives (`Color`, `BlendMode`, `SizeValue`, `SpacingValue`, etc.) |
| `index.test.tsx` | Tests for `glide` |
| `utils.test.ts` | Tests for `flattenClassNames` |

## Extending the type system

To add support for a new Tailwind utility:

1. Add the value type to `TailwindValues` in `types/tailwind-types.ts` (using helpers from `types/utility-types.ts` if applicable).
2. Add the corresponding key to `GlidepathObject` in `types/glidepath-types.ts`, wrapped with `ExpandedValue<>` for responsive support.

## Running tests

```bash
cd packages/frontend
pnpm run test:unit -- --testPathPattern=glidepath
```
