export default {}

export const setHueVal = (percent, height) => {
  return height * percent
}

export const getHueVal = (top, height) => {
  const percentFormat = (top / height).toFixed(2)
  return 360 * percentFormat
}

export const getRGBonHueSlider = (top, height) => {
  const area = Math.floor((top / height) * 100)
  const areaSort = Math.floor(area / 17)
  const areaSize = (top - areaSort * 17) / 17
  const colorVal = Math.floor(255 * areaSize)
  let rgb
  switch (areaSort) {
    case 0: {
      rgb = [255, colorVal, 0]
      break
    }
    case 1: {
      rgb = [colorVal, 255, 0]
      break
    }
    case 2: {
      rgb = [0, 255, colorVal]
      break
    }
    case 3: {
      rgb = [0, colorVal, 255]
      break
    }
    case 4: {
      rgb = [colorVal, 0, 255]
      break
    }
    default:
      rgb = [255, 0, colorVal]
  }
  return rgb
}
