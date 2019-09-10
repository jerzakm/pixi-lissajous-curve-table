import { Sprite, Graphics, resources, Texture, Container, utils, Program, filters } from "pixi.js"
import { renderer } from "../core/renderer"
import { loader } from ".."
import { PixelLimitedColorFilter } from "./PixelLimitedColor"
import * as PixiFilters from 'pixi-filters'
import { PaletteLimiter } from "./PaletteLimiter"
import { PaletteLimiterBuilder, RgbColor } from "./PaletteLimiterBuilder";
import Color from 'color'
import { SelectiveDesaturate } from "./SelectiveDesaturate"



const sprites: Sprite[] = [] //0 img, 1 vid

export const initShaderPreview = (parent: Container) => {

  makePreviewSprites(parent)
  return update
}

const update = (delta: number) => {

}

const makePreviewSprites = (parent: Container) => {
  loader
    .add('lk', 'lk.jpg')
    .add('v', 'sv3.mp4')
    .load(async () => {
      const imgSprite = Sprite.from(loader.resources['lk'].texture)
      imgSprite.x = 50
      parent.addChild(imgSprite)

      sprites.push(imgSprite)

      const videoSource = new resources.VideoResource('sv3.mp4', {
        autoPlay: false,
        autoLoad: true,
        updateFPS: 12
      });

      if (videoSource.source instanceof HTMLVideoElement) {
        const vs = videoSource.source
        vs.currentTime = 80
        vs.volume = 0
        await vs.play();
        vs.loop = false


        const texture = Texture.from(vs);
        const vidSprite = Sprite.from(texture)
        vidSprite.scale.x = 0.5
        vidSprite.scale.y = 0.5
        vidSprite.x = imgSprite.x + imgSprite.width

        parent.addChild(vidSprite)
        sprites.push(vidSprite)
      }

      applyFilters()
    })

}

const applyFilters = () => {

  const cga = [
    '#000000',
    '#FF5555',
    '#55FFFF',
    '#FFFFFF',
  ]
  const palette: RgbColor[] = []
  cga.map(c => palette.push(hexStringToRgb(c)))

  hexStringToRgb('#000000')

  const limiterBuilder = new PaletteLimiterBuilder(palette)
  const selectiveDesaturate = new SelectiveDesaturate()


  for (const sprite of sprites) {
    sprite.filters = [
      // new PixiFilters.AdjustmentFilter({ brightness: 1.1, gamma: 1.5, contrast: 1.9, saturation: 0.5, red: 1.3, green: 0.8 }),
      // new PixiFilters.PixelateFilter(4),
      // limiterBuilder,
      selectiveDesaturate
    ]
  }

}

const hexStringToRgb = (hex: string) => {
  const c = new Color(hex)
  return { r: c.red(), g: c.green(), b: c.blue() }
}