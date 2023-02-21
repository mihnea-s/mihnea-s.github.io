uniform vec3 u_color;

varying float v_globalAltitude;

void main() {
  float altitude = clamp((v_globalAltitude + 120.0) / 250.0, 0.0, 1.0);
  float alpha = -4.0 * altitude * (altitude - 1.0);
  gl_FragColor = vec4(u_color, alpha);
}
