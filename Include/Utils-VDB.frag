#donotrun

#ifndef UTILS_IMPORTED
#define UTILS_IMPORTED

#extension GL_EXT_gpu_shader4 : enable
#extension GL_ARB_gpu_shader5 : enable
#extension GL_ARB_shader_bit_encoding : enable

const float PI = 3.14159265358979323846264;
const float TWO_PI = 2. * PI;
const float INV_PI = 1. / PI;

#ifndef noUniformImport
uniform int subframe;
uniform float time;
uniform vec2 pixelSize;
uniform sampler2D backbuffer;
#endif

#define ORTHO( v ) normalize(abs(v.x)>abs(v.z) ? vec3(-v.y,v.x,0.) : vec3(0.,-v.z,v.y))
#define RANDOM fhash(seedSquirrel3++)

uint hash(uint i) {
	i *= 0xB5297A4Du;
	i ^= i >> 8;
	i += 0x68E31DA4u;
	i ^= i << 8;
	i *= 0x1B56C4E9u;
	i ^= i >> 8;
	return i;
}

float fhash(uint i) {
	return float(hash(i))/4294967295.;
}

uint seedSquirrel3 = hash(uint(floor(gl_FragCoord.x)+floor(gl_FragCoord.y)*12345.)) ^ hash(uint(subframe));

#endif
