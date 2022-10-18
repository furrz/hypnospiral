#version 300 es

in vec2 aPos;
out vec2 Pos;

void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
    Pos = aPos;
}