/**
 * Flattens an array of class names into a single string of class names.
 *
 * @param classNames - The class names to sort and flatten
 * @returns The flattened class names
 */
export function flattenClassNames(classNames: string | string[]): string {
  return typeof classNames === "string" ? classNames : classNames.join(" ")
}
