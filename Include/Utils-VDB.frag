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

vec3 ortho(vec3 v) {
	return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y,v.x,0.) : vec3(0.,-v.z,v.y));
}

uint hash(uint i) {
	i *= 0xB5297A4Du;
	i ^= i >> 12;
	i += 0x68E31DA4u;
	i ^= i >> 12;
	i *= 0x1B56C4E9u;
	i ^= i >> 12;
	return i;
}

float uintRangeToFloat(uint i) {
	return float(i) / float(0xFFFFFFFFu);
}

uint pixelHash = hash(uint(gl_FragCoord.x) + uint(gl_FragCoord.y) * 0x259e8118u);
uint seedSquirrel3 = pixelHash ^ hash(uint(subframe));

float random() {
	return uintRangeToFloat(hash(seedSquirrel3++));
}

const uint PRNG_AA_U = 0u;
const uint PRNG_AA_V = 1u;
const uint PRNG_DOF_U = 2u;
const uint PRNG_DOF_V = 3u;
const uint PRNG_BASE = 4u;

const uint PRNG_BRDF_U = 0u;
const uint PRNG_BRDF_V = 1u;
const uint PRNG_BRDF = 2u;
const uint PRNG_BOUNCE = 3u;

uint prngSample;

float prng(uint dimension)
{
	if (dimension < 32u && false) {
	
		uint sqPrime;
		
		// 🙈
		if (dimension < 16u) {
			if (dimension < 8u) {
				sqPrime |= uint(dimension ==  0u) * 0x3f63d9abu;
				sqPrime |= uint(dimension ==  1u) * 0x9b67ae84u;
				sqPrime |= uint(dimension ==  2u) * 0x5369f372u;
				sqPrime |= uint(dimension ==  3u) * 0x8992f539u;
				sqPrime |= uint(dimension ==  4u) * 0x3be0cd18u;
				sqPrime |= uint(dimension ==  5u) * 0x6a09e667u;
				sqPrime |= uint(dimension ==  6u) * 0xcbbb9d5cu;
				sqPrime |= uint(dimension ==  7u) * 0x310e527fu;
			} else {
				sqPrime |= uint(dimension ==  8u) * 0x8b05688au;
				sqPrime |= uint(dimension ==  9u) * 0x629a2929u;
				sqPrime |= uint(dimension == 10u) * 0x91590159u;
				sqPrime |= uint(dimension == 11u) * 0x452fecd8u;
				sqPrime |= uint(dimension == 12u) * 0x67332667u;
				sqPrime |= uint(dimension == 13u) * 0x8eb44a86u;
				sqPrime |= uint(dimension == 14u) * 0xdb0c2e0bu;
				sqPrime |= uint(dimension == 15u) * 0x47b5481du;
			}
		} else {
			if (dimension < 24u) {
				sqPrime |= uint(dimension == 16u) * 0xae5f9155u;
				sqPrime |= uint(dimension == 17u) * 0xcf6c85d1u;
				sqPrime |= uint(dimension == 18u) * 0x2f73477du;
				sqPrime |= uint(dimension == 19u) * 0x6d1826cau;
				sqPrime |= uint(dimension == 20u) * 0x8b43d455u;
				sqPrime |= uint(dimension == 21u) * 0xe360b595u;
				sqPrime |= uint(dimension == 22u) * 0x1c456002u;
				sqPrime |= uint(dimension == 23u) * 0x6f196330u;
			} else {
				sqPrime |= uint(dimension == 24u) * 0xd94ebeafu;
				sqPrime |= uint(dimension == 25u) * 0x9cc4a611u;
				sqPrime |= uint(dimension == 26u) * 0x261dc1f2u;
				sqPrime |= uint(dimension == 27u) * 0x5815a7bdu;
				sqPrime |= uint(dimension == 28u) * 0x70b7ed67u;
				sqPrime |= uint(dimension == 29u) * 0xa1513c68u;
				sqPrime |= uint(dimension == 30u) * 0x44f93634u;
				sqPrime |= uint(dimension == 31u) * 0x720dcdfcu;
			}
		}
		
		return uintRangeToFloat(prngSample * sqPrime);
	} else {
		return uintRangeToFloat(hash(prngSample * 0x7b860223u + dimension));
	}
}

#endif
