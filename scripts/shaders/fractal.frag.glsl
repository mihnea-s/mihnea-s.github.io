uniform vec3 u_color;

uniform float u_time;
uniform float u_scroll;

flat in vec3 v_vertexCenter;
varying vec3 v_vertexPosition;

void main() {
  float coeff = 1.0 / length(1.35 * v_vertexPosition - v_vertexCenter);
  gl_FragColor = vec4((coeff / 2.0 + 0.5) * u_color, 1.0);
}
