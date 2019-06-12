import * as Phaser from 'phaser'
import anime from 'animejs'

export class PostProcessing extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
  private _rgbOffset: number = 0.2
  private _horzFuzz: number = 0.1

  constructor (game: Phaser.Game) {
    super({
      game,
      renderer: game.renderer,
      fragShader:`
        precision mediump float;

        // change these values to 0.0 to turn off individual effects
        #define VERT_JERK 0.
        #define VERT_MOVEMENT 0.
        #define BOTTOM_STATIC 0.
        #define SCALINES .4
        // #define RGB_OFFSET .2
        // #define HORZ_FUZZ .1
        #define RAND_NOISE .1
        #define FISHEYE -.014
        #define ZOOM .96

        // varying vec2 vTextureCoord;
        varying vec2 outTexCoord;
        varying vec4 vColor;
        uniform sampler2D uSampler;

        uniform vec2 resolution;
        uniform float time;
        uniform vec2 mouse;
        uniform float rgb_offset;
        uniform float horz_fuzz;

        // Noise generation functions borrowed from:
        // https://github.com/ashima/webgl-noise/blob/master/src/noise2D.glsl

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec2 mod289(vec2 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec3 permute(vec3 x) {
          return mod289(((x*34.0)+1.0)*x);
        }

        float snoise(vec2 v) {
          const vec4 C = vec4(
            0.211324865405187,  // (3.0-sqrt(3.0))/6.0
            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
            -0.577350269189626, // -1.0 + 2.0 * C.x
            0.024390243902439  // 1.0 / 41.0
          );

          // First corner
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);

          // Other corners
          vec2 i1;
          //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
          //i1.y = 1.0 - i1.x;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          // x0 = x0 - 0.0 + 0.0 * C.xx ;
          // x1 = x0 - i1 + 1.0 * C.xx ;
          // x2 = x0 - 1.0 + 2.0 * C.xx ;
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;

          // Permutations
          i = mod289(i); // Avoid truncation effects in permutation
          vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0 )) +
            i.x + vec3(0.0, i1.x, 1.0 )
          );

          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);

          m = m*m;
          m = m*m;

          // Gradients: 41 points uniformly over a line, mapped onto a diamond.
          // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;

          // Normalise gradients implicitly by scaling m
          // Approximation of: m *= inversesqrt( a0*a0 + h*h );
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

          // Compute final noise value at P
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        float staticV(vec2 uv) {
          float staticHeight = snoise(vec2(9.0,time*1.2+3.0))*0.3+5.0;
          float staticAmount = snoise(vec2(1.0,time*1.2-6.0))*0.1+0.3;
          float staticStrength = snoise(vec2(-9.75,time*0.6-3.0))*2.0+2.0;
          return (1.0-step(snoise(vec2(5.0*pow(time,2.0)+pow(uv.x*7.0,1.2),pow((mod(time,100.0)+100.0)*uv.y*0.3+3.0,staticHeight))),staticAmount))*staticStrength;
        }

        float rand(vec2 co) {
          return fract(sin(dot(vec2(co.x + time * .001, co.y + time * .001) ,vec2(12.9898,78.233))) * 43758.5453);
        }

        void main() {
          float aspectRatio = resolution.x / resolution.y;
          float area = resolution.x * resolution.y;
          float fisheye = FISHEYE;//*area/400000.;
          vec2 fisheyeIntensity = vec2(fisheye * aspectRatio, fisheye * aspectRatio);
          vec2 fisheyeCoords = outTexCoord;
          fisheyeCoords = (fisheyeCoords - 0.5) * 2.0;
          vec2 fisheyeRealCoordOffs;
          fisheyeRealCoordOffs.x = (fisheyeCoords.y * fisheyeCoords.y) * fisheyeIntensity.y * (fisheyeCoords.x);
          fisheyeRealCoordOffs.y = (fisheyeCoords.x * fisheyeCoords.x) * fisheyeIntensity.x * (fisheyeCoords.y);
          fisheyeRealCoordOffs.y = 1. - fisheyeRealCoordOffs.y;
          vec2 computedCoords = (outTexCoord - fisheyeRealCoordOffs) * ZOOM + (1. - ZOOM)*.5;
          // computedCoords.y -= (1. - ZOOM)*.5 - .005;
          // vec2 zoomedCoords = computedCoords*(1. - ZOOM);

          float jerkOffset = (1.0-step(snoise(vec2(time*1.3,5.0)),0.8))*0.05;
          float fuzzOffset = snoise(vec2(time*15.0,computedCoords.y*80.0))*0.003;
          float largeFuzzOffset = snoise(vec2(time*1.0,computedCoords.y*25.0))*0.004;
          float vertMovementOn = (1.0-step(snoise(vec2(time*0.2,8.0)),0.4))*VERT_MOVEMENT;
          float vertJerk = (1.0-step(snoise(vec2(time*1.5,5.0)),0.6))*VERT_JERK;
          float vertJerk2 = (1.0-step(snoise(vec2(time*5.5,5.0)),0.2))*VERT_JERK;
          float yOffset = abs(sin(time)*4.0)*vertMovementOn+vertJerk*vertJerk2*0.3;
          float y = mod(computedCoords.y+yOffset,1.0);
          float xOffset = (fuzzOffset + largeFuzzOffset) * horz_fuzz;
          float staticVal = 0.0;

          for (float y = -1.0; y <= 1.0; y += 1.0) {
            float maxDist = 5.0/200.0;
            float dist = y/200.0;
            staticVal += staticV(vec2(computedCoords.x,computedCoords.y+dist))*(maxDist-abs(dist))*1.5;
          }

          staticVal *= BOTTOM_STATIC;

          float r = 0.;
          float g = 0.;
          float b = 0.;

          if (computedCoords.y <= 0.) {
            r = texture2D(uSampler, vec2(computedCoords.x + xOffset -0.01*rgb_offset, y)).r + staticVal;
            g = texture2D(uSampler, vec2(computedCoords.x + xOffset,                  y)).g + staticVal;
            b = texture2D(uSampler, vec2(computedCoords.x + xOffset +0.01*rgb_offset, y)).b + staticVal;
          }

          vec3 color = vec3(r, g, b);
          float scanline = sin(computedCoords.y*800.0 + time * .02)*0.04*SCALINES;
          color -= scanline;

          float randNoise = rand(computedCoords) * RAND_NOISE - (RAND_NOISE * .5);

          gl_FragColor = randNoise + vec4(color, 1.0);
        }
      `
    })

    this.setFloat1('rgb_offset', this.rgbOffset)
    this.setFloat1('horz_fuzz', this.horzFuzz)
  }

  update(time: number, delta: number) {
    this.setFloat1('time', time)
    this.setFloat2('resolution', this.renderer.width, this.renderer.height)
  }

  get rgbOffset(): number {
    return this._rgbOffset
  }

  set rgbOffset(v: number) {
    this._rgbOffset = v
    this.setFloat1('rgb_offset', v)
  }

  get horzFuzz(): number {
    return this._horzFuzz
  }

  set horzFuzz(v: number) {
    this._horzFuzz = v
    this.setFloat1('horz_fuzz', v)
  }

  public glitch() {
    anime({
      targets: this,
      rgbOffset: [.2, 2],
      horzFuzz: [.1, 3],
      duration: 300,
      direction: 'alternate',
      easing: 'easeOutQuint'
    })
  }
}
