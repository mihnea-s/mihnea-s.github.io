varying vec2 v_planePosition;

void main()	{
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_planePosition = gl_Position.xz;
}
