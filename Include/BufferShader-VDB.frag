#donotrun
#vertex

varying vec2 coord;

void main(void) {
	gl_Position =  gl_Vertex;
	coord = (gl_ProjectionMatrix*gl_Vertex).xy;
}

#endvertex

#include "Color-Management.frag"
#include "Utils-VDB.frag"

#group Post
uniform float Gamma;
uniform float Exposure;

varying vec2 coord;
uniform sampler2D frontbuffer;


void main() {
    vec3 c = texture2D(frontbuffer, coord*.5+.5).rgb;
	
	// Exposure
	c *= Exposure;
	
	// To ACEScg (we assume the frontbuffer is sRGB for compatilibity with other frags)
	c = c * linear2acescg;
	
	// Clamping the negatives
	c = max(c, vec3(0.));
	
	// Tonemapping
	c = RRTAndODTFit(c);
	
	// Back to linear
	c = c * acescg2linear;
	
	// Gamma
	c = pow(c, vec3(1.0/Gamma));
	
	// Dithering to avoid banding
	c += 1./256. * vec3(RANDOM, RANDOM, RANDOM);
	
	gl_FragColor = vec4(clamp(c, vec3(0.), vec3(1.)), 1.);
}
