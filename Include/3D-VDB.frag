#donotrun

#buffer RGBA32F
#buffershader "BufferShader-VDB.frag"

#camera 3D

#vertex

uniform vec2 pixelSize;

varying vec2 coord;
varying vec2 viewCoord;
varying vec2 viewCoord2;
varying vec2 PixelScale;


void main(void) {
	gl_Position =  gl_Vertex;
	coord = (gl_ProjectionMatrix*gl_Vertex).xy;
	coord.x *= pixelSize.y/pixelSize.x;
	// we will only use gl_ProjectionMatrix to scale and translate, so the following should be OK.
	PixelScale = vec2(pixelSize.x*gl_ProjectionMatrix[0][0], pixelSize.y*gl_ProjectionMatrix[1][1]);
	viewCoord = gl_Vertex.xy;
	viewCoord2 = (gl_ProjectionMatrix*gl_Vertex).xy;
}
#endvertex

#include "Utils-VDB.frag"

#group Camera
uniform float FOV; slider[0,0.4,2.0] NotLockable
uniform vec3 Eye; slider[(-50,-50,-50),(0,0,-10),(50,50,50)] NotLockable
uniform vec3 Target; slider[(-50,-50,-50),(0,0,0),(50,50,50)] NotLockable
uniform vec3 Up; slider[(0,0,0),(0,1,0),(0,0,0)] NotLockable
uniform float FocalPlane; slider[0,1,20]
uniform float Aperture; slider[0,0.0,1.]
uniform float ApertureRatio; slider[.2,2.,5.]
uniform int Blades; slider[0,6,12]
uniform float BladeRotation; slider[0,0,1]
#group Post
uniform float Gamma; slider[0.0,2.2,5.0]
uniform float Exposure; slider[0.0,1.0,3.0]
#group Rendering
uniform int SamplesPerFrame; slider[1,1,32]

varying vec2 coord;
varying vec2 viewCoord;
varying vec2 viewCoord2;
varying vec2 PixelScale;

#ifdef providesInit
void init();
#else
void init() {}
#endif

// implement this;
vec3 color(vec3 pos, vec3 direction);

// n-blade aperture
vec2 sampleAperture() {
	if(Blades < 3) { // circular aperture
		float a = RANDOM*2.*PI;
		return sqrt(RANDOM) * vec2(cos(a), sin(a));
	}
	float side = sin(PI / float(Blades));
	vec2 tri = vec2(RANDOM, RANDOM);
	if(tri.x-tri.y > 0.0) tri = vec2(tri.x-1.0, 1.0-tri.y);
	tri *= vec2(side, -sqrt(1.0-side*side));
	float angle = 2.*PI*(BladeRotation + floor(RANDOM * float(Blades))/float(Blades));
	return cos(angle)*tri + sin(angle)*vec2(tri.y, -tri.x);
}

void main() {
	
	init();
	
	mat3 cam2world;
	{
		vec3 d = normalize(Target-Eye);
		vec3 r = normalize(cross(d, Up));
		vec3 u = cross(r, d);
		cam2world = inverse(mat3(r, u, d));
	}
	
	float sqAp = sqrt(ApertureRatio);
	vec2 apertureDim = Aperture * vec2(1./sqAp, sqAp);
	
	vec3 c = vec3(0.);
	for(int i = 0; i < SamplesPerFrame; i++) {
		vec2 jitteredCoord = coord + 4. * PixelScale*(vec2(RANDOM, RANDOM)-.5);
		vec3 rayPos = vec3(apertureDim * sampleAperture(), 0.);
		vec3 rayDir = normalize(vec3(jitteredCoord * FOV, 1.) * FocalPlane - rayPos);
		c +=  color(Eye + rayPos*cam2world, rayDir*cam2world);
	}
	c /= float(SamplesPerFrame);

	// Accumulate
	gl_FragColor = texture2D(backbuffer, viewCoord*.5+.5);
	gl_FragColor.a++;
	gl_FragColor.rgb = mix(gl_FragColor.rgb, c, 1./gl_FragColor.a);
}
