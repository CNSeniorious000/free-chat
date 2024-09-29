export type RGB = [number, number, number]

export function getRgb(color: string): RGB {
  // Create a <template> element to get the RGB value of the color
  const div = document.createElement('div')
  // Set the inner HTML of the template with a <div> that has the specified color
  div.style.display = 'hidden'
  div.style.color = color
  document.body.appendChild(div)

  // Retrieve the computed color style of the temporary element
  const computedColor = getComputedStyle(div).color
  document.body.removeChild(div)

  // Match the RGB or RGBA format using a regular expression
  const rgbMatch = computedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:.*)?\)$/)
  if (rgbMatch) {
    // Return an RGB object with parsed red, green, and blue values
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10),
    ]
  } else {
    // Throw an error if the color format is invalid
    throw new Error('Invalid color format')
  }
}
