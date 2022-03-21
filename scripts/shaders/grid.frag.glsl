#define GRID_SIZE 1.5
#define OUTLINE_CUTOFF 0.95

varying vec2 v_planePosition;

void main() {
  vec2 grid_coord = fract(v_planePosition.xy * GRID_SIZE);
  vec2 side_coord = abs(grid_coord - 0.5) * 2.0;
  vec2 step_coord = step(side_coord, vec2(OUTLINE_CUTOFF, OUTLINE_CUTOFF));
  float is_outline = step(length(step_coord), 1.0);

  // Ew, an if
  if (is_outline < 1.0) {
    discard;
  }

  float outline = is_outline * 0.05;

  gl_FragColor = vec4(outline, outline, outline, is_outline * 0.10);
}
