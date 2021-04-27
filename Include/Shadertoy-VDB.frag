#donotrun
#buffer RGBA32F
#buffershader "Shadertoy-VDB-BufferShader.frag"
#vertex

uniform vec2 pixelSize;
uniform int subframe;
uniform float time;

#group Camera
uniform vec2 Center; slider[(-10,-10),(0,0),(10,10)] NotLockable
uniform float Zoom; slider[0,.1,100] NotLockable
uniform bool MouseClickedIn; checkbox[false]

flat varying float iTime;
flat varying int iFrame;
flat varying vec3 iResolution;
flat varying vec4 iMouse;

flat varying vec2 fragShift;

void main(void) {
	iTime = time;
	iFrame = subframe;
	iResolution = abs(vec3(1./(pixelSize*vec2(gl_ProjectionMatrix[0][0],gl_ProjectionMatrix[1][1])), 1.));
	iMouse = vec4(vec2(1,MouseClickedIn?1:-1).xxyy*(.5-Center.xyxy*.05)*iResolution.xyxy);
	
	fragShift = ((gl_ProjectionMatrix * vec4(-1, -1, 0, 1)).xy*.5+.5)*iResolution.xy;
	
	gl_Position = gl_Vertex;
}
#endvertex

uniform sampler2D backbuffer;

flat varying float iTime;
flat varying int iFrame;
flat varying vec3 iResolution;
flat varying vec4 iMouse;
#define iChannel0 backbuffer

flat varying vec2 fragShift;


#group Textures
#ifdef iChannel1Texture
uniform sampler2D iChannel1; file[texture2.jpg]
#endif
#ifdef iChannel2Texture
uniform sampler2D iChannel2; file[texture2.jpg]
#endif
#ifdef iChannel3Texture
uniform sampler2D iChannel3; file[texture2.jpg]
#endif

#group Cubemaps
#ifndef iChannel1Texture
uniform samplerCube iChannel1; file[cubemap.png]
#endif
#ifndef iChannel2Texture
uniform samplerCube iChannel2; file[cubemap.png]
#endif
#ifndef iChannel3Texture
uniform samplerCube iChannel3; file[cubemap.png]
#endif

#group Post
uniform float Exposure; slider[0.0,1.0,30.0]
uniform float Gamma; slider[0.0,1.0,5.0];
uniform bool Tonemapping; checkbox[true];
uniform bool DivideByAlpha; checkbox[true]

void mainImage( out vec4 fragColor, in vec2 fragCoord );

void main() {
	mainImage(gl_FragColor, gl_FragCoord.xy+fragShift);
}

#extension GL_EXT_gpu_shader4 : enable
#extension GL_ARB_gpu_shader5 : enable
#extension GL_ARB_shader_bit_encoding : enable
