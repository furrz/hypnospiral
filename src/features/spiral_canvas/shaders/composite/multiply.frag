precision highp float;

varying vec2 uv;
uniform sampler2D layer1;
uniform sampler2D layer2;

void main() {
    vec4 c1 = texture2D(layer1, uv);
    vec4 c2 = texture2D(layer2, uv);
    // addition compositing
    vec3 color = mix(c1.rgb, c1.rgb * c2.rgb, c2.a);
    float alpha = max(c1.a, c2.a);
    gl_FragColor = vec4(color, alpha);
}