import {
  type ComponentProps,
  createElement,
  type JSX,
  type JSXElementConstructor,
} from "react";
import { twMerge } from "tailwind-merge";

import type {
  GlidePathFunction,
  GlidepathObject,
} from "./types/glidepath-types";
import { flattenClassNames } from "./utils";

/**
 * Glidepath component
 *
 * @param Component - The component to style
 * @param styles - The styles to apply to the component
 * @returns The styled component
 */
export function glide<
  // biome-ignore lint/suspicious/noExplicitAny: Unknowable props
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
>(Component: T, styles: GlidepathObject | GlidePathFunction<T>) {
  const classNames =
    typeof styles === "function" ? styles : flattenGlidepathObject(styles);

  const StyledComponent = (props: ComponentProps<typeof Component>) => {
    const compiledClassName =
      typeof classNames === "string"
        ? classNames
        : flattenGlidepathObject(classNames(props));

    const className = props.className
      ? twMerge(`${compiledClassName} ${props.className}`)
      : compiledClassName;

    return createElement(Component, {
      ...props,
      className,
    });
  };

  return StyledComponent as T;
}

/**
 * Flattens a Glidepath object into a single string of class names.
 *
 * @param obj - The Glidepath object to flatten
 * @returns The flattened class names
 */
function flattenGlidepathObject(obj: GlidepathObject) {
  const { lineHeight, other, ...rest } = obj as Record<
    string,
    string | string[]
  > & {
    lineHeight: string | string[];
    other: string | string[];
  };

  const classNames: string[] = [];

  for (const value of Object.values(rest)) {
    classNames.push(flattenClassNames(value));
  }

  if (other) {
    classNames.push(flattenClassNames(other));
  }

  // Line height must be last to override other styles
  if (lineHeight) {
    classNames.push(flattenClassNames(lineHeight));
  }

  return classNames.join(" ");
}

export type { GlidepathObject };
