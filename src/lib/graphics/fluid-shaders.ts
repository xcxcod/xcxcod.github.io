// Adapted from Giats fluid shaders. Copyright (c) 2025 Evangelos Giatsidis.
// MIT license: public/licenses/giats-MIT.txt

export const base = `#version 300 es
precision highp float;
in vec2 position;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;

void main() {
  vUv = position * 0.5 + 0.5;

  vL = vUv - vec2(texelSize.x, 0.0);

  vR = vUv + vec2(texelSize.x, 0.0);

  vT = vUv + vec2(0.0, texelSize.y);

  vB = vUv - vec2(0.0, texelSize.y);

  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const splat = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 vUv;

uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 uColor;
uniform vec2 uPointer;
uniform float uRadius;

void main() {
    vec2 p = vUv - uPointer.xy;

    p.x *= aspectRatio;

    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;

    vec3 base = texture(uTarget, vUv).xyz;

    fragColor = vec4(base + splat, 1.0);
}
`;

export const curl = `#version 300 es
precision highp float;
out vec4 fragColor;


in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

uniform sampler2D uVelocity;

void main() {
    float L = texture(uVelocity, vL).y;

    float R = texture(uVelocity, vR).y;

    float T = texture(uVelocity, vT).x;

    float B = texture(uVelocity, vB).x;

    float vorticity = R - L - T + B;

    fragColor = vec4(vorticity, 0.0, 0.0, 1.0);
}
`;

export const vorticity = `#version 300 es
precision highp float;
out vec4 fragColor;


in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlValue;
uniform float dt;

void main() {
    float L = texture(uCurl, vL).x;

    float R = texture(uCurl, vR).x;

    float T = texture(uCurl, vT).x;

    float B = texture(uCurl, vB).x;

    float C = texture(uCurl, vUv).x;

    vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L)) * 0.5;

    force /= length(force) + 1.;

    force *= uCurlValue * C;

    force.y *= -1.;

    vec2 vel = texture(uVelocity, vUv).xy;

    fragColor = vec4(vel + force * dt, 0.0, 1.0);
}
`;

export const divergence = `#version 300 es
precision highp float;
out vec4 fragColor;


in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

uniform sampler2D uVelocity;

void main() {
    float L = texture(uVelocity, vL).x;

    float R = texture(uVelocity, vR).x;

    float T = texture(uVelocity, vT).y;

    float B = texture(uVelocity, vB).y;

    vec2 C = texture(uVelocity, vUv).xy;

    if(vL.x < 0.0) {
        L = -C.x;
    }

    if(vR.x > 1.0) {
        R = -C.x;
    }

    if(vT.y > 1.0) {
        T = -C.y;
    }

    if(vB.y < 0.0) {
        B = -C.y;
    }

    float div = 0.5 * (R - L + T - B);

    fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

export const clear = `#version 300 es
precision highp float;
out vec4 fragColor;


in vec2 vUv;
uniform sampler2D uTexture;
uniform float uClearValue;

void main() { fragColor = uClearValue * texture(uTexture, vUv); }
`;

export const pressure = `#version 300 es
precision highp float;
out vec4 fragColor;


in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main() {
    float L = texture(uPressure, vL).x;

    float R = texture(uPressure, vR).x;

    float T = texture(uPressure, vT).x;

    float B = texture(uPressure, vB).x;

    float C = texture(uPressure, vUv).x;

    float divergence = texture(uDivergence, vUv).x;

    float pressure = (L + R + B + T - divergence) * 0.25;

    fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

export const gradientSubstract = `#version 300 es
precision highp float;
out vec4 fragColor;


in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main() {
    float L = texture(uPressure, vL).x;

    float R = texture(uPressure, vR).x;

    float T = texture(uPressure, vT).x;

    float B = texture(uPressure, vB).x;

    vec2 velocity = texture(uVelocity, vUv).xy;

    velocity.xy -= vec2(R - L, T - B);

    fragColor = vec4(velocity, 0.0, 1.0);
}
`;

export const advection = `#version 300 es
precision highp float;
out vec4 fragColor;


in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float uDissipation;

void main() {
    vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;

    fragColor = uDissipation * texture(uSource, coord);

    fragColor.a = 1.0;
}
`;
