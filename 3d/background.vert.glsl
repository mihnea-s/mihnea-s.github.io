#define SCROLL_MULTIPLIER 64.0

uniform float u_time;
uniform float u_scroll;

varying float v_globalAltitude;

void main()	{
  float pos_x = sin(u_time / 1000.0); 
  float pos_y = cos(u_time / 1000.0);
  float pos_z = sin(u_time / 1000.0) * cos(u_time / 2000.0) / 1.0 - u_scroll;

  vec3 pos = position + vec3(pos_x, pos_y, pos_z);
  vec4 vertical = vec4(0.0, u_scroll * SCROLL_MULTIPLIER, 0.0, 0.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0) + vertical;

  v_globalAltitude = gl_Position.y;
}
