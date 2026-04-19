precision highp float;

#define PI 3.1415926538
#define e  2.71828182845904523

varying vec2 uv;

uniform vec2 iRes;
uniform float iTime;

uniform vec3 spiralColor;

uniform float arms;
uniform float spinSpeed;
uniform float throbSpeed;
uniform float throbStrength;
uniform float zoom;
uniform float thickness;
uniform float blur;
uniform float opacity;

void main() {
    vec2 truPos = vec2(1.0, iRes.y / iRes.x) * (uv - vec2(0.5, 0.5)) * 2.0;

    float angle = atan(truPos.y, truPos.x);
    float throbfactor = .4 + sin((iTime + cos(iTime * .05) * 0.1) * throbSpeed) * 0.2 * throbStrength;
    float dist = pow((abs(truPos.x) + abs(truPos.y)), throbfactor);

    float spiFactor = sin(dist * 40. * zoom - iTime * 5. * spinSpeed) + 1.0;
    float threshold = 2.0 - thickness;
    float safeBlur = min(blur, threshold);
    spiFactor = smoothstep(threshold - safeBlur, threshold, spiFactor);
    float spiOpacity = spiFactor * opacity;

    gl_FragColor = vec4(spiralColor, spiOpacity);
}