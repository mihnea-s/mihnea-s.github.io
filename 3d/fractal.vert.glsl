uniform vec3 u_center;
uniform float u_time;
uniform float u_scroll;

flat out vec3 v_vertexCenter;
varying vec3 v_vertexPosition;

void main()	{
  float wobble_x = sin(u_time / 1000.0) / 10.0; 
  float wobble_y = cos(u_time / 1000.0) / 2.0;
  float wobble_z = sin(u_time / 1000.0) * cos(u_time / 2000.0) / 1.0;
  vec3 wobble = vec3(wobble_x, wobble_y, wobble_z) / 10.0;

  float wave_amplitude = 0.05;
  float wave_frequency = 20.0;

  vec3 time = vec3(u_time, u_time, u_time) / 1060.0;
  vec3 scroll = 10.0 * vec3(u_scroll, u_scroll, u_scroll);

  vec3 sphere_coords = wave_frequency * normalize(position - u_center);
  sphere_coords += time - scroll;

  vec3 sin_pos = wave_amplitude * sin(sphere_coords);
  vec3 cos_pos = wave_amplitude * cos(sphere_coords);

  float t = clamp(u_scroll / 1800.0, 0.0, 1.0); 
  vec3 vertex = position + t * sin_pos + (1.0 - t) * cos_pos + wobble;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(vertex, 1.0);

  v_vertexCenter = gl_Position.xyz;
  v_vertexPosition = gl_Position.xyz;
}
