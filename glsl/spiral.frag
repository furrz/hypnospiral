#version 300 es

precision highp float;

#define PI 3.1415926538

out vec4 outColor;
in vec2 Pos;

uniform vec2 iRes;
uniform float iTime;

uniform vec3 spiralColor;
uniform vec3 bgColor;

uniform float spinSpeed;
uniform float throbSpeed;
uniform float throbStrength;
uniform float zoom;

void main() {
    vec2 truPos = vec2(1.0, iRes.y / iRes.x) * Pos;

    float angle = atan(truPos.y, truPos.x);
    float dist = pow(length(truPos), .4 + sin((iTime + cos(iTime * .05) * 0.1) * throbSpeed) * 0.2);

    float spiFactor = pow(sin(angle + dist * 40. * zoom - iTime * 5. * spinSpeed) + 1.0, 50.);
    spiFactor = clamp(spiFactor, 0., 1.);

    vec3 color = mix(spiralColor, bgColor, spiFactor);
    outColor = vec4(color, 1.0);
}