precision highp float;

#define PI 3.1415926538

varying vec2 uv;

uniform vec2 iRes;
uniform float iTime;

uniform vec3 spiralColor;
uniform vec3 bgColor;

uniform float spinSpeed;
uniform float throbSpeed;
uniform float throbStrength;
uniform float zoom;

void main() {
    vec2 truPos = vec2(1.0, iRes.y / iRes.x) * (uv - vec2(0.5, 0.5)) * 2.0;

    float angle = atan(truPos.y, truPos.x);
    float dist = pow(length(truPos), .4 + sin((iTime + cos(iTime * .05) * 0.1) * throbSpeed) * 0.2 * throbStrength);

    float spiFactor = pow(sin(dist * 40. * zoom - iTime * 5. * spinSpeed) + 1.0, 50.);
    spiFactor = clamp(spiFactor, 0., 1.);

    vec3 color = mix(spiralColor, bgColor, spiFactor);
    gl_FragColor = vec4(color, 1.0);
}