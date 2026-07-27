export interface ImageData {
  url: string;
  prompt: string;
  model: string;
  ratio: string;
  summary?: string;
}

export const DEFAULT_PROMPTS = [
  "A hyperrealistic futuristic cyberpunk city street under neon rain, cinematic lighting, 8k",
  "Astronaut riding a horse in space, photorealistic, nebula background, stars",
  "A glowing mystical forest with bioluminescent mushrooms and spirits, fantasy art",
  "Stunning architectural villa integrated into a cliffside overlooking a stormy ocean, dusk",
  "Minimalist abstract sculpture of a face made of marble and gold leaf, studio lighting",
  "A close-up portrait of a majestic lion with fiery glowing eyes, dark fantasy style",
  "A cozy library cabin in winter, fireplace crackling, soft warm lighting, snow outside",
  "Retro-futuristic sports car speeding down a digital grid highway, synthwave vibes",
  "Cute fluffy baby dragon playing with a ball of yarn, 3D Pixar style render",
  "Epic waterfall inside a giant cave leading to a lost underground civilization, concept art",
  "Macro shot of a butterfly wing, iridescent patterns, glowing particles, dreamy",
  "A futuristic workspace with holographic screens, mechanical arms, cyber tech",
  "Ancient Greek temple built on floating islands in the sky, dramatic clouds, sunlight rays",
  "Surreal clock melting over a desert dune, Salvador Dali style, warm sunset colors",
  "Steampunk airship docking at a Victorian station, mechanical details, copper and brass",
  "A tranquil Zen garden with glowing stepping stones and a black sand river, night time",
  "Cybernetic jellyfish floating in a deep dark abyss, electric blue tentacles",
  "A high-fashion portrait of a model wearing a dress made of living flowers, studio lighting"
];

export const MODELS = ["Flux Schnell", "Flux Klein", "Flux Dev"];
export const RATIOS = ["2:3", "1:1", "16:9", "9:16", "4:3"];
